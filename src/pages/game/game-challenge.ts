import { Injector, Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { TepuyActivityService } from '../../tepuy-angular/activities/activity.provider';
import { TepuySelectableService } from '../../tepuy-angular/activities/selectable/selectable.provider';
import { TepuySelectableComponent } from '../../tepuy-angular/activities/selectable/selectable.component';

import { GameDataProvider } from '../../providers/game-data';
import { MediaPlayer } from '../../providers/media-player';

import { GameLevelPage } from '../game/game-level';


@Component({
  selector: 'page-game-challenge',
  templateUrl: 'game-challenge.html',
  providers: [ ]
})
export class GameChallengePage {
  @ViewChild('content')
  private content: Content;
  @ViewChild('playZone')
  private playZone;

  status: string = 'loading';
  loading: boolean = true;
  challenge: any;
  template: string = '<div class="container" text-center><ion-spinner name="circles"></ion-spinner></div>';
  templateCss: string = '';
  message: string = "";
  settings: any;
  challengeResult: string = '';



  private id: string;
  private levelId: string;
  private pzStyle: any;
  private items: any;
  private activityService: TepuyActivityService;
  private canVerify: boolean = false;
  private canPlayAgain: boolean = false;

  constructor(private el: ElementRef,
      private navCtrl: NavController,
      private params: NavParams,
      private gameDataProvider: GameDataProvider,
      private mediaPlayer: MediaPlayer
      ) {
    this.id = params.get('id');
    this.levelId = params.get('levelId');

    gameDataProvider.getChallenge(this.id, this.levelId).subscribe(data => {
      this.settings = {
        init: this.activityInitialized.bind(this)
      };

      if (data != null) {
        this.challenge = data.setup;
        this.template = data.template;
        this.templateCss = data.css;
      }
      else {
        this.exit('levelNotFound');
      }
    });
  }

  ionViewDidEnter(){
    this.onResize();
    this.loading = false;
    this.status = 'loaded';
    this.canVerify = true;
  }

  activityInitialized(service) {
    this.activityService = service;
    this.activityService.on('activityVerified').subscribe(data => {
      this.activityVerified(data);
    });
  }

  onResize($event=null) {
    let dim = this.content.getContentDimensions();
    this.pzStyle = { 'height.px': dim.contentHeight };
  }

  dismiss() {
    this.navCtrl.setRoot(GameLevelPage, { id: this.levelId });
  }

  exit(reason) {
    console.log(reason);
  }

  activityVerified(result){
    //Need to show feedback;
    if (result.success) {
      this.gameDataProvider.registerScore(this.challenge, result.score, result.success);
    }
    
    this.mediaPlayer.playAudio({key: 'result-' + result.rate });

    if (result.success) {
      if (result.score == 1) {
        this.challenge.prize_3 = this.challenge.prize_2;
        this.challenge.prize_2 = this.challenge.prize_1;
        this.challenge.prize_1 = result.rate;
      }
      else {
        let i = 0;
        while(i < 3 && this.challenge['prize_'+(++i)] != 'empty');
        if (i <= 3) {
          this.challenge['prize_'+i] = result.rate;
        }
      }
    }

    this.challengeResult = result.rate;
    this.canPlayAgain = true;
  }

  verify() {
    this.activityService.verify();
    this.canVerify = false;
  }

  restart() {
    this.activityService.restart();
    this.challengeResult = '';
    this.canPlayAgain = false;
    this.canVerify = true;
  }
}