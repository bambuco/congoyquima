import { Component, ViewChild, HostListener } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { TepuyActivityService } from '../../tepuy-angular/providers';

import { Observable } from 'rxjs/Observable';
import { AppDataProvider, Flags } from '../../providers/app-data';
import { GameDataProvider } from '../../providers/game-data';
import { MediaPlayer } from '../../providers/media-player';
import { TepuyAudioPlayerProvider } from '../../tepuy-angular/providers';
import { GameLevelPage } from '../game/game-level';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

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
  @HostListener('click', ['$event']) onClick(ev) {
    this.showIndicator = false;
  }

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
  showIndicator: boolean = false;

  private id: string;
  private levelId: string;
  private activityService: TepuyActivityService;
  private busy: boolean = true;
  private feedbackDismissed: boolean = false;
  private verifyDisabled: boolean = false;
  //private nextAvailable: boolean = false;
  private sourcePage: string = null;
  private introKey: string;

  constructor(
      private navCtrl: NavController,
      private appData: AppDataProvider, 
      private gameDataProvider: GameDataProvider,
      private mediaPlayer: MediaPlayer,
      private audioPlayer: TepuyAudioPlayerProvider,
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
          this.introKey = this.activityType+'_howto';
          this.verifyDisabled = this.challenge.autofeedback === true;
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
    this.appData.ready().subscribe((settings) => {
      this.initialize();
    });

  }

  initialize() {
    this.appData.setFlag(Flags.GAME_CHALLENGE_ENTERED);
    //Play intro if required
    if (!this.appData.hasFlag(Flags[this.introKey.toUpperCase()])) {
      this.setReady();
      this.appData.setFlag(Flags[this.introKey.toUpperCase()]);
      this.playAudioIntro();
    }
    else {
      this.setReady();
    }
    const id = parseInt(this.id);
    const flagKey='CHALLENGE'+(id+1)+'_PLAYED';
    if (!this.appData.hasFlag(Flags[flagKey])){
      this.appData.setFlag(Flags[flagKey]);
      this.showIndicator = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event=null) {
    let dim = this.content.getContentDimensions();
    setTimeout(() => {
      this.pzStyle = { 'height.px': dim.contentHeight };
      this.settings.playZone.height = this.content.contentHeight;
      this.settings.playZone.width = this.content.contentWidth;
    }, 1);
    return true;
  }

  //User Actions
  dismiss() {
    if (this.busy) return;
    this.stopSounds();
    this.navCtrl.setRoot(GameLevelPage, { id: this.levelId });
  }

  showHelp(actType) {
    if (this.busy) return;
    this.stopSounds();
    this.mediaPlayer.playVideoFromCatalog(actType+'_howto').subscribe(()=>{});
  }

  listen() {
    if (this.busy) return;
    if (!this.canVerify) return; //Play only if playing
    this.stopSounds();    
    this.playAudioIntro();
  }

  verify() {
    if (this.busy) return;
    this.busy = true;
    this.stopSounds();
    this.activityService.verify();
  }

  restart() {
    if (this.busy) return;
    this.busy = true;
    this.stopSounds();
    this.activityService.restart();
    this.challengeResult = '';
    this.canPlayAgain = false;
    this.canVerify = true;
    this.clearFlags();
  }

  goNext() {
    if (this.busy) return;
    this.stopSounds();
    this.sourcePage = null;
    const nextId = (parseInt(this.id) + 1) % 10;
    this.navCtrl.setRoot(GameChallengePage, { id: nextId, levelId: nextId == 0 ? (parseInt(this.levelId) + 1) : this.levelId });
  }

  //Activity Events
  activityInitialized(service:TepuyActivityService) {
    service.setSetup(this.challenge);
    this.activityService = service;    
    this.activityService.on(this.activityService.ACTIVITY_VERIFIED).subscribe(data => {
      this.activityVerified(data);
    });

    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      this.busy = false;
    });
    this.busy = false;
    this.canGoNext = this.challenge.completed;

    this.activityService.on(this.activityService.ITEM_READY).subscribe((item) => {
      if (item.actAsGreetable) {
        this.audioPlayer.preload(item.value.toLowerCase());
      }
    });
  }

  activityVerified(result){
    //Need to show feedback;
    let storage = Observable.of(this.challenge);
    const isCompleted = this.challenge.completed;
    if (result.success) {
      storage = this.gameDataProvider.registerScore(this.challenge, result.score, result.success);
    }

    this.feedbackDismissed = false;
    this.audioPlayer.play('result-' + result.rate) //this.mediaPlayer.playAudio({key: 'result-' + result.rate });
    //feedback.subscribe(()=>{});
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
    }

    storage.subscribe(challenge => {
      if (!isCompleted && challenge.completed) {
        //1. Play audio
        if (!this.feedbackDismissed) {
          this.audioPlayer.play('ch_completed', true);
        }
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

  //Helpers
  /*private playIntro(ondemand:boolean=false) {    
    this.mediaPlayer.playVideoFromCatalog(this.introKey, { centered: true }).subscribe((done) => {
      //Should update status here
      //if (!ondemand){
      //  this.appData.setFlag(Flags[this.introKey.toUpperCase()]);
      //  this.setReady();
      //  this.playAudioIntro();
      //}
    });
  }*/
  private playAudioIntro(){
    const key = ['l_', this.levelId, '_ch_', parseInt(this.id)+1, '_intro'].join('');
    this.audioPlayer.play(key);
  }
  private stopSounds() {
    this.feedbackDismissed = true;
    this.audioPlayer.stopAll();
  }
  private setReady() {
    this.loading = false;
    this.status = 'loaded';
    this.canVerify = true;
    this.busy = false;
  }
  private clearFlags() {
    this.levelJustCompleted = false;
    this.btnHigthlight = '';
  }
}