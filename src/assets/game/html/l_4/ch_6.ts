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
  class L4Ch6Component {
    boxStyles:any[] = [];
    
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

    prepare($event, pairs) {
      const sorted = pairs.map((p) => p[1]);
      let items = this.shufflePipe.transform(sorted.map((it) => { return { val: it }; })); //
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
      console.log(rect);
      const scale = rect.height / 1920;
      let tBoxRect:any = {
        w: 408 * scale,
        h: 344 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let lPos = [528, 1004, 684];
      let boxes = [];

      for(let pos of lPos) {
        let left = sw * (pos / 1920);
        const offset = (sw - rect.width) / 2;
        left -= offset;
        boxes.push(Object.assign({
          l: left
        }, tBoxRect));
      }
      console.log(scale);
      console.log(boxes);

      boxes[2].w = boxes[1].w * 2 + scale * 60;

      this.ngZone.run(() => {
        this.boxStyles = boxes.map((box) => {
          return { 
            'width.px': box.w,
            'height.px': box.h,
            'left.px': box.l,
            'fontSize.px': (box.h / 4) * .7,
            'lineHeight.px': (box.h / 4)
          };
        });
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
  return L4Ch6Component;
}