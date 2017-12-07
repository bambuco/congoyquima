import { Directive } from '@angular/core';

import { TepuyActivityService } from '../activities/activity.provider';

@Directive({ 
  selector: '[tepuy-activity-verify]',
  host: { "(click)": "verify($event)" }
})
export class TepuyActivityVerifyDirective {
  constructor(private service: TepuyActivityService) 
  { 
  }
  
  verify() {
    console.log('attempt to verify');
    this.service.emit('verifyRequested', {});
  }
}

