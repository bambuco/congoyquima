import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { ContentProvider } from '../../providers/content';

@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {
  content: string;  
  constructor(public navCtrl: NavController, public contentProvider: ContentProvider) {
    let contentAvailable:any = contentProvider.index();
    this.content = contentProvider.content(contentAvailable[0]);
  }

  goHome(){
    this.navCtrl.setRoot(HomePage);
  }
  
}
