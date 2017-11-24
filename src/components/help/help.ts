import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'help-content',
  templateUrl: 'help.html'
})
export class HelpComponent {

  constructor(public viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss({}); //Any data can be passed back here
  }

}
