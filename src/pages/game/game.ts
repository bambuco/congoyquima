import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Platform, NavController, ViewController, ModalController, Content } from 'ionic-angular';

import { Observable } from 'rxjs/Rx';
import { GameDataProvider } from '../../providers/game-data';
import { AppDataProvider } from '../../providers/app-data';

import { HomePage } from '../home/home';
import { GameLevelPage } from './game-level';

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

  constructor(
      private platform: Platform,
      private navCtrl: NavController,
      private gameDataProvider: GameDataProvider,
      private settings: AppDataProvider,
      private renderer: Renderer2
    ) {
    this.lpbCss = [];
    this.litStyles = [];
    this.levels = gameDataProvider.levels();
  }
  
  goHome(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidEnter() {
    this.onResize(null);
  }

  ngAfterViewInit() {
  }

  onResize($event) {
    let height = this.platform.height();
    this.itemHeight = height / 5; //Make the item to use 20% of the board
    this.renderer.setStyle(this.contentZone.nativeElement, 'height.px', this.contentEl.contentHeight);
  }

  openLevel(level) {
    if (!level.unlocked) return false;
    this.navCtrl.setRoot(GameLevelPage, { 'id': level.id });
  }

  showHelp(){

  }

  tileDimensions(item, i){
    let height = this.platform.height();
    let imgHeight = item.tile.size[1] * height / 1920;
    let scale = imgHeight / item.tile.size[1];
    
    if (i == 0 && !this.boardWidth) {
      let width = Math.min(height, this.platform.width());
      setTimeout(() => {
        this.boardScale = 1080 / item.tile.size[1];
        this.boardWidth = imgHeight * this.boardScale;
      }, 1);
    }
    
    let style = {
      'transform': 'scale('+scale+')',
      'top.px': item.tile.progress[2] * scale
    };
    
    if (item.tile.progress[0] === 'l') {
      style['left.px'] = item.tile.progress[1] * scale;
    }
    else {
      style['transform-origin'] = 'right top';
      style['right.px'] = item.tile.progress[1] * scale;
    }

    let className = item.unlocked ?
      'level-progress-' + (i + 1) :
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
}