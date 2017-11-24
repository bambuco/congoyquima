import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-progress',
  templateUrl: 'progress.html'
})
export class ProgressPage {

  players: Array<any>;

  constructor(public navCtrl: NavController) {
    this.players = [
      { avatar: '../assets/avatars/001.png', score: 10 },
      { avatar: '../assets/avatars/002.png', score: 15 },
      { avatar: '../assets/avatars/003.png', score: 30 },
      { avatar: '../assets/avatars/004.png', score: 20 },
      { avatar: '../assets/avatars/005.png', score: 5 }
    ];
  }
  
  goHome(){
    this.navCtrl.setRoot(HomePage);
  }
  
}
