import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

const PAD = '00000';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L5Ch2Component {
    tBoxStyle: any;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      let svalue = ''+group.data;
      let bars = (PAD.substring(0, PAD.length - svalue.length) + svalue).split('').map((digit) => {
        return { value: parseInt(digit) };
      });

      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          group.bars = bars;
          group.ready = true;
        });
      }, 0);
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
        w: 935 * scale,
        h: 560 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let left = sw * (539 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;

      this.ngZone.run(() => {
        this.tBoxStyle = {
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l
        };
      });
    }

    onReset() {
    }
  }
  return L5Ch2Component;
}