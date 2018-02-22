import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';

import { rand } from '../utils';


export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L5Ch3Component {

    constructor(private elRef: ElementRef,
        private ngZone: NgZone) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      let sustract = rand(group.data);
      let answer = (group.data-sustract);
      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          group.sustract = sustract;
          group.answer = answer;
          group.ready = true;
        });
      }, 100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(el) {
      setTimeout(() => {
        this.calculateDimensions(this.elRef.nativeElement);
      }, 400);
    }

    calculateDimensions(el) {
    }

    onReset() {
    }
  }
  return L5Ch3Component;
}