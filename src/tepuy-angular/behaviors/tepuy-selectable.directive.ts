import { Directive, HostBinding,
  AfterViewInit, Input
} from '@angular/core';

import { TepuyAudioPlayerProvider } from '../providers';

@Directive({ 
  selector: '[tepuy-selectable]',
  host: { 
    "(click)": "toggle($event)",
    "(tepuyitemready)": "onItemReady($event)",
    "(tepuyitemresolved)": "onItemResolved($event)"
  }
})
export class TepuySelectableDirective implements AfterViewInit {
  @HostBinding("class.tepuy-selected") isSelected: boolean = false;
  @Input('tepuy-auto-feedback') autoFeedback: boolean = false;
  @Input('tepuy-multiple') multiple: boolean = true;

  item:any;
  private canSelect:boolean;

  constructor(private audioPlayer:TepuyAudioPlayerProvider
    ) {
  }

  ngAfterViewInit() {
  }

  //Item Events
  onItemReady(item) {
    this.isSelected = false;
    this.item = item;
    this.canSelect = true;
  }
  
  onItemResolved(item) {
    this.canSelect = false;
  }

  //Select Events
  toggle(ev) {    

    if (this.item && !this.item.actAsGreetable) {
      this.audioPlayer.stopAll();
    }

    //toogle only if has not been resolved
    if (!this.canSelect) return;
    this.isSelected = !this.isSelected;
    this.item.isCorrect = (this.item.correct && this.isSelected);
    this.item.answered = this.isSelected;
    this.checkAutofeedback();
  }

  private checkAutofeedback() {
    if (this.autoFeedback) {
      const service = this.item.activityService;
      //this.item.resolve(this.item.isCorrect);
      service.emit(service.ITEM_GROUP_COMPLETING, { 
        succeed: this.item.isCorrect
      }, this.item.group);
    }  
  }
}