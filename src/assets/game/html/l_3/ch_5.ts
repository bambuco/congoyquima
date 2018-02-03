import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function rand(max:number, min:number = 0):number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L3Ch4Component {
    tBoxStyle:any;
    ops:any = { "+":true, "=": true };

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      let term = rand(group.data);
      const correct = [term, '+', group.data - term, '=', group.data].join('');
      const otherValue = rand(99, 3);
      term = rand(otherValue);
      let term2 = rand(99, 3);
      while (term2+term==otherValue) term2 = rand(99, 3);
      const incorrect = [term, '+', term2, '=', otherValue].join('');
      const lcorrect = rand(1) == 0;

      setTimeout(() => {
        group.left = lcorrect ? correct : incorrect;
        group.right = lcorrect ? incorrect : correct;
        group.isleft = lcorrect;
        group.ready = true;
      },100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(el) {
      setTimeout(() => {
        this.calculateDimensions(this.elRef.nativeElement);
      }, 400);
    }

    calculateDimensions(el) {
      const rect = this.platform.getElementBoundingClientRect(el);
      const scale = rect.height / 1920;
      let tBoxRect:any = {
        w: 1053 * scale,
        h: 200 * scale
      };
      //tBoxRect.l = Math.floor((((rect.width - tBoxRect.w) * 0.5206/rect.width))*10000)/100;

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h
        };
      });
    }

    onReset() {      
    }    
  }

  return L3Ch4Component;
}