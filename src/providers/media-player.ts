import { Injectable } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

//import { NativeAudio } from '@ionic-native/native-audio';
import { VideoPlayerComponent } from '../components/video-player/video-player';
import { MediaCatalog } from './media-player.catalog';

//import "pixi";
//import "p2";
//import * as Phaser from "phaser-ce";

const videoCatalog = {
  'intro': 'content/video/intro.mp4',
  'home_intro': 'game/vid/shared/home_intro.mp4',
  'game_intro': 'game/vid/shared/game_intro.mp4',
  'select_howto': 'game/vid/shared/select_howto.mp4',
  'select2_howto': 'game/vid/shared/select2_howto.mp4',
  'drag_howto': 'game/vid/shared/drag_howto.mp4',
  'mark_howto': 'game/vid/shared/mark_howto.mp4',
  'sort_howto': 'game/vid/shared/sort_howto.mp4',
  'classify_howto': 'game/vid/shared/classify_howto.mp4',
  'level1_intro': 'game/vid/l_1/intro.mp4',
  'level2_intro': 'game/vid/l_2/intro.mp4',
  'level3_intro': 'game/vid/l_3/intro.mp4',
  'level4_intro': 'game/vid/l_4/intro.mp4',
  'level5_intro': 'game/vid/l_5/intro.mp4'
};


@Injectable()
export class MediaPlayer {
  audioType: string = 'html5';
  sounds: any = [];
  playingAudioHash: any = {};
  soundEventEmitter: ReplaySubject<any> = new ReplaySubject(1);


  private mediaCatalog;

  constructor(platform: Platform,
      private modalCtrl: ModalController
      //private nativeAudio: NativeAudio
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

  playVideoFromCatalog(key:string, options?:any) {
    return this.playVideo({ path: videoCatalog[key] }, 'portrait', options);
  }

  playVideo(video, orientation:string = 'portrait', options?:any):Observable<any> {
    return this.playVideoBrowser(video.path, options);
  }

  private playVideoBrowser(path, options?:any):Observable<any> {
    let modal = this.modalCtrl.create(VideoPlayerComponent, {
      autoplay: true,
      loop: false,
      url: 'assets/' + path,
      options: options
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
      /*if (asset.simple) {
        this.nativeAudio.preloadSimple(asset.key, asset.path);
      }
      else if (asset.preload) {
        this.nativeAudio.preloadComplex(asset.key, asset.path, .8, 1, 0);
      }*/
    }      
    else {
      sound.audio = new CustomHTMLAudio(asset.path, this.soundEventEmitter);
    }
  }

  private playAudioByKey(key, options): Observable<any> {
 
    let sound = this.sounds.find((sound) => { return sound.key === key; });
    if (sound == null) {
      return Observable.of('NotFound:' + key);
    }

    if(this.audioType === 'html5'){
      if (options.stopAll) {
        this.soundEventEmitter.next('stop');
      }
      return sound.audio.play();
    } /*else {
      return Observable.fromPromise(this.nativeAudio.play(sound.key));
    }*/
  }

  private stopAudioByKey(key): Observable<any> {
 
    let sound = this.sounds.find((sound) => { return sound.key === key; });
    if (sound == null) return Observable.of('NotFound');

    if(this.audioType === 'html5'){      
      return Observable.fromPromise(sound.audio.stop());
    } /*else {
      return Observable.fromPromise(this.nativeAudio.stop(key));
    }*/
  }
}

export class CustomHTMLAudio {
  private audioEl:HTMLAudioElement;
  private path: string;
  constructor(path:string, eventEmitter: ReplaySubject<any>) {
    this.audioEl = new Audio(path);
    this.path = path;
    eventEmitter.subscribe(event => {
      if (event == 'stop') {
        this.stop();
      }
    });
    /*
    this.audioEl.addEventListener('error', function (ev) {
      console.log('error:'+path);
      console.log(ev);
    });
    this.audioEl.addEventListener('abort', function (ev) {
      console.log('abort:'+path);
      console.log(ev);
    });
    this.audioEl.addEventListener('loadstart', function (ev) {
      console.log('loadstart:'+path);
      console.log(ev);
    });
    this.audioEl.addEventListener('playing', function (ev) {
      console.log('playing:'+path);
      console.log(ev);
    });
    this.audioEl.addEventListener('ended', function (ev) {
      console.log('pause:'+path);
      console.log(ev);
    });*/
  }

  play(debug = false):Observable<any>{
    return Observable.create(observer => {
      let el = this.audioEl;
      el.src = this.path;
      this.audioEl.play()
      .then(() => {
        let onError = (e) => { 
          observer.next({succeed: false, reason: 'Error: ' + el.error })
          observer.complete();
          el.removeEventListener('error', onError);
        };
        let onAbort = (e) => { 
          observer.next({succeed: false, reason: 'Aborted:' + el.error });
          observer.complete();
          el.removeEventListener('abort', onError);
        };
        let onEnd = (e) => { 
          observer.next({succeed: true });
          observer.complete();
          el.removeEventListener('ended', onError);
        };
        let onPause = (e) => { 
          observer.next({succeed: false, reason: 'Paused: ' });
          observer.complete();
          el.removeEventListener('ended', onError);
        };
        el.addEventListener('error', onError);
        el.addEventListener('abort', onAbort);
        el.addEventListener('ended', onEnd);
        el.addEventListener('pause', onPause);
      })
      .catch(reason => {
        observer.next({succeed: false, reason: reason });
      });
    });
  }

  stop(){
    if (this.audioEl.paused) return;
    this.audioEl.pause();
    this.audioEl.currentTime = 0;
    return Observable.of(true);
  }
}
