import { Injectable } from '@angular/core';

import { TepuyActivityService } from '../activity.provider';
import { TepuyUtils } from '../../tepuy-utils';
import { TepuyErrorProvider } from '../../providers/error.provider';
//import { TepuyActivityService } from '../activity/activity.provider';

@Injectable()
export class TepuySelectableService extends TepuyActivityService {
  private items: Array<any> = [];
  private groups: Array<any> = [];

  constructor(protected errorProvider: TepuyErrorProvider) {
    super(errorProvider);
    //Register required events
    this.registerEvent('itemAdded');
    this.registerEvent('itemChanged');
  }

  newGroupId() {
    return this.groups.length;
  }

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
    let good = 0;
    let total = 0;
    for(let item of this.items) {
      item.succeed = item.isCorrect; //(item.correct && item.selected);
      console.log(item.succeed);
      item.done = true;
      total += TepuyUtils.bValue(item.correct) + TepuyUtils.bValue((!item.correct && item.selected));
      good += TepuyUtils.bValue(item.succeed);
    }
    const score = (good / total);
    const rate = score == 1 ? 'perfect' : score >= this.minScore ? 'good' : 'wrong';
    this.emit('activityVerified', { 
      id: this.id, 
      score: score,
      rate: rate,
      success: score >= this.minScore
    });

    //(las correctas marcadas) / (las que deben ser marcadas + las marcadas incorrectas) * 100;
  }
}