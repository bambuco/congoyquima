import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L5Ch1Component {
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
        w: 920 * scale,
        h: 560 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let left = sw * (524 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      lBoxRect.l = left;

      this.ngZone.run(() => {
        this.lBoxStyle = { 
          'width.px': lBoxRect.w,
          'height.px': lBoxRect.h,
          'left.px': lBoxRect.l
        };
      });
    }

    onSelect() {
    }
    
    onReset() {
    }
  }
  return L5Ch1Component;
}