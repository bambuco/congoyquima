import { Component, AfterViewInit } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

import { AppDataProvider, Flags } from '../providers/app-data';
import { RemoteDataProvider } from '../providers/remote-data';
import { GameDataProvider } from '../providers/game-data';
import { MediaCatalog } from '../providers/media-player.catalog';
import { TepuyAudioPlayerProvider } from '../tepuy-angular/providers' 

//import { Splash } from './splash.component';
import { HomePage } from '../pages/home/home';

import { guid } from '../providers/utils';

export interface registryinfo {
  uuid: string,
  password: string,
  username: string,
  displayname: string
}

import { 
  WIFI_CONFIGURATION_EVENT,
  NETWORK_CONNECTED_EVENT,
  WIFI_ONLY_KEY,
  REGISTRY_INFO_KEY,
  GAME_FACTS_NEXT_KEY,
  GAME_FACTS_NEXT_KEY_TO_SYNC,
  MAX_SYNC_ATTEMPTS
} from '../providers/constants';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements AfterViewInit {
  rootPage:any = HomePage;

  private registered: boolean = false;
  private registryinfo: any;
  private onDevice: boolean;
  private onLine: boolean = false;
  private inSync: boolean = false;
  //appData and GameData providers are injected here so they get preoloaded
  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private androidFS: AndroidFullScreen,
    private mobileAccessibility: MobileAccessibility,
    private uniqueId: UniqueDeviceID,
    private device: Device,
    private network: Network,
    private events: Events,
    private mediaCatalog: MediaCatalog,
    private audioPlayer: TepuyAudioPlayerProvider,
    private appData: AppDataProvider,
    private remoteData: RemoteDataProvider,
    private storage: Storage,
    gameData: GameDataProvider,
    //private splashScreen: SplashScreen,
    //private modalCtrl: ModalController
  ) {
    platform.ready().then((source) => {
      this.onDevice = (source == 'cordova');
      //Subscrite to 
      this.events.subscribe(NETWORK_CONNECTED_EVENT, (status) => {
        this.onNetworkStatusChanged(status);
      });
      this.events.subscribe(WIFI_CONFIGURATION_EVENT, (status) => {
        this.onNetworkStatusChanged(this.isConnected());
      });

      if (this.onDevice){
        this.cordovaInit();
      }
      else {
        this.browserInit();
      }
    });

    platform.resume.subscribe(() => {
      this.cordovaInit();
    });

    //Register all assets and preload the common used
    setTimeout(() => {
      this.assetPreload();
    }, 1);
  }
  
  cordovaInit() {
    //Cordova platform is ready.
    this.androidFS.isImmersiveModeSupported()
      .then(() => this.androidFS.immersiveMode())
      .catch((error: any) => console.log(error));
    this.statusBar.hide();
    this.mobileAccessibility.usePreferredTextZoom(false);

    this.network.onConnect().subscribe(() => {
      this.onLine = this.isConnected()
      this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
    });

    this.network.onDisconnect().subscribe(() => {
      this.onLine = false;
      this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
    });

    this.onLine = this.isConnected();
    this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
  }

  browserInit() {
    Observable.fromEvent(window, 'online')
      .subscribe(() => {
        this.onLine = true;
        this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
      });

    Observable.fromEvent(window, 'offline')
      .subscribe(() => {
        this.onLine = false;
        this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
      });

    this.onLine = navigator.onLine;
    this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
  }

  ngAfterViewInit() {
  }

  private assetPreload() {
    //Register audio sounds so they can be easily preloaded later
    for (let sound of this.mediaCatalog.audios){
      this.audioPlayer.register(sound.key, sound.path, sound.preload);
    }
  }

  isConnected() {
    let wifiOnly = this.appData.getConfig(WIFI_ONLY_KEY, true);
    return (wifiOnly && this.network.type == 'wifi') || (!wifiOnly && this.network.type != 'none');
  }

  private checkRegistrationStatus() {
    if (this.registered === true) return true; //Already registered, nothing else to do.

    this.appData.ready().subscribe(() => {
      const registered = this.appData.hasFlag(Flags.APP_ISREGISTERED);
      let registryinfo = this.appData.get(REGISTRY_INFO_KEY);
      if (!registered) {
        if (!registryinfo) {
          this.defaultRegistryInfo()
            .then((info) => {
              this.appData.set(REGISTRY_INFO_KEY, info)
                .then(() => {
                  this.registryinfo = info;
                  this.registerDevice();
                })
            });
        }
        else {
          this.registryinfo = registryinfo;
          this.registerDevice();
        }
      }
      else {
        this.registered = registered;
        this.appData.setMemory(REGISTRY_INFO_KEY, registryinfo);
        this.checkSyncStatus();
      }
    });
    return false;
  }

  private defaultRegistryInfo():any {
    const username = 'invitado'+(new Date()).getTime();
    const displayname = 'Invitado';
    if (this.onDevice) {
      return this.uniqueId.get()
        .then((id) => {
          return {
            uuid: id,
            password: this.device.uuid,
            username: username,
            displayname: displayname
          };
        });
    }
    else {
      return Promise.resolve().then(() => {
        return {
          uuid: guid(),
          password: guid(),
          username: username,
          displayname: displayname
        };
      });
    }
  }

  private registerDevice() {
    this.remoteData.register(this.registryinfo)
      .subscribe((result) => {
        this.registryinfo.token = result.token;
        this.appData.set(REGISTRY_INFO_KEY, this.registryinfo)
          .then(() => {
            this.appData.setFlag(Flags.APP_ISREGISTERED);
            this.registered = true;
            this.appData.setMemory(REGISTRY_INFO_KEY, this.registryinfo);
            //Check if there is data pending for syncronization
            this.checkSyncStatus();
          })
      });
  }

  private onNetworkStatusChanged(connected:boolean) {
    this.appData.setMemory('onLine', connected);
    if (!connected) return;

    if (!this.checkRegistrationStatus()) return; //App is not registered, wait for registration
    //Try syncing game data
    this.checkSyncStatus();

  }

  private checkSyncStatus(attempt:number=1) {
    if (this.inSync) return;
    this.inSync = true;
    let key = this.appData.get(GAME_FACTS_NEXT_KEY_TO_SYNC, null); //attempt == 1 ? 174 : 
    let nextKey = this.appData.get(GAME_FACTS_NEXT_KEY, null);
    if (attempt > MAX_SYNC_ATTEMPTS) {
      this.appData.set(GAME_FACTS_NEXT_KEY_TO_SYNC, null);
    }

    if (key != null) {
      let skey = `facts_${key}`;
      this.storage.get(skey)
        .then((facts) => {
          if (facts == null) {
            this.appData.set(GAME_FACTS_NEXT_KEY_TO_SYNC, ++key);
            this.inSync = false;
            this.checkSyncStatus(attempt+1);
            return;
          }
          this.remoteData.registerGameFacts(facts, false)
            .then((succeed) => {
              this.inSync = false;
              if (succeed) {
                key++;
                if (key < nextKey) {
                  this.appData.set(GAME_FACTS_NEXT_KEY_TO_SYNC, key);
                  this.checkSyncStatus();
                }
                else {
                  this.appData.set(GAME_FACTS_NEXT_KEY, 0); //reset keys count
                  this.appData.set(GAME_FACTS_NEXT_KEY_TO_SYNC, null);
                }
                //clear the synced key
                this.storage.remove(skey);
              }
            });
        }, () => {
          this.inSync = false;
        });
    }
    else {
      this.inSync = false;
    }
  }
}

