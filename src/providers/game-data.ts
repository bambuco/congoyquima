import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

//import {serialize, deserialize} from "serializer.ts/Serializer";
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GameState, LevelState, ChallengeState } from './models/game-state';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';



const game_state_key: string = 'game_state';
const level_state_key: string = 'level_$id_state';
const maxPrizes = 3;

@Injectable()
export class GameDataProvider {
  private observer: ReplaySubject<any> = new ReplaySubject<any>(1);
  private settings: any;

  constructor(private http: HttpClient, private storage: Storage) {
    let setup = this.http.get('assets/game/html/setup.json');
    let gameState = this.storage.get(game_state_key);

    //ToDo: Remove this line so the level state is not cleared
    //this.storage.remove('level_1_state'); //clear level 1 each time the application starts

    //ToRemove this.restoreState(1, 9);

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
        level.currentChallenge = 0;
        if (level.unlocked) {
          if (i == gameState.maxLevelCompleted) {
            this.getLevel(i+1).subscribe((aLevel:LevelState) => {
              level.currentChallenge = aLevel.currentChallenge;
            });
          }
          else {
            level.currentChallenge = 10; //it is completed
          }
        }
        settings.levels.push(level);
      }
      
      //Publish the settings
      this.settings = settings;
      this.observer.next(settings);
    });
  }

  restoreState(level:number, challenge:number) {
    this.storage.set(game_state_key, {
      firstTime: false,
      maxLevelCompleted: level-1
    });

    this.storage.get(level_state_key.replace('$id', level+'')).then((state:LevelState) => {
      state.currentChallenge = challenge;
      state.challenges.splice(challenge, 10-challenge);
      this.storage.set(level_state_key.replace('$id', '1'), state);
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

          let challenges = this.http.get(['assets/game/html/l_', id, '/challenges.json'].join(''))
            .catch(error => {
              let items = [];
              for(let i = 0; i < 10; i++) items.push({id: i, label: (i+1)+''});
              items[0].unavailable = true;
              return Observable.of(items);
            });
          let levelState = this.storage.get(level_state_key.replace('$id', id));

          Observable.forkJoin([challenges, Observable.fromPromise(levelState)]).subscribe((data) => {
            const challenges:any[] = data[0];
            let state:LevelState = data[1];
            if (state == null) state = new LevelState();
            level.currentChallenge = state.currentChallenge;
            level.challenges = challenges;

            for(var i = 0, iLen = challenges.length; i < iLen; i++){
              let challenge = challenges[i];
              challenge.levelId = parseInt(id);
              challenge.unlocked = i <= state.currentChallenge && !challenge.unavailable; //Added to control when the next label is not imlemented yet
              challenge.completed =  i < state.currentChallenge;
              challenge.playing = !challenge.completed && challenge.unlocked;
              if (!state.challenges[i]) state.challenges[i] = new ChallengeState();

              if (challenge.unlocked) {
                let challengeState = state.challenges[i];
                challenge['prize_1'] = challenge['prize_2'] = challenge['prize_3'] = 'empty';
                for(let k = 1; k <= challengeState.topScores.length && k <= maxPrizes; k++) {
                  challenge['prize_'+k] = challengeState.topScores[k-1] == 1 ? 'perfect' : 'good';
                }
                challenge.completed = challenge['prize_3'] != 'empty';
              }
            }
            level.prepared = true;
            observer.next(level);
            observer.complete();
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
    id = parseInt(id) + 1;
    levelId = parseInt(levelId);
    return Observable.create(observer => {
      Observable.forkJoin([
        this.getLevel(levelId),
        this.http.get('assets/game/html/l_'+levelId+'/ch_'+id+'.html', httpOptions).catch(error => {
          return Observable.of('NotFound');
        })/*, //ToDo: Enable loading css when required
        this.http.get('assets/game/l_'+levelId+'/ch_'+id+'.css', httpOptions).catch(error => {
          return Observable.of('');
        })*/
      ]).subscribe(data => {
        let nextChallenge = null;
        if (id < data[0].challenges.length) {
          nextChallenge = data[0].challenges[id];
        }
        else if (levelId < this.settings.levels.length) {
          nextChallenge = null; //There is no next level
        }

        let challengeInfo = {
          setup: data[0].challenges[id-1],
          nextAvailable: nextChallenge != null && nextChallenge != undefined && !nextChallenge.unavailable,
          template: data[1],
          css: '' //ToDo: Enable css loading when required data[2]
        };

        observer.next(challengeInfo);
        observer.complete();
      });
    });    
  }

  registerScore(challenge, score, success):Observable<any> {
    const dataKey = level_state_key.replace('$id', challenge.levelId);
    let promise = this.storage.get(dataKey).then((state:LevelState) => {
      //let state:LevelState = stateStr == null ? new LevelState() : deserialize(LevelState, stateStr);
      if (state == null) state = new LevelState();

      const chId = challenge.id;
      if (!state.challenges[chId]) state.challenges[chId] = new ChallengeState();

      let chState = state.challenges[chId];
      chState.scores.push(score);
      if (success) {
        const i = chState.topScores.findIndex((value) => {
          return !isFinite(value) || value < score;
        });
        if (i >= 0) {
          chState.topScores.splice(i, 0, score);
          chState.topScores.splice(3);
        }
        else if (chState.topScores.length < 3) {
          chState.topScores.push(score);
        }
      }
      //Should unlock next      
      if (!challenge.completed && chState.topScores.length == maxPrizes) {
        state.currentChallenge++;
        let level = this.settings.levels[challenge.levelId - 1];
        level.currentChallenge  = state.currentChallenge;
        let gameState:GameState = this.settings.state;
        let nextChallenge:any = null;
        //Level is completed
        if (state.currentChallenge == level.challenges.length) {
          gameState.maxLevelCompleted = challenge.levelId;
          this.storage.set(game_state_key, gameState);
          if (challenge.levelId < this.settings.levels.length) {
            let nextLevel = this.settings.levels[challenge.levelId];
            nextLevel.unlocked = true;
            nextLevel.currentChallenge = 0;
            nextChallenge = null; //nextLevel.challenges[0];
          }
        }
        else {
          nextChallenge = level.challenges[state.currentChallenge];
        }

        level.prepared = false;
        if (nextChallenge != null){
          nextChallenge.unlocked = nextChallenge.playing = !nextChallenge.unavailable;
          challenge.nextAvailable = nextChallenge.unlocked;
        }
        challenge.completed = true;
      }
      
      this.storage.set(dataKey, state);
      return challenge;
    })
    .catch(reason => {
      console.log('ERROR: Unable to get storage for ' + challenge.id);
      console.log(reason);
    });

    return Observable.fromPromise(promise);
  }

  unlockNextChallenge(challenge:any): Observable<any> {
    const dataKey = level_state_key.replace('$id', challenge.levelId);
    let promise = this.storage.get(dataKey).then((state: LevelState) => {

      state.currentChallenge++;
      let level = this.settings.levels[challenge.levelId - 1];
      let gameState:GameState = this.settings.state;
      let nextChallenge:any;
      //Level is completed
      if (state.currentChallenge == level.challenges.length) {
        gameState.maxLevelCompleted = challenge.levelId;
        this.storage.set(game_state_key, state);
        if (challenge.levelId < this.settings.levels.length) {
          let nextLevel = this.settings.levels[challenge.levelId];
          nextLevel.unlocked = true;
          nextChallenge = nextLevel.challenges[0];
        }

      }
      else {
        nextChallenge = level.challenges[state.currentChallenge];
      }

      nextChallenge.unlocked = nextChallenge.playing = !nextChallenge.unavailable;
      this.storage.set(dataKey, state);
      level.prepared = false;
      return nextChallenge.unlocked;
    });
    return Observable.fromPromise(promise);
  }
}
export { GameState, LevelState, ChallengeState }
