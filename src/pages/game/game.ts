import { Component, ViewChild, Renderer2 } from '@angular/core';
import { Platform, NavController, Content } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { GameDataProvider } from '../../providers/game-data';
import { AppDataProvider, Flags } from '../../providers/app-data';
import { MediaPlayer } from '../../providers/media-player';
import { ResourceProvider } from '../../tepuy-angular/providers';
import { HomePage } from '../home/home';
import { GameLevelPage } from './game-level';

const RES_IMAGE = 0;

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  @ViewChild('content')
  private contentEl: Content;
  @ViewChild('contentZone')
  private contentZone;

  levels: Observable<any>;
  itemHeight: number;
  boardWidth: number;
  boardScale: number;
  lpbCss: Array<any>;
  litStyles: Array<any>;
  status: string = 'loading';
  showIndicator: boolean = false;
  leaving: boolean = false;

  constructor(
      private platform: Platform,
      private navCtrl: NavController,
      //private settings: AppDataProvider,
      private renderer: Renderer2,
      private mediaPlayer: MediaPlayer,
      private appData: AppDataProvider,
      private loader: ResourceProvider,
      gameDataProvider: GameDataProvider
    ) {
    this.lpbCss = [];
    this.litStyles = [];
    this.levels = gameDataProvider.levels();
  }
  
  goHome(){
    //this.leaving = true;
    this.navCtrl.setRoot(HomePage);
  }

  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.levels.subscribe((levels) => {
        let resources = [];
        resources.push({type: RES_IMAGE, url: 'assets/game/img/shared/world_bg.png' });
        for(let i = 0, iLen = levels.length; i < iLen; i++) {
          resources.push({type: RES_IMAGE, url: `assets/game/img/tiles/${++i}.png` })
          resources.push({type: RES_IMAGE, url: `assets/game/img/tiles/${i}_color.png` })
          resources.push({type: RES_IMAGE, url: `assets/game/img/tiles/${i}.gif` })
        }

        this.loader.preload(resources)
        .finally(() => {
          resolve(true);
        })
        .subscribe(() => {});
      });

      this.levels.catch(error => {
        resolve(true);
        return Observable.of([]);
      });
    });
  }

  ionViewDidEnter() {
    this.onResize(null);
    this.appData.ready().subscribe((settings) => {
      this.initialize();
    });
  }

  initialize() {
    //Play intro if required
    this.appData.setFlag(Flags.GAME_HOME_ENTERED);
    //if (!this.appData.hasFlag(Flags.GAME_INTRO)) {
    //  this.playIntro();
    //}
    //else {
    //  this.status = 'loaded';
    //}
    if (!this.appData.hasFlag(Flags.GAME_LEVELS_ENTERED)) {
      this.showIndicator = true;
    }
    this.status = 'loaded';
  }
  
  onResize($event) {
    let height = this.platform.height();
    this.itemHeight = height / 5; //Make the item to use 20% of the board
    this.renderer.setStyle(this.contentZone.nativeElement, 'height.px', this.contentEl.contentHeight);
  }

  openLevel(level) {
    if (!level.unlocked) return false;
    this.leaving = true;
    this.navCtrl.setRoot(GameLevelPage, { 'id': level.id });
  }

  showHelp(){
    this.playIntro();
  }

  tileDimensions(item, i){
    let height = this.platform.height();
    let imgHeight = item.tile.size[1] * height / 1920;
    let scale = imgHeight / item.tile.size[1];
    
    if (i == 0 && !this.boardWidth) {
      //let width = Math.min(height, this.platform.width());
      setTimeout(() => {
        this.boardScale = 1080 / item.tile.size[1];
        this.boardWidth = imgHeight * this.boardScale;
      }, 1);
    }
    
    let style = {
      //'transform': 'scale('+scale+')',
      'top.px': item.tile.progress[2] * scale
    };

    const tprops = 'transform,-webkit-transform,-ms-transform,-moz-transform,-o-transform'.split(',');
    for(let prop of tprops){
      style[prop] = 'scale('+scale+')';
    }
    
    if (item.tile.progress[0] === 'l') {
      style['left.px'] = item.tile.progress[1] * scale;
    }
    else {
      style['-web-kit-transform-origin'] = 'right top';
      style['transform-origin'] = 'right top';
      style['right.px'] = item.tile.progress[1] * scale;
    }

    let className = item.unlocked ?
      'level-progress-' + (i + 1) + ' progress-'+item.tile.progress[0] :
      'level-lock-' + item.tile.progress[0];

    this.lpbCss.push({
      style: style,
      classname: className
    });
    
    return {
      'top.px': i * this.itemHeight,
      'height.px': imgHeight
    }
  }

  private playIntro() {
    this.mediaPlayer.playVideoFromCatalog('game_intro').subscribe((done) => {
      //Should update status here
      //this.appData.setFlag(Flags.GAME_INTRO);
      //this.status = 'loaded';
    });
  }
}