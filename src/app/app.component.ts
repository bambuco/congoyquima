import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

//import { Splash } from './splash.component';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform,
    private statusBar: StatusBar,
    private androidFS: AndroidFullScreen,
    //private splashScreen: SplashScreen,
    //private modalCtrl: ModalController
    ) {
    platform.ready().then((source) => {
      if (source == 'cordova'){
        this.cordovaInit();
      }
    });
    platform.resume.subscribe(() => {
      console.log('App resumed!');
      this.cordovaInit();
    });
  }
  
  cordovaInit() {
    //Cordova platform is ready.
    //Hide the status bar
    this.statusBar.hide();
    //statusBar.styleDefault();
    //go full screen if posible
    this.androidFS.isImmersiveModeSupported()
      .then(() => this.androidFS.immersiveMode())
      .catch((error: any) => console.log(error));
    //splashScreen.hide();
    //let splash = modalCtrl.create(Splash);
    //splash.present();
    //splash.onDidDismiss(() => { this.navCtrl.setRoot(this.rootPage)});
  }
}

