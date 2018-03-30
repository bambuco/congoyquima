import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ImageViewerController } from 'ionic-img-viewer';

import { HomePage } from '../home/home';

import { ContentProvider } from '../../providers/content';
import { MediaPlayer } from '../../providers/media-player';

@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {
  noContent: boolean = false;
  contents: Observable<any>;
  viewType: string;

  /* eslint-disable no-unused-vars */
  @ViewChild('audios_thumb')
  private audioThumbTpl: TemplateRef<any>; 
  @ViewChild('videos_thumb')
  private videoThumbTpl: TemplateRef<any>;
  @ViewChild('images_thumb')
  private imagesThumbTpl: TemplateRef<any>;
  @ViewChild('docs_thumb')
  private docsThumbTpl: TemplateRef<any>;
  /* eslint-enable no-unused-vars */

  private currentAudio: HTMLAudioElement;


  constructor(private navCtrl: NavController,
      private contentProvider: ContentProvider,
      private mediaPlayer: MediaPlayer,
      private imageViewerCtrl: ImageViewerController
  ) {
    this.setViewType('audio');
  }

  goHome(){
    this.navCtrl.setRoot(HomePage);
  }

  setViewType(type){
    this.contents = null;
    this.viewType = type;
    this.contents = this.contentProvider.list(this.viewType);
    this.contents.subscribe((data) => {
      this.noContent = !data.length;
    });
  }

  open(content, $event) {
    if (this.viewType === 'video') {
      this.mediaPlayer.playVideo({ path: 'content/video/' + content.path }, { controls: true }).subscribe(() => {});
    }

    if (this.viewType === 'audio') {
    }

    if (this.viewType == 'images') {
      let img = $event.currentTarget.querySelector('img');
      let imgViewer = this.imageViewerCtrl.create(img);
      imgViewer.present();
    }
  }

  viewTemplate() {
    return this[this.viewType+'ThumbTpl'];
  }

  playingAudio(ev) {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentAudio = ev.target;
  }
}
