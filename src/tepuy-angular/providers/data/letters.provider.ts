import { DataProvider } from './abstract.data.provider';

const letters = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

/**
 * Class LettersProvier. To generate letters.
 * 
 */  
export class LettersProvider extends DataProvider {
  min:number;
  max:number;
  seed: number;
  fn: string = 'random';
  _next:number;

  constructor(fn:string, opts:any) {
    super();

    this.min = letters.indexOf(opts.min);
    this.max = letters.indexOf(opts.max);
    
    this.seed = this.random(this.min, this.max);
    this.fn = fn;
  }

  next():string {
    if (this.fn == 'random') {
      this.seed = this.random(this.min, this.max);
      return letters[this.seed];
    }
    else {
      return letters[this.seed++];
    }
  }  

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}
