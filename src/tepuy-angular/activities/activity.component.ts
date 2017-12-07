import { Component, OnInit, Input } from '@angular/core';

import { TepuyActivityService } from './activity.provider';

@Component({
  selector: 'tepuy-activity,[tepuy-activity]',
  template: '<ng-content></ng-content>',
  //styleUrls: ['./selectable.component.scss'],
  //providers: [ TepuySelectableService ],
  host: { '[class.tepuy-completed]': 'isComplete', '[class.tepuy-success]': 'isComplete && isSuccess', '[class.tepuy-failure]': 'isComplete && !isSuccess' }
})
export class TepuyActivityComponent implements OnInit {
  @Input('data-activity-id') activityId: string;
  @Input('data-win-score') minScore: number;

  isComplete: boolean = false;
  isSuccess: boolean = false;
  
  constructor(protected service: TepuyActivityService) {
  }

  ngOnInit() {
    this.minScore = isNaN(this.minScore) ? 0.7 : this.minScore;
  }

}
