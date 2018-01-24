import { DataProvider } from './abstract.data.provider';
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
  usequeue: boolean = false;

  constructor(fn:string, opts:any, setup:any) {
    super();
    let values = setup;

    if (!setup) {
      throw new Error("SetupProvider:Missing setup");
    }
    
    if (!opts.key) {
      throw new Error("SetupProvider:Missing key");
    }

    if (opts.fromQ) {
      this.usequeue = /^true$/i.test(opts.fromQ);
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

    this.values = values.slice(0);
    if (this.usequeue) {
      this.queue = this.shuffle(this.values.slice(0));  
    }
    
    this.min = 0;
    this.max = values.length - 1;
    
    this.seed = this.random(this.min, this.max);
    this.fn = fn;
  }

  next():string {
    let value;
    if (this.fn == 'random') {
      if (this.usequeue) {
        value = this.fromQ(this.values);
      }
      else {
        this.seed = this.random(this.min, this.max);
        value = this.values[this.seed];
      }
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
