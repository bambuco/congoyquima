import { Injectable } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

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
  playingAudioHash: any = {};
  soundEventEmitter: ReplaySubject<any> = new ReplaySubject(1);


  private mediaCatalog;

  constructor(platform: Platform,
      private modalCtrl: ModalController,
      private nativeAudio: NativeAudio
  ) {
    if (platform.is('cordova2')) {
      this.audioType = 'native';
    }

    this.mediaCatalog = new MediaCatalog();
    this.preloadCatalog();
  }

  playAudio(audio, options={}): Observable<any> {
    return this.playAudioByKey(audio.key, options);
  }

  stopAudio(audio) {
    return this.stopAudioByKey(audio.key);
  }

  stopAll(){
    this.soundEventEmitter.next('stop');
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
      this.preloadAudio(audio);
    }
  }


  private preloadAudio(asset) {
    let sound:any = {
      key: asset.key,
      path: asset.path
    };
    this.sounds.push(sound);
    
    if(this.audioType === 'native'){
      if (asset.simple) {
        this.nativeAudio.preloadSimple(asset.key, asset.path);
      }
      else if (asset.preload) {
        this.nativeAudio.preloadComplex(asset.key, asset.path, .8, 1, 0);
      }
    }      
    else {
      sound.audio = new CustomHTMLAudio(asset.path, this.soundEventEmitter);
    }
  }

  private playAudioByKey(key, options): Observable<any> {
 
    let sound = this.sounds.find((sound) => { return sound.key === key; });
    if (sound == null) return Observable.of('NotFound');

    if(this.audioType === 'html5'){
      if (options.stopAll) {
        this.soundEventEmitter.next('stop');
      }
      return Observable.fromPromise(sound.audio.play());
    } else {
      return Observable.fromPromise(this.nativeAudio.play(sound.key));
    }
  }

  private stopAudioByKey(key): Observable<any> {
 
    let sound = this.sounds.find((sound) => { return sound.key === key; });
    if (sound == null) return Observable.of('NotFound');

    if(this.audioType === 'html5'){      
      return Observable.fromPromise(sound.audio.stop());
    } else {
      return Observable.fromPromise(this.nativeAudio.stop(key));
    }
  }
}

export class CustomHTMLAudio {
  private audioEl:HTMLAudioElement;
  constructor(path:string, eventEmitter: ReplaySubject<any>) {
    this.audioEl = new Audio(path);
    eventEmitter.subscribe(event => {
      if (event == 'stop') {
        this.stop();
      }
    })
  }

  play(){
    return this.audioEl.play();
  }

  stop(){
    if (this.audioEl.paused) return;
    this.audioEl.pause();
    this.audioEl.currentTime = 0;
    return Observable.of(true);
  }
}
