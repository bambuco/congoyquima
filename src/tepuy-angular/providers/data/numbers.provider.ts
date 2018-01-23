import { DataProvider } from './abstract.data.provider';

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
      this.seed = this.random(this.min, this.max, undefined, this.repeat);
      let value = (this.seed++);
      if (this.count == 1) {
        return [ value ];
      }
      else {
        let i = 1;
        let values = [ value ];
        while (i++ < this.count) {
          values.push(++value)
        }
        return values;
      }
    }
  }

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}
