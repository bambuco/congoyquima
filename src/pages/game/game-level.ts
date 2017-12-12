import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';


//import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { GameDataProvider } from '../../providers/game-data';
import { HomePage } from '../home/home';
import { GamePage } from '../game/game';
import { GameChallengePage } from '../game/game-challenge';

import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'page-game-level',
  templateUrl: 'game-level.html',
  host: { "(window:resize)": "onResize($event)" }
})
export class GameLevelPage {
  @ViewChild('content')
  private contentEl: Content;
  private pages: any = { home: HomePage, game: GamePage };
  private levelInfo: any;
  private redirectReason: string;
  
  itemHeight: number;
  challenges: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private navCtrl: NavController,
      gameDataProvider: GameDataProvider,
      params: NavParams
      ) {
    let level = params.get('id');
    this.redirectReason = params.get('reason');
    gameDataProvider.getLevel(level).subscribe(data => {
      if (data != null) {
        this.levelInfo = data;
        this.challenges.next(this.levelInfo.challenges);
      }
      else {
        this.exit('levelNotFound');
      }
    });
  }
  //Lifecycle Events

  //ToDo: Maybe required to implemente ionViewCanEnter to check where there is a failure loading levels

  ionViewDidEnter() {
    this.onResize(null);

    //ToDo: Ask to play an audio if there is a redirect reason
    //this.redirectReason = challengeNotFound;
  }

  ngOnInit(){
  }

  onResize($event) {
    let dim = this.contentEl.getContentDimensions();
    this.itemHeight = (dim.contentHeight) / 10;
  }

  //User actions

  play(item) {
    this.navCtrl.setRoot(GameChallengePage, { id: item.id, levelId: item.levelId, source: 'levels'})
    .catch(reason => {
      //ToDo: Play some audio here
    });
  }

  go(target){
    this.navCtrl.setRoot(this.pages[target]);
  }

  showHelp(){
    
  }

  exit(reason) {
  }

  //UI Control

  getClass(item) {
    return {
      playing: item.playing,
      locked: !item.unlocked
    };
  }  
}