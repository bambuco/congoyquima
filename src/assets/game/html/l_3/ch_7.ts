import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ShufflePipe } from 'ngx-pipes';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L3Ch7Component {
    boxStyle:any;
    
    itemsSorted:any[];
    items:any[];
    private shufflePipe: ShufflePipe;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shufflePipe = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event) {
      const sorted = [1,2,3,4,5];
      let items = this.shufflePipe.transform(sorted.map((it) => { return { val: it }; }));
      setTimeout(() => {
        this.items = items;
        this.itemsSorted = sorted;
      }, 100);
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
        w: 968 * scale,
        h: 232 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let left = sw * (502 / 1920);
      const offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;

      this.ngZone.run(() => {
        this.boxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l
        };
      });
    }

    itemsReorder(ev) {
      const auxV = this.items[ev.from].val;

      let i = ev.from;
      let step = ev.from > ev.to ? -1 : 1;
      while(i != ev.to) {
        this.items[i].val = this.items[i+step].val;
        ev.items[i].isCorrect = (this.items[i].val == this.itemsSorted[i]);
        i += step;
      }
      this.items[i].val = auxV;
      ev.items[i].isCorrect = (auxV == this.itemsSorted[i]);
    }

    onReset() {
      this.itemsSorted = null;
    }
  }
  return L3Ch7Component;
}