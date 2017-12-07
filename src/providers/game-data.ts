import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/Rx';
//import 'rxjs/add/operator/map';
import { GameState, LevelState, ChallengeState } from './models/game-state';

const game_state_key: string = 'game_state';
const level_state_key: string = 'level_$id_state';

@Injectable()
export class GameDataProvider {
  private observer: ReplaySubject<any> = new ReplaySubject<any>(1);
  private settings: any;

  constructor(private http: HttpClient, private storage: Storage) {
    let setup = this.http.get('assets/game/setup.json');
    let gameState = this.storage.get(game_state_key);
    
    Observable.forkJoin([setup, Observable.fromPromise(gameState)]).subscribe((data) => {
      let gameSetup:any = data[0];
      let gameState:GameState = data[1];
      if (!gameSetup.levels) return;

      if (gameState == null) gameState = new GameState();
      
      let settings = {
        firstTime: gameState.firstTime,
        state: gameState,
        levels: []
      };


      for(var i = 0; i < gameSetup.levels.length; i++){
        let level = gameSetup.levels[i];
        level.unlocked = i <= gameState.maxLevelCompleted;
        settings.levels.push(level);
      }
      
      //Publish the settings
      this.settings = settings;
      this.observer.next(settings);
    });
  }

  ready():Observable<any> {
    return this.observer;
  }

  levels(): Observable<any> {
    //return this.http.get(['./assets/game/game.json'].join(''));
    let r = new ReplaySubject<any>(1);
    this.observer.subscribe(settings => {
      r.next(settings.levels);
    });
    return r;
  }

  getLevel(id): Observable<any> {
    return Observable.create(observer => {
      this.observer.subscribe(settings => {

        let level = settings.levels.find(l => { return l.id == id });
        if (level && level.unlocked && !level.prepared) {

          this.storage.get(level_state_key.replace('$id', id)).then((state:LevelState) => {
            if (state == null) state = new LevelState();

            for(var i = 0; i < level.challenges.length; i++){
              let challenge = level.challenges[i];
              challenge.unlocked = i <= state.maxChallengeCompleted;
              challenge.completed =  i < state.maxChallengeCompleted;
              challenge.playing = !challenge.completed && challenge.unlocked;
              if (!state.challenges[i]) state.challenges[i] = new ChallengeState();

              if (challenge.unlocked) {
                let challengeState = state.challenges[i];
                challenge['prize_1'] = challenge['prize_2'] = challenge['prize_3'] = 'empty';
                for(let k = 1; k <= challengeState.topScores.length && k <= 3; k++) {
                  challenge['prize_'+k] = challengeState.topScores[k-1] == 1 ? 'excellent' : 'good';
                }
              }
            }
            observer.next(level);
            observer.complete();
            level.prepared = true;
          });
        }
        else {
          observer.next(level);
          observer.complete();
        }
      })
    });
  }

  getChallenge(id, levelId) {
    const httpOptions:any = {
      headers: { 'content-type': 'text/html' },
      responseType: 'text'
    };
    return Observable.create(observer => {
      Observable.forkJoin([
        this.getLevel(levelId),
        this.http.get('assets/game/level_'+levelId+'/challenge_'+id+'.html', httpOptions),
        this.http.get('assets/game/level_'+levelId+'/challenge_'+id+'.css', httpOptions).catch(error => {
          return Observable.of('');
        })
      ]).subscribe(data => {
        let challengeInfo = {
          setup: data[0].challenges[id-1],
          template: data[1],
          css: data[2]
        };

        observer.next(challengeInfo);
        observer.complete();
      });
    });    
  }
}
export { GameState, LevelState, ChallengeState }
