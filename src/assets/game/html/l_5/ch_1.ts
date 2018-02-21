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
  class L5Ch1Component {
    tBoxStyle: any;
    bBoxStyle: any;
    vBoxStyle: any;
    hlBoxStyle: any;
    labelStyle: any;
    bars: any;
    enabled: boolean;
    ready: boolean;
    value: number;
    legend: string;
    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, number) {
      let svalue = ''+number;
      let bars = (PAD.substring(0, PAD.length - svalue.length) + svalue).split('').map((digit) => {
        return { answer: parseInt(digit), value: 0 };
      });

      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          this.value = number;
          this.legend = this.numberToString(number);
          this.bars = bars;
          this.ready = true;
          this.enabled = true;
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
        w: 920 * scale,
        h: 560 * scale
      };
      let bBoxRect:any = {
        w: 980 * scale,
        h: 98 * scale
      };
      let vBoxRect:any = {
        w: 396 * scale,
        h: 148 * scale
      };
      let hlBox:any = {
        w: 132 * scale,
        h: 568 * scale
      }
      const sw = rect.height; // * 100 / 70;
      let left = sw * (524 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;
      left = sw * (494 / 1920);
      left -= offset;
      bBoxRect.l = left;

      this.ngZone.run(() => {
        this.tBoxStyle = {
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l
        };
        this.bBoxStyle = {
          'width.px': bBoxRect.w,
          'height.px': bBoxRect.h,
          'left.px': bBoxRect.l,
          'fontSize.px': bBoxRect.h / 2 * .9,
          'lineHeight.px': bBoxRect.h / 2
        };
        this.vBoxStyle = {
          'width.px': vBoxRect.w,
          'height.px': vBoxRect.h,
          'fontSize.px': vBoxRect.h * .8,
          'lineHeight.px': vBoxRect.h
        };
        this.hlBoxStyle = {
          'width.px': hlBox.w,
          'height.px': hlBox.h,
        };
      });
    }

    onSelect($event, bar, value) {
      if (bar.value === value) {
        value = 0;
      }

      if (!bar.item) {
        let itemEl = $event.target.parentElement;
        while(itemEl && !itemEl.$tepuyItem) itemEl = itemEl.parentElement;
        if (!itemEl.$tepuyItem) {
          return;
        }
        bar.item = itemEl.$tepuyItem;
      }
      bar.value = value;
      bar.item.isCorrect = bar.value == bar.answer;
    }
    
    onReset() {
      this.ready = false;
      this.enabled = false;
      this.bars = [];
      this.value = null;
    }

    private numberToString(number) {
      const numbers:string[] = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
      const measures = [
        ["unidad", "unidades"],
        ["decena", "decenas"],
        ["centena", "centenas"],
        ["unidad de mil", "unidades de mil"],
        ["decena de mil", "decenas de mil"]
      ];

      let parts = [];
      let i = 0;
      while (number > 0) {
        let digit = number % 10;
        let predicate = digit == 1 ? measures[i][0] : measures[i][1];
        parts.splice(0, 0, `${numbers[digit]} ${predicate}`);
        number = Math.floor(number / 10);
        i++;
      }

      return parts.join(', ');
    }
  }
  return L5Ch1Component;
}