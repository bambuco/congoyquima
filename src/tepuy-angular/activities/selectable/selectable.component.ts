import { Component, ViewContainerRef } from '@angular/core';

import { TepuyActivityService } from '../activity.provider';
import { TepuySelectableService } from './selectable.provider';
import { TepuyActivityComponent } from '../activity.component';
import { TepuyUtils } from '../../tepuy-utils';

@Component({
  selector: 'tepuy-selectable,[tepuy-selectable]',
  template: '<ng-content></ng-content>',
  //styleUrls: ['./selectable.component.scss'],
  providers: [ { provide: TepuyActivityService, useClass: TepuySelectableService }  ],
  host: { 'tepuy-activity': 'true', '[class.tepuy-completed]': 'isComplete', '[class.tepuy-success]': 'isComplete && isSuccess', '[class.tepuy-failure]': 'isComplete && !isSuccess' }
})
export class TepuySelectableComponent extends TepuyActivityComponent {
  //@Input('data-activity-id') activityId: string;
  //@Input('data-win-score') minScore: number;

  //isComplete: boolean = false;
  private items: Array<any>;
  id;
  itemAdded$;
  itemChanged$;
  activityVerified$;
  verifyRequest$;
  //isSuccess: boolean = false;
  
  constructor(public service: TepuyActivityService, protected vcRef: ViewContainerRef) {
    super(service, vcRef);
    this.items = [];
  }

  refresh() {
    this.service.emit('activityReset');
  }
}
