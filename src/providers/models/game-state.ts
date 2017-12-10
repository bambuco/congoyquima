//import { Type } from 'serializer.ts/Decorators';

export class GameState {
  public firstTime: boolean = false;
  public maxLevelCompleted: number = 0;
  //public levelsCompleted: Array<LevelState>;

  constructor() {
    //this.levelsCompleted = new Array<LevelState>();
  }
}

export class LevelState {
  public maxChallengeCompleted: number = 0;
  //@Type(() => ChallengeState)
  public challenges: ChallengeState[];

  constructor() {
    this.challenges = new Array<ChallengeState>();
  }

}

export class ChallengeState {
  public topScores: Array<number>;
  public scores: Array<number>;
  constructor() {
    this.topScores = new Array<number>();
    this.scores = new Array<number>();
  }
}