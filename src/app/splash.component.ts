import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class Splash {
  constructor(private viewCtrl: ViewController,
    private splashScreen: SplashScreen) {
  }
  
  ionViewDidEnter(){
    setTimeout(() => {
      this.splashScreen.hide();
      this.viewCtrl.dismiss();
    }, 60000); 
  }
}

