import { Directive, Input, Output, ElementRef, OnInit, OnDestroy,
  AfterViewInit, EventEmitter
} from '@angular/core';

import { TepuyActivityService } from '../providers';
import { findReorderItem } from '../classes/reorder-util';


@Directive({ 
  selector: '[tepuy-item]',
  host: { 
    "[class.tepuy-correct]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false",
    "[attr.is-succeed]": "succeed"
  }
})
export class TepuyItemDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('tepuy-group-id') group: string;
  @Input('tepuy-correct') correct: boolean;
  @Output('tepuyitemresolved') resolved = new EventEmitter(); 
  @Output('tepuyitemready') ready = new EventEmitter(); 

  succeed: boolean = null;
  isCorrect: boolean = null;
  answered: boolean;
  id: string;
  private valueEl:any;
  private readyReported: boolean;


  //Property setters/getters
  get value() {
    return ('value' in this.valueEl) ? this.valueEl.value : this.valueEl.innerText;
  }
  @Input('tepuy-value')
  set value(val) {
    this.setValueEl();
    if (this.valueEl.value)
      this.valueEl.value = val;
    else {
      this.valueEl.innerText = val;
    }
    if (!this.readyReported) {
      this.readyReported = true;
      this.activityService.itemReady(this);
    }
  }

  //Constructor
  constructor(
      private elRef: ElementRef,
      private activityService: TepuyActivityService
    ) {
    this.elRef.nativeElement.$tepuyItem = this;
    this.id = this.uniqueId();
  }

  //Lifecycle events
  ngOnInit() {
    this.setValueEl();
  }

  ngOnDestroy() {
    this.activityService.itemDestroyed(this);
  }

  ngAfterViewInit() {
    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      this.refresh();
    });
    this.refresh();
    
    if (!this.readyReported && (this.correct === true || this.correct === false)){
      this.readyReported = true;
      this.activityService.itemReady(this);
    }
  }

  getReorderNode(): HTMLElement {
    return findReorderItem(this.elRef.nativeElement, null);
  }
  //Helpers
  private setValueEl() {
    if (this.valueEl) return;
    let el = this.elRef.nativeElement.querySelector('[tepuy-item-value]');
    this.valueEl = el || this.elRef.nativeElement;
  }
  private refresh() {
    this.answered = false;
    this.succeed = null;
    this.isCorrect = null;
    this.ready.emit(this);
  }

  resolve(result) {
    this.succeed = result;
    this.resolved.emit(result);
  }

  uniqueId() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}