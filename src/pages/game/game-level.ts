import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController } from 'ionic-angular';


//import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { GameDataProvider } from '../../providers/game-data';
import { AppDataProvider, Flags } from '../../providers/app-data';
import { MediaPlayer } from '../../providers/media-player';

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
  private introKey:string;
  
  itemHeight: number;
  challenges: ReplaySubject<any> = new ReplaySubject(1);
  showIndicator: boolean = false;

  constructor(private navCtrl: NavController,
      private mediaPlayer: MediaPlayer,
      private appData: AppDataProvider, 
      gameDataProvider: GameDataProvider,
      private alertCtrl: AlertController,
      params: NavParams
      ) {
    const id = params.get('id');
    this.introKey = 'level'+id+'_intro';
    this.redirectReason = params.get('reason');
    gameDataProvider.getLevel(id).subscribe(data => {
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
    this.appData.ready().subscribe((settings) => {
      this.initialize();
    });
  }

  initialize() {
    //Play intro if required
    //if (!this.appData.hasFlag(Flags[this.introKey.toUpperCase()])) {
    //  this.playIntro();
    //}
    this.appData.setFlag(Flags.GAME_LEVELS_ENTERED);
    if (!this.appData.hasFlag(Flags.GAME_CHALLENGE_ENTERED)) {
      //this.playIntro();
      this.showIndicator = true;
    }
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
      let alert = this.alertCtrl.create({
        title: 'Congo y Quima',
        subTitle: 'Unable to play: ' + reason,
        buttons: ['Dismiss']
      });
      alert.present();
    });
  }

  go(target){
    if (target == 'intro') {
      this.playIntro(true);
    }
    else {
      this.navCtrl.setRoot(this.pages[target]);
    }
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

  //Helpers
  private playIntro(ondemand:boolean=false) {
    this.mediaPlayer.playVideoFromCatalog(this.introKey, { centered: true }).subscribe((done) => {
      //Should update status here
      if (!ondemand){
        this.appData.setFlag(Flags[this.introKey.toUpperCase()]);
      }
    });
  }
}