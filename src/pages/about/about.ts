import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

import { ErrorsPage } from '../errors/errors';

declare function require(moduleName: string): any;
const { version: appVersion } = require('../../../package.json');

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	public version:any = appVersion;
  private eggCounter: number = 0;
  private lastEggClicked: number = 0;

	constructor(private viewCtrl: ViewController, private navCtrl: NavController) {

	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

  errorEgg() {
    const now = new Date().getTime();
    const window = now - this.lastEggClicked;
    if (window < 2000) {// two senconds
      this.eggCounter++;
    }
    else {
      this.eggCounter = 1;
    }
    this.lastEggClicked = now;

    if (this.eggCounter == 7) {
      this.navCtrl.setRoot(ErrorsPage);
    }
  }
}