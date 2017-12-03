import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { GameDataProvider } from '../../providers/game-data';
import { GamePage } from '../game/game';

import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'page-game-level',
  templateUrl: 'game-level.html'
})
export class GameLevelPage {
  private levelInfo: any;
  private challenges: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private navCtrl: NavController,
      private modalCtrl: ModalController,
      private params: NavParams,
      private gameDataProvider: GameDataProvider
      ) {
    let level = params.get('levelId');

    gameDataProvider.getLevel(level).subscribe(data => {
      if (data != null) {
        this.levelInfo = data;
        console.log(this.levelInfo);
        this.challenges.next(this.levelInfo.challenges);
      }
      else {
        this.exit('levelNotFound');
      }
      
    });
  }
  
  ngOnInit(){
  }

  goHome(){
    this.navCtrl.setRoot(GamePage);
  }

  showHelp(){
    
  }

  openMiniGame(miniGame) {
  }

  exit(reason) {

  }

  getClass(item) {
    return {
      playing: !item.completed && item.unlocked,
      locked: !item.unlocked
    };
  }
  
}