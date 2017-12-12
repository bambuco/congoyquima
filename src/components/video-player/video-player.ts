import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'video-player',
  templateUrl: 'video-player.html'
})
export class VideoPlayerComponent {  
  @ViewChild('theVideo') video: ElementRef;
  loop: string;
  controls: string;
  autoplay: string;
  url: string;
  type: string;
  notPlaying: boolean;
  autoclose: boolean;
  centered: boolean;
  videoReady: boolean = false;


  constructor(private viewCtrl: ViewController, private loadingCtrl: LoadingController, params: NavParams) {
    let value = params.get('loop');
    this.loop = value === true ? '' : null;
    value = params.get('controls');
    this.controls = (value === false ) ? null : '';
    value = params.get('autoplay');
    this.autoplay = value === true ? 'autoplay' : null;
    this.url = params.get('url');
    this.type = 'video/mp4';    
    this.autoclose = !(params.get('autoclose') === false);
    let options = params.get('options');
    this.centered = options && options.centered === true;
  }

  dismiss() {
    this.viewCtrl.dismiss({}); //Any data can be passed back here
  }

  ionViewDidEnter() {
    this.video.nativeElement.addEventListener('playing', (e) => { 
      setTimeout(() => {
        this.videoReady = true;
      }, 1);
      this.notPlaying = false 
    });
    this.video.nativeElement.addEventListener('pause', (e) => { this.notPlaying = true });
    this.video.nativeElement.addEventListener('loadeddata', (e) => { 
      this.videoReady = true 
    });
    this.video.nativeElement.addEventListener('ended', (e) => { 
      this.notPlaying = true;
      if (this.autoclose) {
        this.dismiss();
      }
    });
    if (this.autoplay) {
      this.play();
    }
    else {
      this.notPlaying = true;
    }
  }

  play() {
    this.video.nativeElement.play();
  }

}
