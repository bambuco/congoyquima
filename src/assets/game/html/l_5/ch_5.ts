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
  class L5Ch5Component {
    boxStyles: any[];

    private shuffle: ShufflePipe;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
      this.boxStyles = [];
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      const max = group.id < 3 ? 99 : 999;
      const min = group.id < 3 ? 20 : 200;
      const offset = group.id < 3 ? 10 : 100;
      const minuend = rand(max, min);
      const sustrahend = rand(minuend - offset, min - offset);
      const result = minuend - sustrahend;
      let options = [result];
      while(options.length < 3) {
        let val = rand(max, min-offset);
        if (options.indexOf(val) < 0) {
          options.push(val);
        }
      }
      options = this.shuffle.transform(options);
      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          group.minuend = minuend;
          group.sustrahend = sustrahend;
          group.result = (result);
          group.options = options;
          group.ready = true;
        });
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
      let box:any = {
        w: 360 * scale,
        h: 150 * scale
      };

      //let positions:any[] = [[470,822],[734,252],[1138,326],[896,600]]; //
      let positions:any[] = [[470,822],[739,241],[1123,315],[881,585]]; //
      //754x251,1138x325,896x600
      const sw = rect.height; // * 100 / 70;
      let offset = (sw - rect.width) / 2;
      positions = positions.map(pos => {
        return [pos[0]*scale - offset, [pos[1]*scale]];
      });
      //'width.px': box.w, 'height.px': box.h, 
      let boxes = [];
      let k = 0;
      for (let pos of positions) {
        boxes.push({ 'left.px': pos[0], 'top.px': pos[1] });
        if (k < 1) {
          boxes[k]['width.px'] = box.w;
          boxes[k]['height.px'] = box.h;
          boxes[k]['fontSize.px'] = 80 * scale;
          boxes[k++]['lineHeight.px'] = box.h;
        }
      }

      this.ngZone.run(() => {
        this.boxStyles = boxes
      });
    }

    onReset() {
    }
  }
  return L5Ch5Component;
}