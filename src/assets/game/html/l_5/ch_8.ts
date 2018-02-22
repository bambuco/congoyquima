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
  class L5Ch8Component {
    boxStyles:any[] = [];
    
    ready:boolean;
    items:any[];
    enabled:boolean;
    private shufflePipe: ShufflePipe;
    private fragments:any = {
      "fr_1": [
        ["dinero", "casa", "animales"],
        ["ropa", "dinero", "comida"],
        ["fortuna", "tiempo", "trabajo"]
      ],
      "fr_2": [
        ["casa", "transporte", "lectura"],
        ["mascota", "casa", "sueño"],
        ["transporte", "tierra", "camino"]
      ],
      "fr_3": [
        ["frutas", "verduras", "salud"],
        ["plato", "radio", "caminar"],
        ["radio", "bebida", "dormir"]
      ],
      "fr_4": [
        ["lavar", "cocina", "respetan"],
        ["lavar", "barrer", "aseo"],
        ["esposo", "cocinar", "comprar"]
      ],
      "fr_5": [
        ["solidaridad", "ropa", "regala"],
        ["amistad", "mes", "personas"],
        ["valor", "zapatos", "honestidad"],
      ],
      "fr_6": [
        ["acostarse", "mañana", "lectura"],
        ["tarde", "escribir", "noche"],
        ["madrugar", "rendir", "día"]
      ]
    };

   constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shufflePipe = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, fragment) {
      let items = this.fragments[fragment].map((it, i) => {
        return {id: i, text: this.shufflePipe.transform(it.slice(0)).join(', ') };
      });
      items = this.shufflePipe.transform(items); //

      setTimeout(() => {
        this.items = items;
        this.ready = true;
        this.enabled = true;
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
        w: 452 * scale,
        h: 140 * scale
      };

      let positions:any[] = [[612,700],[996,562],[996,722],[996,882]]; //
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
        if (k > 0) {
          boxes[k]['width.px'] = box.w;
          boxes[k]['height.px'] = box.h;
          boxes[k]['fontSize.px'] = box.h / 2 * .7;
          boxes[k]['lineHeight.px'] = box.h / 2;
        }
        k++;
      }

      this.ngZone.run(() => {
        this.boxStyles = boxes
      });
    }

    onComplete(result) {
      this.enabled = false;
    }

    onReset() {
      this.ready = null;
    }
  }
  return L5Ch8Component;
}