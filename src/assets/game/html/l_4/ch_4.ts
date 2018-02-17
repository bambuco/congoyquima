import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ShufflePipe } from 'ngx-pipes';

import { rand } from '../utils';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L4Ch4Component {
    tBoxStyle:any;
    cBoxStyles: any[];
    private shuffle: ShufflePipe;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
      this.cBoxStyles = [];
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {

      const val2 = rand(9, 1);
      const answer = group.data * val2;
      let options = [ answer ];

      while (options.length < 3) {
        let val = rand(99, 1);
        if (options.indexOf(val) < 0) {
          options.push(val);
        }
      }

      options = this.shuffle.transform(options);
      console.log(options);
      setTimeout(() => {
        group.val2 = val2;
        group.options = options;
        group.answer = answer;
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
        w: 207 * scale,
        h: 106 * scale
      };
      let cBoxRects: any = [{},{},{}];
      const sw = rect.height;
      let left = sw * (950 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;
      cBoxRects[0].l = sw * (408 / 1920) - offset; //408x986
      cBoxRects[1].l = sw * (788 / 1920) - offset; //788x786
      cBoxRects[2].l = sw * (1168 / 1920) - offset; //1168x936

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l,
          'fontSize.px': tBoxRect.h * .80,
          'lineHeight.px': tBoxRect.h
        };
        this.cBoxStyles = cBoxRects.map((b) => { return {'left.px': b.l }; });
      });
    }

    onReset() {      
    }    
  }

  return L4Ch4Component;
}