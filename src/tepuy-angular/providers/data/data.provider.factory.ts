/**********************
randomof:numbers:min=0;max=99
randomof:letters:min=a;max=Z
sequenceof:numbers:min=0;max=99;
********************/

import { IDataProvider } from './abstract.data.provider';
import { NumbersProvider } from './numbers.provider';
import { LettersProvider } from './letters.provider';
import { SetupProvider } from './setup.provider';
import { ArrayItemProvider } from './array-item.provider';

/**
 * Class DataProviderFactory.
 * @value {event} {id: activityId, score: the score for the activity }
 */  
export class DataProviderFactory {
  constructor() {
  }
  
  create(exp:string, data?:any):IDataProvider {
    if (!exp) return null;
    let match = /(randomof|sequenceof)(.*)/.exec(exp);
    if (match == null) {
      throw new Error('Unsopported method ' + match);      
    }

    const fn = match[1].replace(/of$/, '');
    match = /(numbers|letters|setup|array):(.*)/.exec(match[2]);
    if (match == null) {
      throw new Error('Unsopported type');
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
      return new SetupProvider(fn, settings, data);
    }

    if (type == 'array') {
      return new ArrayItemProvider(fn, settings, data);
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

export { IDataProvider, NumbersProvider, LettersProvider, SetupProvider, ArrayItemProvider }
