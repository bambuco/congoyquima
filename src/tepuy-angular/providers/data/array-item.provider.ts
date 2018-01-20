import { DataProvider } from './abstract.data.provider';
/**
 * Class SetupProvider. To generate data from setup.
 * 
 */  
export class ArrayItemProvider extends DataProvider {
  min:number;
  max:number;
  seed: number;
  count:number = 1;
  minDist: number = 0;
  repeat: boolean = false;
  fn: string = 'random';
  _next:number;
  values: Array<any>;

  constructor(fn:string, opts:any, array:any) {
    super();
    let values:any;

    if (!array) {
      throw new Error("ArrayItemProvider:Missing array");
    }

    if (typeof(array) === 'string') {
      values = array.split('');
    }     
    else {
      values = array;
    }

    if (!(values instanceof Array)) {
      throw new Error('ArrayItemProvider: array expected to be an Array');
    }
    this.count = (isNaN(opts.count)) ? 1 : parseInt(opts.count);

    if (!isNaN(opts['min-dist'])) {
      this.minDist = parseInt(opts['min-dist'])
    }

    this.values = values; 

    this.min = 0;
    this.max = values.length - 1;
    this.repeat = /^true$/i.test(opts.repeat+'');
    
    this.seed = this.random(this.min, this.max);
    this.fn = fn;
  }

  next():string {
    let value;
    if (this.fn == 'random') {
      this.seed = this.random(this.min, this.max);
      value = this.seed; //this.values[this.seed];
      return value;
    }
    else {
      value = ++this.seed; //this.values[(++this.seed)];
      return value;
    }
  }  

  nextGroup():any[] {
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

          attempts = 0;
          maxAttempts = (this.max - this.min) * 10; //10 times the size of the group
          do {
            value2 = this.random(this.min, this.max, undefined, true);
          } while((Math.abs(value2 - value) < this.minDist || result.indexOf(value2) >= 0) && (++attempts) < maxAttempts);
          if (attempts == maxAttempts) {
            console.log(this.values);
            throw new Error('ArrayItemProvider:Maximum number of attempts to get an item has been reached');              
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
          values.push(value);
        }
      }
    }
  }

  reset() {
    this.cacheHash = {};
    this.seed = this.random(this.min, this.max);
  }
}
