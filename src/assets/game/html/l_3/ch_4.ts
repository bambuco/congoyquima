import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function _window():any {
  return window;
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

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      setTimeout(() => {
        group.value = Math.floor(Math.random() * (group.data + 1));
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
        w: 1055 * scale,
        h: 190 * scale
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