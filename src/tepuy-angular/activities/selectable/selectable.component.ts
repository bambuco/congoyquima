import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { TepuyActivityService } from '../activity.provider';
import { TepuySelectableService } from './selectable.provider';
import { TepuyActivityComponent } from '../activity.component';
import { TepuyUtils } from '../../tepuy-utils';

@Component({
  selector: 'tepuy-selectable,[tepuy-selectable]',
  template: '<ng-content></ng-content>',
  //styleUrls: ['./selectable.component.scss'],
  //providers: [ { provide: TepuyActivityService, useClass: TepuySelectableService }  ],
  host: { '[class.tepuy-completed]': 'isComplete', '[class.tepuy-success]': 'isComplete && isSuccess', '[class.tepuy-failure]': 'isComplete && !isSuccess' }
})
export class TepuySelectableComponent extends TepuyActivityComponent implements OnInit {
  //@Input('data-activity-id') activityId: string;
  //@Input('data-win-score') minScore: number;

  //isComplete: boolean = false;
  private itemCount: number = 0;
  private items: Array<any>;
  id;
  itemAdded$;
  itemChanged$;
  activityVerified$;
  verifyRequest$;
  //isSuccess: boolean = false;
  
  constructor(protected service: TepuyActivityService) {
    super(service);
    this.service.registerEvent('itemAdded');
    this.service.registerEvent('itemChanged');
    this.items = [];
    this.itemAdded$ = service.on('itemAdded').subscribe((item) => {
      this.itemCount++;
      this.items.push(item);
    });

    this.itemChanged$ = service.on('itemChanged').subscribe((item) => {
      //this.selectedCount += item.selected ? 1 : -1;
    });

    this.activityVerified$ = service.on('activityVerified').subscribe((result:any) => {
      this.isSuccess = (result.score >= this.minScore);
      this.isComplete = true;
    });

    this.verifyRequest$ = service.on('verifyRequested').subscribe(() => {
      console.log('Verifying...');
      this.verify();
    })
  }

  ngOnInit() {
    this.minScore = isNaN(this.minScore) ? 0.7 : this.minScore;
  }

  ngOnDestroy() {
    this.itemAdded$.unsubscribe();
    this.itemChanged$.unsubscribe();
    this.activityVerified$.unsubscribe();
    this.verifyRequest$.unsubscribe();
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
      item.done = true;
      expected += TepuyUtils.bValue(item.correct) + TepuyUtils.bValue((!item.correct && item.selected));
      right += TepuyUtils.bValue(item.succeed);
    }
    this.service.emit('activityVerified', { id: this.id, score: ( right / expected ) })
    //(las correctas marcadas) / (las que deben ser marcadas + las marcadas incorrectas) * 100;
  }

  refresh() {
    this.service.emit('activityReset');
  }
}
