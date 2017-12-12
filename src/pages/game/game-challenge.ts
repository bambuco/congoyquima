import { Component, ViewChild, HostListener } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { TepuyActivityService } from '../../tepuy-angular/activities/activity.provider';

import { Observable } from 'rxjs/Observable';

import { GameDataProvider } from '../../providers/game-data';
import { MediaPlayer } from '../../providers/media-player';

import { GameLevelPage } from '../game/game-level';

//const maxChallenges = 10;
const maxPrizes = 3;
const maxScore = 1;

@Component({
  selector: 'page-game-challenge',
  templateUrl: 'game-challenge.html',
  providers: [ ]
})
export class GameChallengePage {
  @ViewChild('content')
  private content: Content;
  //@ViewChild('playZone')
  //private playZone;

  status: string = 'loading';
  loading: boolean = true;
  challenge: any;
  template: string = '<div class="container" text-center><ion-spinner name="circles"></ion-spinner></div>';
  templateCss: string = '';
  message: string = "";
  settings: any;
  challengeResult: string = '';
  activityType: string = '';
  canGoNext: boolean = false;
  pzStyle: any;
  levelJustCompleted: boolean = false;
  canVerify: boolean = false;
  canPlayAgain: boolean = false;
  btnHigthlight: string = '';

  private id: string;
  private levelId: string;
  private activityService: TepuyActivityService;
  private busy: boolean = true;
  //private nextAvailable: boolean = false;
  private sourcePage: string = null;

  constructor(
      private navCtrl: NavController,
      private gameDataProvider: GameDataProvider,
      private mediaPlayer: MediaPlayer,
      params: NavParams
      ) {
    this.id = params.get('id');
    this.levelId = params.get('levelId');
    this.sourcePage = params.get('source');
  }

  //Lifecycle Events

  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gameDataProvider.getChallenge(this.id, this.levelId).subscribe(data => {
        this.settings = {
          init: this.activityInitialized.bind(this),
          playZone: {}
        };
        if (data != null && data.template != 'NotFound') {
          this.challenge = data.setup;
          this.template = data.template;
          this.templateCss = data.css;
          this.activityType = this.challenge.type;
          resolve(true);
        }
        else {
          if (!this.sourcePage) {
            let navCtrl = this.navCtrl;
            setTimeout(() => {
              navCtrl.setRoot(GameLevelPage, { id: this.levelId, reason: 'challengeNotFound' });
            }, 1);
          }
          resolve(false);
        }
      });
    });

  }

  ionViewDidEnter(){
    this.onResize();
    this.loading = false;
    this.status = 'loaded';
    this.canVerify = true;
    this.busy = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event=null) {
    let dim = this.content.getContentDimensions();
    this.pzStyle = { 'height.px': dim.contentHeight };
    this.settings.playZone.height = this.content.contentHeight;
  }

  //User Actions
  dismiss() {
    if (this.busy) return;
    this.mediaPlayer.stopAll();
    this.navCtrl.setRoot(GameLevelPage, { id: this.levelId });
  }

  showHelp() {
    if (this.busy) return;
    this.mediaPlayer.stopAll();
  }

  listen() {
    if (this.busy) return;    
    this.mediaPlayer.stopAll();
    this.levelJustCompleted = false;
  }

  verify() {
    if (this.busy) return;
    this.busy = true;
    this.mediaPlayer.stopAll();
    this.activityService.verify();
  }

  restart() {
    if (this.busy) return;
    this.busy = true;
    this.mediaPlayer.stopAll();
    this.activityService.restart();
    this.challengeResult = '';
    this.canPlayAgain = false;
    this.canVerify = true;
    this.clearFlags();
  }

  goNext() {
    if (this.busy) return;
    this.sourcePage = null;
    this.mediaPlayer.stopAll();
    const nextId = (parseInt(this.id) + 1) % 10;
    this.navCtrl.setRoot(GameChallengePage, { id: nextId, levelId: nextId == 0 ? (parseInt(this.levelId) + 1) : this.levelId });
  }

  //Activity Events

  activityInitialized(service) {
    this.activityService = service;
    this.activityService.on(this.activityService.ACTIVITY_VERIFIED).subscribe(data => {
      this.activityVerified(data);
    });

    this.activityService.on(this.activityService.ITEM_TOUCHED).subscribe(item => {
      this.mediaPlayer.playAudio({key: item.value.toLowerCase(), stopAll: true}).subscribe(result => {
      })
    });

    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      this.busy = false;
    });
    this.busy = false;
    this.canGoNext = this.challenge.completed;
  }

  activityVerified(result){
    //Need to show feedback;
    let storage = Observable.of(this.challenge);
    const isCompleted = this.challenge.completed;
    if (result.success) {
      storage = this.gameDataProvider.registerScore(this.challenge, result.score, result.success);
    }

    let feedback = this.mediaPlayer.playAudio({key: 'result-' + result.rate });
    feedback.subscribe(result => {
      console.log('feeback played');
      console.log(result);
    });
    let highlight = 'play';    
    if (result.success) {
      //Show the item prize
      if (result.score == maxScore) {
        let k = 1;
        while(this.challenge['prize_'+k] == result.rate && k <= maxPrizes) k++;
        if (k <= maxPrizes){
          let i = maxPrizes;
          while(i > k) {
            this.challenge['prize_'+i] = this.challenge['prize_'+(i-1)];
            i--;
          }
          this.challenge['prize_'+k] = result.rate;
        }
      }
      else {
        let i = 0;
        while(++i <= maxPrizes && this.challenge['prize_'+(i)] != 'empty');
        if (i <= maxPrizes ){
          this.challenge['prize_'+i] = result.rate;
        }
      }
/*
      //Challenge completed! Need to do special things.
      if (!this.challenge.completed && this.challenge['prize_'+maxPrizes] != 'empty') {
        //1. Unlock next challenge.
        this.gameDataProvider.unlockNextChallenge(this.challenge).subscribe(result => {
          this.nextAvailable = result;
        });
        //2. Show congrats
        this.levelJustCompleted = true;
        this.challenge.completed = true;        
        //3. Play audio
      }
      if (this.challenge.completed) highlight = 'next';
*/      
    }

    storage.subscribe(challenge => {
      if (!isCompleted && challenge.completed) {
        //1. Play audio
        feedback.subscribe((result) => {
          console.log(result);
          this.mediaPlayer.playAudio({key: 'ch_completed', stopAll:true, debug:true}).subscribe(result => {
          });
        });
        //2. Show congrats
        this.levelJustCompleted = true;
        highlight = 'next';
      }

      this.challengeResult = result.rate;
      this.canVerify = false;
      this.canPlayAgain = true;
      this.canGoNext = this.challenge.completed;
      this.btnHigthlight = highlight;
      this.busy = false;
    });
  }

  clearFlags() {
    this.levelJustCompleted = false;
    this.btnHigthlight = '';
  }
}