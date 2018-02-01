import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L3Ch2Component {
    tBoxStyle:any;
    bBoxStyle:any;
    
    weights:any = {
      //Kg
      "Computador": 3,
      "Televisor": 18,
      "Estufa": 10,
      "Mesa": 23,
      "Cama": 54,
      "Perro": 32,
      "Gato": 5,
      "Caballo": 435,
      "Radio": 2,
      "Vaca": 716,
      "Motocicleta": 137,
      "Carro": 1350,
      "Silla": 6,
      "Libro": 1,
      "Bicicleta": 8,
      "Teléfono": 4,
      "Puerta": 30,
      "Ventana": 38,
      //Gr
      "Manzana": 200,
      "Pera": 170,
      "Llave": 25,
      "Cuchara": 45,
      "Plato": 220,
      "Vaso": 210,
      "Zapato": 500,
      "Camisa": 180,
      "Pantalón": 600,
      "Vestido": 350,
      "Moneda": 8,
      "Billete": 1,
      "Gafas": 35,
      "Balón": 450,
      "Muñeca": 420,
      "Tijeras": 32,
      "Escoba": 380,
      "Carne": 150
    };
    itemsSorted:any[];
    items:any[];

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, objects) {
      let items = objects.map((it) => { return {val: it, weight: this.weights[it] }; });
      let sorted = objects.slice(0).sort((a, b) => {
        return this.weights[a] - this.weights[b];
      });
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
        w: 1040 * scale,
        h: 400 * scale
      };
      tBoxRect.l = Math.floor((((rect.width - tBoxRect.w) * 0.52/rect.width))*10000)/100;

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.%': tBoxRect.l
        };
      });
    }

    itemsReorder(ev) {
      const auxV = this.items[ev.from].val;
      const auxW = this.items[ev.from].weight;

      let i = ev.from;
      let step = ev.from > ev.to ? -1 : 1;
      while(i != ev.to) {
        this.items[i].val = this.items[i+step].val;
        this.items[i].weight = this.items[i+step].weight;
        ev.items[i].isCorrect = (this.items[i].val == this.itemsSorted[i]);
        i += step;
      }
      this.items[i].val = auxV;
      this.items[i].weight = auxW;
      ev.items[i].isCorrect = (auxV == this.itemsSorted[i]);
    }

    onReset() {
      this.itemsSorted = null;
    }
  }
  return L3Ch2Component;
}