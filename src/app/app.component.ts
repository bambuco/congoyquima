import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { AppDataProvider } from '../providers/app-data';
import { GameDataProvider } from '../providers/game-data';

//import { Splash } from './splash.component';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  //appData and GameData providers are injected here so they get preoloaded
  constructor(platform: Platform,
    private statusBar: StatusBar,
    private androidFS: AndroidFullScreen,
    appData: AppDataProvider, 
    gameData: GameDataProvider
    //private splashScreen: SplashScreen,
    //private modalCtrl: ModalController
    ) {
    platform.ready().then((source) => {
      if (source == 'cordova'){
        this.cordovaInit();
      }
    });
    platform.resume.subscribe(() => {
      this.cordovaInit();
    });
  }
  
  cordovaInit() {
    //Cordova platform is ready.
    this.statusBar.hide();
    this.androidFS.isImmersiveModeSupported()
      .then(() => this.androidFS.immersiveMode())
      .catch((error: any) => console.log(error));
  }
}

