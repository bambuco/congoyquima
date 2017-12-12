import { Directive, ViewContainerRef, OnInit } from '@angular/core';

import { TepuyActivityService } from '../activities/activity.provider';
import { TepuyActivityComponent } from '../activities/activity.component';

@Directive({ 
  selector: '[tepuy-activity-verify]',
  host: { "(click)": "verify($event)" },
  providers: [ TepuyActivityComponent ]
})
export class TepuyActivityVerifyDirective {

  service: TepuyActivityService = null;

  constructor(private vcRef: ViewContainerRef) 
  { 
  }
  
  ngOnInit() {
    let injector: any = this.vcRef.injector;
    var parent = injector.view.context;
    if (parent instanceof TepuyActivityComponent) {
      this.service = parent.service;
    }
    else if (parent.activityService && parent.activityService instanceof TepuyActivityService) {
      this.service = parent.activityService;
    }
  }

  verify() {
    this.service && this.service.verify();//this.service.emit('verifyRequested', {});
  }
}

