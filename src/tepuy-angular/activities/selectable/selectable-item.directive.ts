import { Directive, Input, ContentChild, ElementRef, Renderer2, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { TepuyActivityService } from '../../activities/activity.provider';
import { TepuySelectableService } from './selectable.provider';

@Directive({ 
  selector: '[tepuy-selectable-item]',
  host: { "(click)": "toggle($event)", "[class.tepuy-good]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false",
    "[class.tepuy-selected]": "selected === true" }
})
export class TepuySelectableItemDirective implements OnInit, AfterViewInit {
  @Input('tepuy-group') group: string;
  @Input('tepuy-correctFn') correctFn: string;
  @Input('tepuy-correct') correct: boolean;

  valueEl: any;
  id: string;
  selected: boolean;
  done: boolean;
  succeed: boolean;

  private service: TepuySelectableService;

  constructor(private el: ElementRef, private renderer: Renderer2, serviceWrapper: TepuyActivityService) 
  { 
    this.service = serviceWrapper as TepuySelectableService;
  }

  ngOnInit() {
    let el = this.el.nativeElement.querySelector('[tepuy-item-value]');
    this.valueEl = el || this.el.nativeElement;
  }

  ngAfterViewInit(){
    this.initialize();
  }

  initialize() {
    this.id = this.service.childId();
    //this.service.emit('itemAdded', this);
    this.service.itemAdded(this);
    this.service.on('activityReset').subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  refresh() {
    this.selected = false;
    this.done = false;
    this.succeed = null;
  }

  toggle() {    
    //toogle only if has not been resolved
    if (this.done) return;
    this.selected = !this.selected;
    //this.service.emit('itemChanged', this);
    this.service.itemChanged(this);
  }

  get value() {
    //return this.el.nativeElement.value ? this.el.nativeElement.value : this.el.nativeElement.innerText;
    return ('value' in this.valueEl) ? this.valueEl.value : this.valueEl.innerText;
  }
  set value(val) {
    //var el = this.valueEl ? this.valueEl : this.el.nativeElement;
    if (this.valueEl.value)
      this.valueEl.value = val;
    else {
      this.valueEl.innerText = val;
    }
  }
}