import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/Rx';
//import 'rxjs/add/operator/map';

@Injectable()
export class GameDataProvider {
  private settings: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private storage: Storage) {
    let setup = this.http.get('assets/game/setup.json');
    let progress = this.storage.get('game_progress');

    Observable.forkJoin([setup, Observable.fromPromise(progress)]).subscribe((data) => {
      let gameSetup = data[0];
      if (!gameSetup.levels) return;
      let settings = {
        firstTime: progress = null,
        levels: []
      };

      for(var i = 0; i < gameSetup.levels.length; i++){
        let level = gameSetup.levels[i];
        level.unlocked = i == 0;
        settings.levels.push(level);
      }

      if (progress != null) {
        //Add information to already played levels
      }
      //Publish the settings
      this.settings.next(settings);
    })

  }

  levels() {
    //return this.http.get(['./assets/game/game.json'].join(''));
    return Observable.create(observer => {
      this.settings.subscribe(settings => {
        observer.next(settings.levels);
      });
    })
  }

  getLevel(id) {
    return Observable.create(observer => {
      this.settings.subscribe(settings => {
        console.log('on GetLevel');
        console.log('level id:' + id);
        let level = settings.levels.find(level => { return level.id == id });
        if (level && !level.prepared) {
          for(var i = 0; i < level.challenges.length; i++){
            let challenge = level.challenges[i];
            challenge.completed = i == 0;
            challenge.unlocked = i <= 1;
          }
          level.prepared = true;
        }
        console.log(level);
        observer.next(level);
      })
    });
  }
}
