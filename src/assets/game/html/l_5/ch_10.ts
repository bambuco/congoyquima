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
  class L5Ch9Component {
    boxStyles:any[] = [];
    
    ready:boolean;
    items:any[];
    question:string;
    enabled:boolean;
    private shufflePipe: ShufflePipe;
    private fragments:any = {
      "fr_1": ["La gran fortuna de María es su casa y sus animales.", "María es una mujer que tiene mucho dinero.", "La casa y los animales de María valen poco dinero."],
      "fr_2": ["La lectura es una forma de viajar a mundos desconocidos.", "Juan nunca salió de su casa, porque no sabía leer.", "Los medios de transporte son muy escasos y costosos."],
      "fr_3": ["Las frutas y verduras son buenas para la salud.", "Carlos no escucha radio, porque prefiere comer.", "En la radio hablan mal de las frutas y las verduras."],
      "fr_4": ["Los esposos se respetan y se reparten las tareas del hogar.", "La esposa se encarga de cocinar y el esposo de lavar los platos.", "La esposa es la encargada de hacer todas las tareas del hogar."],
      "fr_5": ["Dar al que lo necesita es ser solidario.", "Carlos tiene mucha ropa.", "Regalar es una manera de estrenar más rápido"],
      "fr_6": ["Diana se inspira más en la noche para escribir.", "Diana prefiere madrugar, porque le rinde más el día.", "Diana se acuesta temprano, porque le da sueño leer."]
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
        return {id: i, text: it };
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
        w: 552 * scale,
        h: 230 * scale
      };

      let positions:any[] = [[582,700],[856,554],[856,809],[856,1064]]; //
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
          boxes[k]['fontSize.px'] = box.h / 4 * .9;
          boxes[k]['lineHeight.px'] = box.h / 4;
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
  return L5Ch9Component;
}