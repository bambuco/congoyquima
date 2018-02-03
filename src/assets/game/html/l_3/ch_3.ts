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
  class L3Ch3Component {
    boxStyle:any[] = [];    
    private values:number[] = [];

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      const digits = group.id < 2 ? 2 : (group.id < 4 ? 3 : 4);
      let value = this.getDigitsSum(digits, 10);
      while (this.values.indexOf(value) >= 0) {
        value = this.getDigitsSum(digits, 10);
      }
      this.values.push(value);
      setTimeout(() => {
        group.value = value;
        group.digits = digits;
        group.max = (10 ** digits) - 1;
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
      let sBoxRect:any = {
        w: 264 * scale,
        h: 90 * scale //126
      };

      let lPos = [570, 470, 1235];
      let boxRect = [];

      for(let pos of lPos) {
        const per = pos / 1920;
        const sw = rect.height; // * 100 / 70;
        let left = sw * per;
        const offset = (sw - rect.width) / 2;
        left -= offset;
        boxRect.push(Object.assign({
          l: left
        }, sBoxRect));
      }

      this.ngZone.run(() => {
        for(let i of [0,1,2]) {
          this.boxStyle[i] = { 
            'width.px': boxRect[i].w,
            'height.px': boxRect[i].h,
            'left.px': boxRect[i].l
          };
        }
      });
    }

    onReset() {
      this.values = [];
    }
    
    exclude(value:any) {
      if (!value) return false;
      let total:number = 0;
      while (value > 0) {
        total += value % 10;
        value = Math.floor(value/10);
      }
      return total == 10;
    }

    private getDigitsSum(operands:number, quantity:number) {
      let max = 9;
      const maxPosible = max * operands;
      if (maxPosible < quantity) {
        throw new Error('Sum cannot be generated with only digits');
      }
      
      if (operands == 1) {
        return quantity;
      }

      const nextMaxPosible = maxPosible - max;
      const min = Math.max(quantity - nextMaxPosible, 0);
      max = Math.min(max, quantity);
      const digit = Math.floor(Math.random() * (max - min)) + min;
      return digit * Math.pow(10, operands - 1) + this.getDigitsSum(--operands, quantity-digit);
    }

  }

  return L3Ch3Component;
}