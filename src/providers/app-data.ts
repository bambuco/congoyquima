import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AppState } from './models/app-state';

const data_key: string = 'app_state';
let one = 0x1;
export const Flags = {
  APP_INTRO: (one),
  HOME_INTRO: (one=one<<1),
  GAME_INTRO: (one=one<<1),
  LEVEL1_INTRO: (one=one<<1),
  SELECT_HOWTO: (one=one<<1),
  DRAG_HOWTO: (one=one<<1),
  MARK_HOWTO: (one=one<<1),
  CLASSIFY_HOWTO: (one=one<<1),
  GAME_HOME_ENTERED: (one=one<<1),
  GAME_LEVELS_ENTERED: (one=one<<1),
  GAME_CHALLENGE_ENTERED: (one=one<<1),
  L01_CH01_PLAYED: (one=one<<1),
  L01_CH02_PLAYED: (one=one<<1),
  L01_CH03_PLAYED: (one=one<<1),
  L01_CH04_PLAYED: (one=one<<1),
  L01_CH05_PLAYED: (one=one<<1),
  L01_CH06_PLAYED: (one=one<<1),
  L01_CH07_PLAYED: (one=one<<1),
  L01_CH08_PLAYED: (one=one<<1),
  L01_CH09_PLAYED: (one=one<<1),
  L01_CH10_PLAYED: (one=one<<1),
  LEVEL2_INTRO: (one=one<<1),
  LEVEL3_INTRO: (one=one<<1),
  LEVEL4_INTRO: (one=one<<1),
  LEVEL5_INTRO: (one=one<<1),
  SORT_HOWTO: (one=one<<1),
  SYNONYMS_HOWTO: (one=one<<1),
  PYTHAGOREAN_HOWTO: (one=one<<1),
  ABACO_HOWTO: (one=one<<1)
};

@Injectable()
export class AppDataProvider {
  private observer: ReplaySubject<any> = new ReplaySubject<any>(1);
  private settings: AppState;
  constructor(private storage: Storage){
    //this.storage.remove(data_key); //clear level 1 each time the application starts
    this.storage.get(data_key).then((data) => {
      this.settings = new AppState();
      if (data) {
        this.settings = data;
      }
      this.observer.next(this.settings);
    });
  }

  ready():Observable<any> {
    return this.observer;
  }

  hasFlag(flag) {
    return (this.settings.flags & flag) == flag;
  }

  setFlag(flag) {
    this.settings.flags = this.settings.flags | flag; //[key] = true;
    this.update();
  }

  setHomeIntroPlayed() {
    this.settings.homeIntroVideoPlayed = true;
    this.update();
  }

  private update() {
    this.storage.set(data_key, this.settings)
    .catch(reason => {
      console.log('failed to store ' + data_key);
      console.log(reason);
    });
  }

}
