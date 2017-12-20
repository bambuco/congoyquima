import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'error-detail',
  templateUrl: 'error-detail.html'
})
export class ErrorDetailComponent {
  error: any;
  constructor(public viewCtrl: ViewController, navParams: NavParams) {
    this.error = navParams.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss({}); //Any data can be passed back here
  }

}
