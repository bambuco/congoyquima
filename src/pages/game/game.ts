import { Component } from '@angular/core';
import { NavController, ViewController, ModalController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  constructor(private navCtrl: NavController, private modalCtrl: ModalController) {

  }
  
  goHome(){
    this.navCtrl.setRoot(HomePage);
  }

  showGame(viewClass) {
    let modal = this.modalCtrl.create(GameSampleComponent, { viewClass: viewClass });
    modal.present();
  }
  
}

@Component({
  selector: 'mini-game',
  templateUrl: 'game-sample.html'
})
export class GameSampleComponent {
  items: Array<any>;

  constructor(private viewCtrl: ViewController) {
    this.items = "12,34,56,3,5,9,A,E,I,U".split(',');
    this.shuffle();
    this.partition([4,3,3]);
  }

  isNaN(value) {
    console.log(value + '::' + Number.isNaN(value)); // ;
    return Number.isNaN(value);
  }

  dismiss() {
    this.viewCtrl.dismiss({}); //Any data can be passed back here
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
