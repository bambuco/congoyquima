import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GamePage } from '../game/game';
import { ContentPage } from '../content/content';
//import { ProgressPage } from '../progress/progress';
import { MediaPlayer } from '../../providers/media-player';
import { AppDataProvider, Flags } from '../../providers/app-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: any = { game: GamePage, contents: ContentPage };

  constructor(private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private mediaPlayer: MediaPlayer,
    private appData: AppDataProvider
    ) {
  }

  ionViewDidEnter() {
    this.appData.ready().subscribe((settings) => {
      this.splashScreen.hide();
      this.initialize();
    });
  }

  initialize() {
    //Play intro if required
    if (!this.appData.hasFlag(Flags.APP_INTRO)) {
      this.playIntro();
    }
    else if (!this.appData.hasFlag(Flags.HOME_INTRO)) {
      this.showHelp();
    }
  }
  
  goTo(page){
    if (page == 'help') {
      this.showHelp(true);
    }
    else if (page == 'intro') {
      this.playIntro(true);
    }
    else {
      this.navCtrl.setRoot(this.pages[page]);  
    }    
  }

  showHelp(ondemand:boolean=false){
    this.mediaPlayer.playVideoFromCatalog('home_intro').subscribe((done) => {
      //Should update status here
      if (!ondemand) {
        this.appData.setHomeIntroPlayed();
      }
    });
  }

  private playIntro(ondemand:boolean=false) {
    this.mediaPlayer.playVideoFromCatalog('intro').subscribe((done) => {
      //Should update status here
      if (!ondemand) {
        this.appData.setFlag(Flags.APP_INTRO);
        this.mediaPlayer.playVideoFromCatalog('home_intro').subscribe((done) => {
          this.appData.setFlag(Flags.HOME_INTRO);
        });
      }
    });
  }

}
