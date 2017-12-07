import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

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

  constructor(private viewCtrl: ViewController, params: NavParams) {
    let value = params.get('loop');
    this.loop = value === true ? '' : null;
    value = params.get('controls');
    this.controls = (value === false ) ? null : '';
    value = params.get('autoplay');
    this.autoplay = value === true ? 'autoplay' : null;
    this.url = params.get('url');
    this.type = 'video/mp4';    
    this.autoclose = !(params.get('autoclose') === false);
  }

  dismiss() {
    this.viewCtrl.dismiss({}); //Any data can be passed back here
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.video.nativeElement.addEventListener('playing', (e) => { this.notPlaying = false });
    this.video.nativeElement.addEventListener('pause', (e) => { this.notPlaying = true });
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
