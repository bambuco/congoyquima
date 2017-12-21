import { Directive, Input, Output, ElementRef, OnInit,
  AfterViewInit, EventEmitter
} from '@angular/core';

import { TepuyActivityService } from '../providers';


@Directive({ 
  selector: '[tepuy-item]',
  host: { 
    "[class.tepuy-correct]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false",
    "[attr.is-succeed]": "succeed"
  }
})
export class TepuyItemDirective implements OnInit, AfterViewInit {
  @Input('tepuy-group-id') group: string;
  @Input('tepuy-correct') correct: boolean;
  @Output('tepuyitemresolved') resolved = new EventEmitter(); 
  @Output('tepuyitemready') ready = new EventEmitter(); 

  succeed: boolean = null;
  isCorrect: boolean = null;
  answered: boolean;
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
  }

  //Lifecycle events
  ngOnInit() {
    this.setValueEl();
  }

  ngAfterViewInit() {
    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      this.refresh();
    });
    this.refresh();
    
    if (!this.readyReported && (this.correct === true || this.correct === false)){
      this.activityService.itemReady(this);
    }
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
}