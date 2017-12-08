import { Injector, Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { TepuyActivityService } from '../../tepuy-angular/activities/activity.provider';
import { TepuySelectableService } from '../../tepuy-angular/activities/selectable/selectable.provider';
import { TepuySelectableComponent } from '../../tepuy-angular/activities/selectable/selectable.component';
import { CompileService } from '../../directives/compile.directive';

import { GameDataProvider } from '../../providers/game-data';
import { HomePage } from '../home/home';
import { GameLevelPage } from '../game/game-level';

@Component({
  selector: 'page-game-challenge',
  templateUrl: 'game-challenge.html',
  providers: [ CompileService, TepuyActivityService ]
})
export class GameChallengePage {
  @ViewChild('content')
  private content: Content;
  @ViewChild('playZone')
  private playZone;
  status: string = 'loading';
  loading: boolean = true;
  challengeInfo: any;
  template: string = '<div class="container" text-center><ion-spinner name="circles"></ion-spinner></div>';
  message: string = "";
  settings: any;
  challenge: any;
  private id: string;
  private levelId: string;
  private pzStyle: any;
  private items: any;

  constructor(private el: ElementRef,
      private navCtrl: NavController,
      private params: NavParams,
      private gameDataProvider: GameDataProvider,
      private activityService: TepuyActivityService
      ) {
    this.id = params.get('id');
    this.levelId = params.get('levelId');

    gameDataProvider.getChallenge(this.id, this.levelId).subscribe(data => {
      this.challenge = data.setup;

      this.items = "12,56,3,5,9,A,E,34,I,U".split(',');
      this.shuffle();
      this.partition([4,3,3]); //4,3,3

      this.settings = {
        items: this.items
      };

      if (data != null) {
        this.challengeInfo = data.setup;
        this.template = data.template;
      }
      else {
        this.exit('levelNotFound');
      }
    });

    this.activityService.on('activityVerified').subscribe(data => {
      this.activityVerified(data);
    });
  }

  ionViewDidEnter(){
    this.onResize();
    this.loading = false;
    this.status = 'loaded';
  }

  onResize($event=null) {
    let dim = this.content.getContentDimensions();
    this.pzStyle = {
      'height.px': dim.contentHeight
    };
  }

  dismiss() {
    this.navCtrl.setRoot(GameLevelPage, { id: this.levelId });
  }

  exit(reason) {
    console.log(reason);
  }

  tepuyComponentReady($event){

  }

  activityVerified(result){
    console.log(result);  
  }

  restart() {
    this.activityService.restart();
  }

  shuffle() {
    let arr: Array<any> = this.items;
    let i = arr.length;
    while(--i > 0) {
      let j = Math.floor(Math.random() * (i + 1));
      let t = arr[j];
      arr[j] = arr[i];
      arr[i] = t;
    }
  }

  partition(arr: Array<any>){
    let result = [];
    let i = 0;    
    for(let size in arr){
      result[size] = [];
      let k = 0;
      for(; k < arr[size] && k < this.items.length; k++) {
        result[size].push(this.items[k+i]);
      }
      i+=k;
    }
    this.items = result;
  }
}