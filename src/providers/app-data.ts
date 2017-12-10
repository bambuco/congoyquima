import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/Rx';

import { AppState } from './models/app-state';

const data_key: string = 'app_state';
@Injectable()
export class AppDataProvider {
  private observer: ReplaySubject<any> = new ReplaySubject<any>(1);
  private settings: AppState;
  constructor(private storage: Storage){
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

  hasSeenIntro() {
    return this.settings.introVideoPlayed === true;
  }

  setIntroPlayed() {
    this.settings.introVideoPlayed = true;
    this.update();
  }

  private update() {
    this.storage.set(data_key, this.settings).then(value => {
      console.log(value);
    })
    .catch(reason => {
      console.log('failed to store ' + data_key);
      console.log(reason);
    });
  }

}
