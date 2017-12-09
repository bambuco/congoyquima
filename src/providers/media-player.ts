import { Injectable } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { NativeAudio } from '@ionic-native/native-audio';
import { VideoPlayerComponent } from '../components/video-player/video-player';
import { MediaCatalog } from './media-player.catalog';

//import "pixi";
//import "p2";
//import * as Phaser from "phaser-ce";

const videoCatalog = {
  'intro': 'content/video/intro.mp4'
};


@Injectable()
export class MediaPlayer {
  audioType: string = 'html5';
  sounds: any = [];

  private mediaCatalog;

  constructor(private platform: Platform,
      private modalCtrl: ModalController,
      private nativeAudio: NativeAudio
  ) {
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }

    this.mediaCatalog = new MediaCatalog();
    this.preloadCatalog();
  }

  playAudio(audio) {
    this.playAudioByKey(audio.key);
  }


  playVideoFromCatalog(key:string) {
    return this.playVideo({ path: videoCatalog[key] });
  }

  playVideo(video, orientation:string = 'portrait'):Observable<any> {
    return this.playVideoBrowser(video.path);
  }

  private playVideoBrowser(path):Observable<any> {
    let modal = this.modalCtrl.create(VideoPlayerComponent, {
      autoplay: true,
      loop: false,
      url: 'assets/' + path
    });

    return Observable.create(observer => {
      modal.present().catch((reason) => {
        observer.next({ succeed: false, result: reason });
        observer.complete();
      });
      
      modal.onDidDismiss((result) => {
        observer.next({ succeed: true, result: result });
        observer.complete();
      });
    })
  }

  private preloadCatalog() {
    //preload audios
    for(let audio of this.mediaCatalog.audios) {
      console.log(audio);
      this.preloadAudio(audio);
    }
  }


  private preloadAudio(asset) {
    this.sounds.push({
      key: asset.key,
      path: asset.path
    });
    
    if(this.audioType === 'native'){
      if (asset.simple) {
        this.nativeAudio.preloadSimple(asset.key, asset.path);
      }
      else if (asset.preload) {
        this.nativeAudio.preloadComplex(asset.key, asset.path, .8, 1, 0);
      }
    }      
  }
  
  private playAudioByKey(key){
 
    let audio = this.sounds.find((sound) => { return sound.key === key; });

    if(this.audioType === 'html5'){
      let audioAsset = new Audio(audio.path);
      audioAsset.play();
    } else {
      this.nativeAudio.play(audio.key).then((res) => {
          console.log(res);
      }, (err) => {
          console.log(err);
      });
    }
  }
}
