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
  class L4Ch7Component {
    tBoxStyle:any;
    bBoxStyle:any;
    private shuffle: ShufflePipe;

    private sets:any = [
      { "value": "aprender", "phrase": ["Isabel quiere", "", "a leer"], "options": ["aprender", "dormir", "perdonar"] },
      { "value": "importante", "phrase": ["Es muy", "", "aprender a leer"], "options": ["liso", "importante", "salado"] },
      { "value": "bailar", "phrase": ["Eliana salió a", "", "salsa"], "options": ["bailar", "mejorar", "dormir"] },
      { "value": "seca", "phrase": ["Mario recogió la ropa que estaba", ""], "options": ["importante", "grueso", "seca"] },
      { "value": "lavar", "phrase": ["Juan debe", "", "los platos"], "options": ["lavar", "inventar", "perdonar"] },
      { "value": "caliente", "phrase": ["María se quemó con la sopa", ""], "options": ["dulce", "mojada", "caliente"] },
      { "value": "jugar", "phrase": ["A Camilo le gusta", "", "con muñecas"], "options": ["olvidar", "jugar", "necesitar"] },
      { "value": "grande", "phrase": ["El elefante es un animal muy", ""], "options": ["débil", "delgada", "grande"] },
      { "value": "Caminar", "phrase": ["", "es bueno para la salud"], "options": ["necesitar", "olvidar", "Caminar"] },
      { "value": "olvidar", "phrase": ["Cuando no se practican las cosas, se pueden", ""], "options": ["olvidar", "sonreír", "cantar"] },
      { "value": "frío", "phrase": ["Debes abrigarte cuando el clima está", ""], "options": ["viejo", "barata", "frío"] },
      { "value": "dormir", "phrase": ["Recuerda lavarte los dientes antes de", ""], "options": ["esperar", "amar", "dormir"] },
      { "value": "liso", "phrase": ["Andrea se resbaló, porque el piso estaba", ""], "options": ["salado", "liso", "joven"] },
      { "value": "mejorar", "phrase": ["La práctica te ayudará a", "", "tus habilidades"], "options": ["lavar", "mejorar", "correr"] },
      { "value": "joven", "phrase": ["Quima es una osa más", "", "que Congo"], "options": ["joven", "caro", "seca"] },
      { "value": "ganar", "phrase": ["El equipo se alegró mucho al", "", "el partido"], "options": ["esperar", "ganar", "decir"] },
      { "value": "grueso", "phrase": ["El árbol es más", "", "que la flor"], "options": ["débil", "caliente", "grueso"] },
      { "value": "canta", "phrase": ["Alejandra es muy afinada cuando", ""], "options": ["canta", "camina", "olvida"] },
      { "value": "dulce", "phrase": ["El azúcar es más", "", "que la sal"], "options": ["dulce", "viejo", "seca"] },
      { "value": "necesita", "phrase": ["Juan decidió botar las cosas que ya no", ""], "options": ["baila", "inventa", "necesita"] }
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
          'fontSize.px': tBoxRect.h * .25,
          'lineHeight.px': tBoxRect.h * .3
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

  return L4Ch7Component;
}