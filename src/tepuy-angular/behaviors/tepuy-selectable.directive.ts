import { Directive, HostBinding,
  AfterViewInit, Input
} from '@angular/core';

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

  constructor(
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
    //toogle only if has not been resolved
    if (!this.canSelect) return;
    this.isSelected = !this.isSelected;
    this.item.isCorrect = (this.item.correct && this.isSelected);
    this.item.answered = this.isSelected;
    this.checkAutofeedback();
  }

  private checkAutofeedback() {
    console.log(this.autoFeedback);
    if (this.autoFeedback) {
      this.canSelect = false;
      const service = this.item.activityService;
      service.emit(service.ITEM_GROUP_COMPLETING, { 
        succeed: this.item.isCorrect
      }, this.item.group);
    }  
  }
}