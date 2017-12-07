import { Injectable } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { VideoPlayerComponent } from '../components/video-player/video-player';


const videoCatalog = {
  'intro': 'content/video/intro.mp4'
};


@Injectable()
export class MediaPlayer {

  constructor(private platform: Platform,
      private modalCtrl: ModalController
  ) {
  }

  playAudio(audio) {

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
}
