import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

import { TepuyActivityService } from './activity.provider';

@Component({
  selector: 'tepuy-activity,[tepuy-activity]',
  template: '<ng-content></ng-content>',
  //styleUrls: ['./selectable.component.scss'],
  //providers: [ TepuySelectableService ],
  host: { '[class.tepuy-completed]': 'isComplete', '[class.tepuy-success]': 'isComplete && isSuccess', '[class.tepuy-failure]': 'isComplete && !isSuccess' }
})
export class TepuyActivityComponent implements OnInit {
  @Input('tepuy-activity-id') activityId: string;
  @Input('tepuy-win-score') minScore: number;

  isComplete: boolean = false;
  isSuccess: boolean = false;
  
  constructor(public service: TepuyActivityService, protected vcRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.minScore = isNaN(this.minScore) ? 0.7 : this.minScore;
    //Work around to be able to expose the service on a parent componet when the activity component is created dynamically
    let injector: any = this.vcRef.injector;
    var parent = injector.view.context;
    let t = {};
    if (parent.init && t.toString.call(parent.init) === '[object Function]') {
      parent.init(this.service);
    }
    this.service.winScore = this.minScore;
  }
}
