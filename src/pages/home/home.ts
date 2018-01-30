import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GamePage } from '../game/game';
import { ContentPage } from '../content/content';
import { ConfigPopover } from './config-popover';
//import { ProgressPage } from '../progress/progress';
import { MediaPlayer } from '../../providers/media-player';
import { AppDataProvider, Flags } from '../../providers/app-data';

export { ConfigPopover };

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: any = { game: GamePage, contents: ContentPage };
  showIndicator: boolean = false;

  constructor(private navCtrl: NavController,
    private popOverCtrl: PopoverController,
    private splashScreen: SplashScreen,
    private mediaPlayer: MediaPlayer,
    private appData: AppDataProvider
    ) {
  }

  ionViewDidEnter() {
    this.appData.ready().subscribe((settings) => {
      setTimeout(() => {
        this.splashScreen.hide();
        this.initialize();  
      }, 1);      
    });
  }

  initialize() {
    //Play intro if required
    if (!this.appData.hasFlag(Flags.APP_INTRO)) {
      this.playIntro();
    }
    //else if (!this.appData.hasFlag(Flags.HOME_INTRO)) {
    //  this.showHelp();
    //}
    else if (!this.appData.hasFlag(Flags.GAME_HOME_ENTERED)) {
      this.showIndicator = true;
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

  configMenu(ev) {
    const popover = this.popOverCtrl.create(ConfigPopover);
    popover.present({ev:ev});
  }

  private playIntro(ondemand:boolean=false) {
    this.mediaPlayer.playVideoFromCatalog('intro').subscribe((done) => {
      //Should update status here
      if (!ondemand) {
        this.appData.setFlag(Flags.APP_INTRO);
        //this.mediaPlayer.playVideoFromCatalog('home_intro').subscribe((done) => {
        //  this.appData.setFlag(Flags.HOME_INTRO);
        //});
        this.showIndicator = true;
      }
    });
  }
}
