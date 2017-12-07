import { Directive, Input, ElementRef, Renderer2, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { TepuyActivityService } from '../../activities/activity.provider';
import { TepuySelectableService } from './selectable.provider';

@Directive({ 
  selector: '[tepuy-selectable-item]',
  host: { "(click)": "toggle($event)", "[class.tepuy-fine]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false",
    "[class.tepuy-selected]": "selected === true" }
})
export class TepuySelectableItemDirective implements OnInit, AfterViewInit {
  //@Input('data-tepuy-group')
  group: string;
  //@Input('data-tepuy-correctFn')
  correctFn: string;
  //@Input('data-tepuy-correct')
  correct: boolean;

  id: string;
  selected: boolean;
  done: boolean;
  succeed: boolean;

  //private service: TepuySelectableService;

  constructor(private el: ElementRef, private renderer: Renderer2, private service: TepuyActivityService) 
  { 
    //this.service = serviceWrapper as TepuySelectableService;
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.initialize();
  }

  initialize() {
    let value = this.el.nativeElement.getAttribute('data-tepuy-group');
    this.group = value;
    value = this.el.nativeElement.getAttribute('data-tepuy-correctFn');
    if (/(isNumber|isLetter|isPattern)/.test(value)) {
      this.correct = this[value]();
    }
    else {
      value = this.el.nativeElement.getAttribute('data-tepuy-correct');
      this.correct = /true/i.test(value);
    }

    this.id = this.service.childId();
    this.service.emit('itemAdded', this);
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

  isNumber() {
    let value = this.value();
    return !isNaN(value);
  }

  isLetter() {
    let value = this.value();
    return /a-zA-Z/.test(value);
  }

  isPattern(pattern) {
    let value = this.value();
    try {
      var re = RegExp(pattern);
      return re.test(value);
    }
    catch(err) {
      this.renderer.setAttribute(this.el.nativeElement, "data-tepuy-correct-error", 'invalid regex pattern');
      return false;
    }
  }

  toggle() {    
    //toogle only if has not been resolved
    if (this.done) return;
    this.selected = !this.selected;
    this.service.emit('itemChanged', this);
  }

  value() {
    return this.el.nativeElement.value ? this.el.nativeElement.value : this.el.nativeElement.innerText;
  }
}