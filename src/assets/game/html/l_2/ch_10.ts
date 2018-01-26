import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { ShufflePipe } from 'ngx-pipes';
import { Platform } from 'ionic-angular';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L2Ch10Component {
    missings: any[];
    chars: any[];
    prepared:boolean = false;
    lBoxStyle:any;
    rBoxStyle:any;

    private shufflePipe;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shufflePipe = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, words) {
      let missings = [];
      let chars = [];
      let hash = {};

      for(let i = 0, iLen = words.length; i < iLen; i++) {
        let word:string = words[i];

        let indexes = missings[i] = [];

        while(indexes.length < 2) {
          const val = Math.floor(Math.random() * word.length);
          const ch = word[val];
          const used = hash[ch];

          if (indexes.indexOf(val) < 0 && (!used || used < 2)) {
            indexes.push(val);
            chars.push(ch);
            hash[ch] = used ? (used+1) : 1;
          }
        }      
      }
      
      setTimeout(() => {
        $event.zone.run(() => {
          this.missings = missings;
          this.chars = this.shufflePipe.transform(chars);
          this.prepared = true;
        });
      }, 100);
    }

    isMissing(i,k) {
      if (!this.missings) return;
      return !(this.missings[i].indexOf(k) < 0);
    }

    @HostListener('window:resize', ['$event'])
    onResize(el) {
      setTimeout(() => {
        this.calculateDimensions(this.elRef.nativeElement);
      }, 400);
    }

    calculateDimensions(el) {
      const rect = this.platform.getElementBoundingClientRect(el);
      const lContainerDim = { w: 944, h: 948 }; 
      const scale = rect.height / 1920;
      let lBoxRect:any = {
        w: lContainerDim.w * scale,
        h: lContainerDim.h * scale,
        t: 16.7
      };

      lBoxRect.l = Math.floor((((rect.width - lBoxRect.w) * 0.3525)/rect.width)*10000)/100;

      let rBoxRect:any = {
        w: 114 * 2 * scale, //106+8
        h: 128 * 5 * scale, //128 + 8
        t: 16.7
      };

      rBoxRect.l = lBoxRect.l + Math.floor((lBoxRect.w / rect.width)*10000)/100 + 5;

      this.ngZone.run(() => {
        this.lBoxStyle = { 
          'height.px': lBoxRect.h,
          'width.px': lBoxRect.w,
          'left.%': lBoxRect.l,
          'top.%': lBoxRect.t
        };
        this.rBoxStyle = { 
          'height.px': rBoxRect.h,
          'width.px': rBoxRect.w,
          'left.%': rBoxRect.l,
          'top.%': rBoxRect.t
        };
      });
    }
  }
  return L2Ch10Component;
}