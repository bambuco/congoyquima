import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, Content, Footer } from 'ionic-angular';


//import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
//import { TextToSpeech } from '@ionic-native/text-to-speech';
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
  @ViewChild('contentZone')
  private contentZone;

  private levelInfo: any;
  private challenges: ReplaySubject<any> = new ReplaySubject(1);
  private pages: any = { home: HomePage, game: GamePage };
  private itemHeight: number;

  constructor(private navCtrl: NavController,
      private modalCtrl: ModalController,
      private params: NavParams,
      private gameDataProvider: GameDataProvider,
      private platform: Platform
      //private tts: TextToSpeech
      ) {
    let level = params.get('id');
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
  
  ionViewDidEnter() {
    this.onResize(null);
  }

  ngOnInit(){
  }

  onResize($event) {
    let dim = this.contentEl.getContentDimensions();
    this.itemHeight = (dim.contentHeight) / 10;
  }

  go(target){
    this.navCtrl.setRoot(this.pages[target]);
  }

  showHelp(){
    
  }

  play(item) {
    this.openChallenge(item.id, item.levelId);
  }

  openChallenge(id, levelId) {
    this.navCtrl.setRoot(GameChallengePage, { id: 1, levelId: 1});
  }

  exit(reason) {

  }

  getClass(item) {
    return {
      playing: item.playing,
      locked: !item.unlocked
    };
  }
  
}