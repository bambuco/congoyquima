import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L4Ch1Component {
    lBoxStyle:any;
    rBoxStyle:any;
    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event) {
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
      let lBoxRect:any = {
        w: 588 * scale,
        h: 568 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let left = sw * (517 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      lBoxRect.l = left;

      let rBoxRect:any = {
        w: 150 * scale,
        h: 219 * scale
      };
      left = sw * (1269 / 1920);
      offset = (sw - rect.width) / 2;
      left -= offset;
      rBoxRect.l = left;

      this.ngZone.run(() => {
        this.lBoxStyle = { 
          //'width.px': lBoxRect.w,
          //'height.px': lBoxRect.h,
          'left.px': lBoxRect.l
        };
        this.rBoxStyle = { 
          //'width.px': rBoxRect.w,
          //'height.px': rBoxRect.h,
          'left.px': rBoxRect.l,
        };
      });
    }

    onSelect(idx, group, response) {
      group.answer = idx;
      group.answerValue = idx+1;
      group.result = (group.answerValue == response) ? 'correct' : 'wrong';
    }
    
    onReset() {
    }
  }
  return L4Ch1Component;
}