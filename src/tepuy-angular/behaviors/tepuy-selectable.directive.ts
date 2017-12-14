import { Directive, Input, Output, ElementRef, HostBinding,
  AfterViewInit, EventEmitter, Renderer2
} from '@angular/core';
import { DomController } from 'ionic-angular';

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

  private item:any;
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
  }

}