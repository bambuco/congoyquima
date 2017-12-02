import { Injectable } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { File } from '@ionic-native/file';
import { VideoPlayer } from '@ionic-native/video-player';

import { VideoPlayerComponent } from '../components/video-player/video-player';

@Injectable()
export class MediaPlayer {
  private videoOptions: StreamingVideoOptions;

  constructor(private platform: Platform,
      private mediaPlayer: StreamingMedia,
      private modalCtrl: ModalController,
      private videoPlayer: VideoPlayer,
      private file: File) {
    this.videoOptions = {
      successCallback: () => { 
        console.log('Video played')
      },
      errorCallback: (e) => {
        console.log("Streaming error");
        console.log(e);
      },
      orientation: 'portrait'
    }
  }

  playAudio(audio) {

  }

  playVideo(video, orientation:string = 'portrait') {

    if (this.platform.is('android2')) {
      this.playVideoAndroid(video.path, orientation);
    }
    else if (this.platform.is('cordova3')){
      this.playVideoNative(video.path, orientation);
    }
    else {
      this.playVideoBrowser(video.path);
    }
  }

  playVideoAndroid(path, orientation:string) {
    let uri = [this.file.applicationDirectory, 'www/assets/content/video/', path].join('');
    this.videoPlayer.play(uri, {
      scalingMode: 1 //SCALE_TO_FIT 2: SCALE_TO_FIT_WITH_CROPPING
    }).then (() => {
    })
    .catch((err) => {
    })
  }

  playVideoNative(path, orientation:string) {
    let uri = [this.file.applicationDirectory, 'www/assets/content/video/', path].join('');//"http://nuestroscursos.com/montanas_video2.mp4"; //
    let options: StreamingVideoOptions =  {
      successCallback: this.videoOptions.successCallback,
      errorCallback: this.videoOptions.errorCallback,
      orientation: orientation
    }
    this.mediaPlayer.playVideo(uri, options);
  }

  playVideoBrowser(path){
    let modal = this.modalCtrl.create(VideoPlayerComponent, {
      autoplay: true,
      loop: false,
      url: 'assets/content/video/' + path
    });
    modal.present();
  }
}
