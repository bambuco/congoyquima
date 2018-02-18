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
  class L4Ch8Component {
    tBoxStyle:any;
    bBoxStyle:any;
    private shuffle: ShufflePipe;

    private sets:any = [
      { "value": "fría", "phrase": ["No me gusta el agua caliente, me gusta", ""], "options": ["fría", "mojada", "triste"] },
      { "value": "fea", "phrase": ["Esa camisa está muy bonita; esa camiseta, en cambio, está muy", ""], "options": ["fea", "salada", "flaca"] },
      { "value": "triste", "phrase": ["Ayer estabas muy alegre, y hoy estás", "", "; ¿te pasó algo?"], "options": ["sonriente", "joven", "triste"] },
      { "value": "silenciosa", "phrase": ["La biblioteca es muy", "", ", el patio es muy ruidoso"], "options": ["grande", "silenciosa", "lisa"] },
      { "value": "valiente", "phrase": ["Un perro es", "", ", el otro es cobarde"], "options": ["caro", "joven", "valiente"] },
      { "value": "alto", "phrase": ["Ese árbol está muy", "", "; mejor subamos a este que está más bajo"], "options": ["alto", "viejo", "cariñoso"] },
      { "value": "fácil", "phrase": ["Pensé que aprender a cocinar iba a ser muy difícil, pero resultó ser", "", " y divertido"], "options": ["delgado", "fácil", "oscuro"] },
      { "value": "apagadas", "phrase": ["No dejes las luces encendidas, es mejor que estén", "", "si no vamos a estar"], "options": ["picantes", "rugosas", "apagadas"] },
      { "value": "caerse", "phrase": ["Ayer vi a mi amiga", "", ", pero después pude ayudarla a levantarse"], "options": ["caerse", "sonreír", "pararse"] },
      { "value": "luz", "phrase": ["Los murciélagos prefieren lugares con poca", "", "y mucha oscuridad"], "options": ["hambre", "luz", "rapidez"] },
      { "value": "morir", "phrase": ["Antes de", "", ", quiero vivir feliz por muchos años"], "options": ["escribir", "comer", "morir"] },
      { "value": "verdad", "phrase": ["¿Por qué me dijiste esa mentira? Siempre te he pedido que me digas la", ""], "options": ["rabia", "verdad", "desilusión"] },
      { "value": "líquido", "phrase": ["El helado se pone sólido con el frío y", "", "con el calor"], "options": ["duro", "blanco", "líquido"] },
      { "value": "meter", "phrase": ["Antes de", "", "la ropa en la maleta, hay que sacar todo lo que hay adentro"], "options": ["meter", "cantar", "mojar"] },
      { "value": "faltar", "phrase": ["No imaginé que iba a", "", "comida; siempre pensé que nos iba a sobrar"], "options": ["doblar", "faltar", "estirar"] },
      { "value": "lejos", "phrase": ["Medellín queda más cerca de mi pueblo; en cambio, Bogotá queda más", ""], "options": ["oscuro", "caliente", "lejos"] },
      { "value": "construir", "phrase": ["Casi siempre toma más tiempo", "", "que destruir"], "options": ["construir", "dormir", "hablar"] },
      { "value": "blando", "phrase": ["No me gusta sentarme en ese mueble tan duro, prefiero este que está más", ""], "options": ["liso", "limpio", "blando"] },
      { "value": "preocupado", "phrase": ["Te veo muy", "", "; ¿qué puedo hacer para que estés más tranquilo?"], "options": ["sonriente", "preocupado", "alegre"] },
      { "value": "limpio", "phrase": ["Voy a cambiarme este pantalón sucio por uno que esté más", ""], "options": ["oscuro", "caro", "limpio"] }
    ];

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      const set = this.sets[group.data];
      let options = this.shuffle.transform(set.options.slice(0));
      setTimeout(() => {
        group.options = options;
        group.answer = set.value;
        group.phrase = set.phrase.slice(0);
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
        w: 690 * scale,
        h: 304 * scale
      };

      let bBoxRect:any = {
        w: 402 * scale,
        h: 240 * scale  
      };

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          //'height.px': tBoxRect.h,
          'fontSize.px': tBoxRect.h * .22,
          'lineHeight.px': tBoxRect.h * .25
        };
        this.bBoxStyle = { 
          'width.px': bBoxRect.w,
          'height.px': bBoxRect.h,
          'fontSize.px': bBoxRect.h / 3 * .6,
          'lineHeight.px': bBoxRect.h / 3
        };
      });
    }

    onReset() {
    }    
  }

  return L4Ch8Component;
}