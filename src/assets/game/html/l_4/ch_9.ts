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
  class L4Ch9Component {
    tBoxStyle:any;
    phStyle:any;
    options: any[];
    items: any[];
    label: string;
    ready: boolean;
    enabled: boolean;
    showSelector: boolean;
    activeItem: any;
    private shuffle:ShufflePipe;

    private recipes:any = {
      "milk_rice": {
        "title": "Ingredientes del arroz con leche",
        "items": [
          { "value": "arroz", "words": ["1 taza de", "", "blanco lavado"] },
          { "value": "canela", "words": ["4 astillas de", ""] },
          { "value": "", "words": ["2 tazas de agua"] },
          { "value": "tazas", "words": ["4 ", "", "de leche"] },
          { "value": "sal", "words": ["1 pizca de", ""] },
          { "value": "de", "words": ["2 cucharadas", "", "mantequilla"] },
          { "value": "", "words": ["1 1/2 taza de azúcar"] },
          { "value": "leche", "words": ["1 cucharada de", "", "condensada"] },
        ]
      },
      "chicken_soup": {
        "title": "Ingredientes del sancocho de gallina",
        "items": [
          { "value": "litros", "words": ["3", "", "de agua"] },
          { "value": "pollo", "words": ["4 muslos de", ""] },
          { "value": "trozos", "words": ["4", "", "de yuca pelada"] },
          { "value": "", "words": ["4 trozos de plátano verde"] },
          { "value": "papas", "words": ["2", "", "picadas"] },
          { "value": "cebolla", "words": ["1 tallo de", "", "larga picado"] },
          { "value": "", "words": ["2 cucharadas de cilantro picado"] },
          { "value": "Sal", "words": ["", "al gusto"] },
        ]
      },
      "beans": {
        "title": "Ingredientes de fríjoles",
        "items": [
          { "value": "fríjoles", "words": ["3 tazas de", ""] },
          { "value": "tazas", "words": ["6", "", "de agua"] },
          { "value": "cucharada", "words": ["1/2", "", "de sal"] },
          { "value": "plátano", "words": ["1/2", "", "verde"] },
          { "value": "picados", "words": ["2 tomates", ""] },
          { "value": "de", "words": ["1 cucharada", "", "cebolla picada"] }
        ]
      },
      "chicken_rice": {
        "title": "Ingredientes del arroz con pollo",
        "items": [
          { "value": "pollo", "words": ["2 pechugas de", ""] },
          { "value": "cucharadas", "words": ["3", "", "de aceite"] },
          { "value": "arroz", "words": ["1 libra de", ""] },
          { "value": "", "words": ["Agua"] },
          { "value": "", "words": ["1 cebolla blanca picada"] },
          { "value": "zanahoria", "words": ["1", "", "picada"] },
          { "value": "ajo", "words": ["2 dientes de", ""] },
          { "value": "al", "words": ["Sal", "", "gusto"] }
        ]
      },
      "home_cake": {
        "title": "Ingredientes de la torta casera",
        "items": [
          { "value": "harina", "words": ["1 libra de", "", "de trigo"] },
          { "value": "mantequilla", "words": ["1/2 libra de", ""] },
          { "value": "huevos", "words": ["6", ""] },
          { "value": "", "words": ["1 libra de azúcar"] },
          { "value": "taza", "words": ["1", "", "de leche"] },
          { "value": "hornear", "words": ["1 cucharadita de polvo de", ""] },
          { "value": "pizca", "words": ["1", "", "de sal"] }
        ]
      },
      "fresh_salad": {
        "title": "Ingredientes para ensalada fresca",
        "items": [
          { "value": "lechuga", "words": ["1", "", "verde"] },
          { "value": "rojos", "words": ["3 tomates", "", "picados"] },
          { "value": "blanca", "words": ["1 cebolla", ""] },
          { "value": "limón", "words": ["1", "", "para exprimir"] },
          { "value": "rodajas", "words": ["1/2 pepino cortado en", ""] },
          { "value": "rayada", "words": ["1/2 zanahoria", ""] }
        ]
      },
      "fruit_salad": {
        "title": "Ingredientes para ensalada de frutas",
        "items": [
          { "value": "crema", "words": ["1/2 taza de", "", "de leche"] },
          { "value": "rayado", "words": ["Queso", ""] },
          { "value": "cortadas", "words": ["2 manzanas", "", "en trozos"] },
          { "value": "bananos", "words": ["2", "", "cortados en rodajas"] },
          { "value": "de", "words": ["1/2 libra", "", "uvas"] },
          { "value": "Helado", "words": ["", "de vainilla"] }
        ]
      },
      "custard": {
        "title": "Ingredientes de la natilla",
        "items": [
          { "value": "litros", "words": ["2", "", "de leche"] },
          { "value": "maíz", "words": ["2 tazas de fécula de", ""] },
          { "value": "libra", "words": ["1", "", "de panela raspada"] },
          { "value": "canela", "words": ["4 astillas de", ""] },
          { "value": "", "words": ["2 cucharadas de mantequilla"] },
          { "value": "rayado", "words": ["1", "", "rayado"] },
          { "value": "en", "words": ["1 cucharada de canela", "", "polvo"] }
        ]
      },
      "cookies": {
        "title": "Ingredientes para galletas",
        "items": [
          { "value": "trigo", "words": ["2 tazas de harina de", ""] },
          { "value": "gramos", "words": ["100", "", "de mantequilla"] },
          { "value": "azúcar", "words": ["1/2 taza de", ""] },
          { "value": "huevo", "words": ["1", ""] },
          { "value": "cucharada", "words": ["1", "", "de esencia de vainilla"] },
          { "value": "de", "words": ["1 pizca", "", "sal"] }
        ]
      },
      "fritters": {
        "title": "Ingredientes para buñuelos",
        "items": [
          { "value": "queso", "words": ["3 tazas de", "", "molido"] },
          { "value": "tazas", "words": ["2", "", "de harina de maíz"] },
          { "value": "huevos", "words": ["3", "", "batidos"] },
          { "value": "leche", "words": ["1/2 taza de", ""] },
          { "value": "de", "words": ["2 cucharaditas", "", "azúcar"] },
          { "value": "Aceite", "words": ["", "caliente"] }
        ]
      }
    };

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, receipe) {

      let oRecipe = this.recipes[receipe];
      let options = oRecipe.items.map((it) => { return { val: it.value, text: '&nbsp;', used: false}; }).filter((it) => it.val != "");
      options = this.shuffle.transform(options);
      let items = oRecipe.items.slice(0);

      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          this.label = oRecipe.title;
          this.items = items;
          this.options = options;
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
        w: 936 * scale,
        h: 752 * scale
      };
      const sw = rect.height;
      let left = sw * (544 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;
      const rows = 12;

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l,
          'fontSize.px': (tBoxRect.h / rows * .8),
          'lineHeight.px': tBoxRect.h / (rows - 1)
        };
        this.phStyle = {
          'width.px': 300 * scale,
          'height.px': tBoxRect.h / rows,
        }
      });
    }

    onFill(ev, it) {
      if (!this.enabled || !it.value) {
          return
      }
      //assign the item if not assigned yet
      if (!it.item) {
        let el = ev.target.querySelector('input');
        it.item = el.$tepuyItem;
      }
      //Clear previous selection
      if (it.selectedOption) {
        it.selectedOption.used = false;
        it.text = '';
        it.item.isCorrect = false;
        delete it.selectedOption;
      }
      it.active = true;
      this.activeItem = it;
      this.showSelector = true;
    }

    onSelect(opt) {
      let it = this.activeItem;
      it.text = opt.val;
      it.active = false;
      it.item.isCorrect = (opt.val == it.value);
      opt.used = true;
      it.selectedOption = opt;
      this.activeItem = null;
      this.showSelector = false;
    }

    onComplete(result) {
      this.showSelector = false; //Just in case is opened.
      this.enabled = false;
    }

    onReset() {
      this.ready = false;
      this.items = [];
      this.options = [];
    }

    bdClick() {
      this.showSelector = false;
      this.activeItem.active = false;
      this.activeItem = null;
    }
  }
  return L4Ch9Component;
}