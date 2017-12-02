import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  private basePath:string;

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
    })
  }

  open(content, $event) {
    if (this.viewType === 'video') {
      this.mediaPlayer.playVideo({ path: content.path });
    }
    if (this.viewType === 'audio') {
      console.log('opening audio');
    }
    if (this.viewType == 'images') {
      let img = $event.currentTarget.querySelector('img');
      let imgViewer = this.imageViewerCtrl.create(img);
      imgViewer.present();
    }
  }


}
