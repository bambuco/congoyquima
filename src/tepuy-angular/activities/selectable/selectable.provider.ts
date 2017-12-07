import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { TepuyActivityService } from '../activity.provider';
import { TepuyUtils } from '../../tepuy-utils';
//import { TepuyActivityService } from '../activity/activity.provider';

@Injectable()
export class TepuySelectableService extends TepuyActivityService {
  private itemCount: number = 0;
  private items: Array<any>;
 
  constructor() {
    super();
    //Register required events
    this.registerEvent('itemAdded');
    this.registerEvent('itemChanged');
    this.items = [];
  }

  /*newId() {
    return this.itemCount++;
  }*/

  itemAdded(item: any) {
    this.items.push(item);
    this.emit('itemAdded', item);
  }

  itemChanged(item: any) {
    this.emit('itemChanged', item);
  }

  /**
   * Evaluates the result of the activity.
   * @emit {event} {id: activityId, score: the score for the activity }
   */  
  verify() {
    let right = 0;
    let expected = 0;
    for(let item of this.items) {
      let val = item.el.nativeElement.innerText;
      item.succeed = (item.correct && item.selected);
      expected += TepuyUtils.bValue(item.correct) + TepuyUtils.bValue((!item.correct && item.selected));
      right += TepuyUtils.bValue(item.succeed);
    }
    this.emit('activityVerified', { id: this.id, score: ( right / expected ) })
    //(las correctas marcadas) / (las que deben ser marcadas + las marcadas incorrectas) * 100;
  }
}