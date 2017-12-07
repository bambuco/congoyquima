import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GamePage } from '../game/game';
import { ContentPage } from '../content/content';
//import { ProgressPage } from '../progress/progress';
import { MediaPlayer } from '../../providers/media-player';
import { AppDataProvider } from '../../providers/app-data';

import { HelpComponent } from '../../components/help/help';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: any = { game: GamePage, contents: ContentPage };
  help: any;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
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
    if (!this.appData.hasSeenIntro()) {
      this.playIntro();
    }
  }
  
  goTo(page){
    if (page == 'help') {
      this.showHelp();
    }
    if (page == 'intro') {
      this.playIntro();
    }
    else {
      this.navCtrl.setRoot(this.pages[page]);  
    }    
  }

  showHelp(){
    this.help = this.modalCtrl.create(HelpComponent);
    this.help.present();
  }

  private playIntro() {
    this.mediaPlayer.playVideoFromCatalog('intro').subscribe((done) => {
      //Should update status here
      this.appData.setIntroPlayed();
    });
  }

}
