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
  nextGroup():any[];
  reset():void;
}

/**
 * Class DataProviderFactory.
 * @value {event} {id: activityId, score: the score for the activity }
 */  
export class DataProviderFactory {
  constructor() {
  }
  
  create(exp:string, setup?:any):IDataProvider {
    if (!exp) return null;
    let match = /(randomof|sequenceof)(.*)/.exec(exp);
    if (match == null) {
      throw new Error('Unsopported method ' + match);      
    }

    const fn = match[1].replace(/of$/, '');
    match = /(numbers|letters|setup):(.*)/.exec(match[2]);
    if (match == null) {
      throw new Error('Unsopported type ' + match[2]);
    }
    //const fn = matches[1];
    const type = match[1];
    const settings = this.parseExp(match[2]);

    if (type == 'numbers') {
      return new NumbersProvider(fn, settings);
    }
    if (type == 'letters') {
      return new LettersProvider(fn, settings);
    }

    if (type == 'setup') {
      return new SetupProvider(fn, settings, setup);
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

  next():any {
    throw new Error('Not implemented');    
  }

  nextGroup():any[] {
    throw new Error('Not implemented');    
  }

  reset():void {
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
    while(!repeat && this.cacheHash[num]) {
      num = (max - min) * Math.random() + min;
      num = round ? Math.round(num) : num;
    }
    if (!repeat) {
      this.cacheHash[num] = true;
    }
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
  count:number = 1;
  maxDist: number = Infinity;
  seed: number;
  repeat: boolean;
  fn: string = 'random';

  constructor(fn:string, opts:any) {
    super();

    this.min = parseInt(opts.min);
    this.max = parseInt(opts.max);

    if (!isNaN(opts.step)) {
      this.step = parseInt(opts.step);
    }

    if (isNaN(this.min) || isNaN(this.max) || this.min > this.max) {
      throw new Error('Invalid settings provided. please review a value range and step has been provided');
    }

    this.count = (isNaN(opts.count)) ? 1 : parseInt(opts.count);

    if (!isNaN(opts['max-dist'])) {
      this.maxDist = parseInt(opts['max-dist'])
    }
    this.repeat = /^true$/i.test(opts.repeat+'');

    this.fn = fn;
    if (fn == 'sequence') {
      this.seed = this.random(this.min, this.max);
    }
  }

  next():number {
    if (this.fn == 'random') {
      return this.random(this.min, this.max, undefined, this.repeat);
    }
    else {
      return (this.seed++);
    }
  }

  nextGroup():number[] {
    let attempts = 0;
    let maxAttempts = 0;
    if (this.fn == 'random') {
      const value = this.random(this.min, this.max, undefined, this.repeat);
      if (this.count == 1) {
        return [value];
      }
      else {
        let i = 1;
        let result = [ value ];

        while(i < this.count) {
          let value2 = 0;

          if (this.maxDist == Infinity) {
            attempts = 0;
            maxAttempts = (this.max - this.min) * 5; //5 times the size of the group
            do {
              value2 = this.random(this.min, this.max, undefined, true);
            } while((Math.abs(value2 - value) > this.maxDist || result.indexOf(value2) >= 0) && (++attempts) < maxAttempts);
            if (attempts == maxAttempts) {
              throw new Error('NumberProvider:Maximum number of attempts to get a number has been reached');              
            }
          }
          else {
            let min = Math.max(this.min, value - this.maxDist);
            let max = Math.min(this.max, value + this.maxDist);
            attempts = 0;
            maxAttempts = (max - min) * 5; //5 times the size of the group
            do {
              value2 = this.random(min, max, undefined, true);
            } while((Math.abs(value2 - value) > this.maxDist || result.indexOf(value2) >= 0) && (++attempts) < maxAttempts);
            if (attempts == maxAttempts) {
              throw new Error('NumberProvider:Maximum number of attempts to get a number has been reached');              
            }
          }
          result.push(value2);
          i++;
        }
        return result;
      }
    }
    else {
      const value = (this.seed++);
      if (this.count == 1) {
        return [ value ];
      }
      else {
        let i = 1;
        let values = [ value ];
        while (i < this.count) {
          values.push(value )
        }
      }
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
      return letters[(++this.seed)];
    }
  }  

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}

/**
 * Class SetupProvider. To generate data from setup.
 * 
 */  
export class SetupProvider extends DataProvider {
  min:number;
  max:number;
  seed: number;
  fn: string = 'random';
  _next:number;
  values: Array<any>;

  constructor(fn:string, opts:any, setup:any) {
    super();
    let values = setup;

    if (!setup) {
      throw new Error("SetupProvider:Missing setup");
    }
    
    if (!opts.key) {
      throw new Error("SetupProvider:Missing key");
    }
    
    for(let key of opts.key.split('.')) {
      values = values[key];
      if (!values) break;
    }

    if (!values) {
      throw new Error('SetupProvider:Key ' + opts.key + ' not found');
    }

    if (!(values instanceof Array)) {
      throw new Error('SetupProvider:' + opts.key + ' expected to be an array');
    }

    this.values = values;

    this.min = 0;
    this.max = values.length - 1;
    
    this.seed = this.random(this.min, this.max);
    this.fn = fn;
  }

  next():string {
    let value;
    if (this.fn == 'random') {
      this.seed = this.random(this.min, this.max);
      value = this.values[this.seed];
      return value;
    }
    else {
      value = this.values[(++this.seed)];
      return value;
    }
  }  

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}
