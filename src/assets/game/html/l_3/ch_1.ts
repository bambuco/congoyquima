import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L3Ch1Component {
    missings: any[];
    chars: any[];
    prepared:boolean = false;
    tBoxStyle:any;
    bBoxStyle:any;

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
      let tBoxRect:any = {
        w: 1048 * scale,
        h: 210 * scale
      };
      tBoxRect.l = Math.floor((((rect.width - tBoxRect.w) * 0.5206/rect.width))*10000)/100;

      let bBoxRect:any = {
        w: 1008 * scale,
        h: 210 * scale
      };
      bBoxRect.l = Math.floor((((rect.width - bBoxRect.w) * 0.5208)/rect.width)*10000)/100;

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.%': tBoxRect.l
        };
        this.bBoxStyle = { 
          'width.px': bBoxRect.w,
          'height.px': bBoxRect.h,
          'left.%': bBoxRect.l,
        };
      });
    }
  }
  return L3Ch1Component;
}