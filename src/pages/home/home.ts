import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GamePage } from '../game/game';
import { ContentPage } from '../content/content';
import { ProgressPage } from '../progress/progress';

import { HelpComponent } from '../../components/help/help';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: any = { game: GamePage, contents: ContentPage, progress: ProgressPage };
  help: any;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private splashScreen: SplashScreen
    ) {

  }

  ionViewDidEnter() {
    this.splashScreen.hide();
  }
  
  goTo(page){
    if (page == 'help') {
      this.showHelp();
    }
    else {
      this.navCtrl.setRoot(this.pages[page]);  
    }    
  }

  showHelp(){
    console.log('trying to help...');
    this.help = this.modalCtrl.create(HelpComponent);
    this.help.present();
  }

}
