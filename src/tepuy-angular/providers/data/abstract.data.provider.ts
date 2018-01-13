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
 * Class DataProvider implements IDataProvider, abstract.
 * 
 */  

export abstract class DataProvider implements IDataProvider {
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
