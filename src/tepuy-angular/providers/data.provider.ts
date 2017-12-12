/**********************
randomof:numbers:min=0;max=99
randomof:letters:min=a;max=Z
sequenceof:numbers:min=0;max=99;
********************/

const letters = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

/**
* Interface IDatProvider.
* 
*/  
export interface IDataProvider {
  next():any;
  reset():void;
}

/**
 * Class DataProviderFactory.
 * @value {event} {id: activityId, score: the score for the activity }
 */  
export class DataProviderFactory {
  constructor() {
  }
  
  create(exp:string):IDataProvider {
    if (!exp) return null;
    let match = /(randomof|sequenceof)(.*)/.exec(exp);
    if (match == null) {
      throw new Error('Unsopported method' + match);      
    }

    const fn = match[1].replace(/of$/, '');
    match = /(numbers|letters):(.*)/.exec(match[2]);
    if (match == null) {
      throw new Error('Unsopported type' + match[2]);
    }
    //const fn = matches[1];
    const type = match[1];
    const settings = this.parseExp(match[2]);

    if (type == 'numbers') {
      return new NumbersProvider({
        min: parseInt(settings.min),
        max: parseInt(settings.max),
        step: parseInt(settings.step),
        fn: fn
      });
    }
    if (type == 'letters') {
      return new LettersProvider({
        min: settings.min,
        max: settings.max,
        step: settings.step,
        fn: fn
      });
    }

    return null;
  }

  protected parseExp(exp:string):any {
    let hash = {};
    exp.split(';').map(item => {
      let pair = item.split('=');
      hash[pair[0]] = (pair.length > 1 ? pair[1] : null);
      return pair;
    });
    return hash;
  }
}

/**
 * Class DataProvider implements IDataProvider, abstract.
 * 
 */  

abstract class DataProvider implements IDataProvider {
  protected settings: any;
  protected cacheHash = {};
  constructor(){
  }

  next(){
    throw new Error('Not implemented');    
  }

  reset() {
    throw new Error('Not implemented');    
  }


  protected random(min, max, round=true, repeat=false) {
    if (!min) {
        min = 0;
    }
    if (!max) {
        max = 1;
    }
    
    if (min >= max) {
        max = min + 1;
    }

    var num = (max - min) * Math.random() + min;
    num = round ? Math.round(num) : num;
    while(this.cacheHash[num]) {
      num = (max - min) * Math.random() + min;
      num = round ? Math.round(num) : num;
    }
    this.cacheHash[num] = true;
    return num;
  }  
}

/**
 * Class NumbersProvier. To generate numbers.
 * 
 */  
export class NumbersProvider extends DataProvider {
  min:number;
  max:number;
  step:number = 1;
  seed: number;
  fn: string = 'random';

  constructor(opts:any) {
    super();
    this.min = parseInt(opts.min);
    this.max = parseInt(opts.max);

    if (!isNaN(opts.step)) {
      this.step = parseInt(opts.step);
    }

    if (isNaN(this.min) || isNaN(this.max) || this.min > this.max) {
      throw new Error('Invalid settings provided. please review a value range and step has been provided');
    }

    this.seed = this.random(this.min, this.max);
    this.fn = opts.fn;
    if (opts.fn == 'random') {
      this.seed = this.random(this.min, this.max);
    }
  }

  next():number {
    if (this.fn == 'random') {
      return (this.seed = this.random(this.min, this.max));
    }
    else {
      return (++this.seed);
    }
  }  

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}

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

  constructor(opts:any) {
    super();
    this.min = letters.indexOf(opts.min);
    this.max = letters.indexOf(opts.max);
    
    this.seed = this.random(this.min, this.max);
    this.fn = opts.fn;
  }

  next():string {
    if (this.fn == 'random') {
      this.seed = this.random(this.min, this.max);
      return letters[this.seed];
    }
    else {
      return letters[(++this.seed)];
    }
  }  

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}
