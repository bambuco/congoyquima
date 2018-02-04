import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

import { rand } from '../utils';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L3Ch8Component {
    boxStyles:any[] = [];
    
    private optionSets:any = {
      "billete": {
        "answers": [0,3,4,1,2],
        "sets": [
          ["delgado", "azul", "redondo", "caliente", "triste", "pesado"],
          ["áspero", "enojado", "vacío", "plano", "bondadoso"],
          ["amargado", "cruel", "distraído", "desconfiado", "rectangular"],
          ["tierno", "liviano", "impaciente", "inmaduro", "llorón"],
          ["malgeniado", "nervioso", "útil", "perezoso", "sonriente"]
        ]
      },
      "miel": {
        "answers": [2,0,3,4,1],
        "sets": [
          ["aburrida", "celosa", "amarilla", "cuadrada", "desconfiada"],
          ["viscosa", "salada", "egoísta", "elegante", "cariñosa"],
          ["sonriente", "ambiciosa", "triste", "pegajosa", "negativa"],
          ["picante", "enojada", "amistosa", "débil", "dulce"],
          ["infantil", "natural", "histérica", "insensible", "cansada"]
        ]
      },
      "vaso": {
        "answers": [4,3,2,1,0],
        "sets": [
          ["feliz", "cansado", "áspero", "cuadrado", "cilíndrico"],
          ["pensativo", "oscuro", "dulce", "frágil", "amistoso"],
          ["lejano", "pobre", "liso", "grosero", "picante"],
          ["simpático", "ligero", "inútil", "triste", "rápido"],
          ["sólido", "rugoso", "delicioso", "amable", "triangular"]
        ]
      },
      "semilla": {
        "answers": [0,4,1,3,2],
        "sets": [
          ["pequeñas", "dolorosas", "amigables", "rudas", "cómodas"],
          ["simpáticas", "culpables", "solitarias", "dolorosas", "duras"],
          ["pensativas", "valiosas", "orgullosas", "peligrosas", "invisibles"],
          ["pesadas", "enfermas", "altas", "livianas", "arriesgadas"],
          ["tiernas", "nerviosas", "importantes", "impacientes", "deprimidas"]
        ]
      },
      "manzana": {
        "answers": [1,2,0,3,4],
        "sets": [
          ["tímidas", "rojas", "enojadas", "picantes", "graciosas"],
          ["cuadradas", "rectangulares", "redondas", "triangulares", "grises"],
          ["comestibles", "desconfiadas", "grandes", "cordiales", "atrevidas"],
          ["sonrientes", "estudiosas", "lamentables", "deliciosas", "astutas"],
          ["ardientes", "mansas", "largas", "familiares", "nutritivas"]
        ]
      },
      "bosque": {
        "answers": [2,3,4,0,1],
        "sets": [
          ["simpáticos", "morados", "importantes", "elegantes", "cuadrados"],
          ["brillantes", "enojados", "gordos", "tranquilos", "amargos"],
          ["engreídos", "estúpidos", "educados", "grasosos", "naturales"],
          ["valiosos", "golosos", "generosos", "impulsivos", "arenosos"],
          ["negros", "frescos", "rudos", "intolerantes", "torpes"]
        ]
      },
      "lápiz": {
        "answers": [3,4,0,1,2],
        "sets": [
          ["pesado", "húmedo", "gracioso", "delgado", "azul"],
          ["apenado", "complejo", "aventurero", "callado", "liviano"],
          ["duro", "delicioso", "curvo", "lujoso", "cruel"],
          ["tranquilo", "largo", "valiente", "dulce", "estudioso"],
          ["picante", "negativo", "útil", "peludo", "cariñoso"]
        ]
      },
      "sol": {
        "answers": [4,0,1,2,3],
        "sets": [
          ["solidario", "entrometido", "salado", "liso", "grande"],
          ["caliente", "amargo", "enojado", "peludo", "afectuoso"],
          ["ligero", "amarillo", "culpable", "difícil", "pequeño"],
          ["feo", "tacaño", "luminoso", "talentoso", "superficial"],
          ["muerto", "bajo", "corto", "radiante", "responsable"]
        ]
      },
      "flor": {
        "answers": [0,1,2,3,4],
        "sets": [
          ["bonitas", "sensatas", "puntuales", "rápidas", "aburridas"],
          ["pegajosas", "coloridas", "desordenadas", "maduras", "ruidosas"],
          ["peligrosas", "arriesgadas", "delicadas", "espesas", "traviesas"],
          ["rectangulares", "calientes", "conversadoras", "olorosas", "tontas"],
          ["ágiles", "pesadas", "lentas", "decaídas", "variadas"]
        ]
      },
      "chocolate": {
        "answers": [2,0,3,1,4],
        "sets": [
          ["impotente", "aburrido", "café", "áspero", "coqueto"],
          ["oscuro", "estudioso", "diligente", "peludo", "triste"],
          ["luminoso", "sonriente", "crespo", "duro", "bondadoso"],
          ["tímido", "comestible", "sincero", "mandón", "servicial"],
          ["pobre", "rosado", "enojado", "educado", "rectangular"]
        ]
      }
    };
    private setsToUse:any = {};
    private setOptions:number[] = [0, 1, 2, 3, 4];

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      const word = group.data;
      let sets = this.setsToUse[word];
      if (!sets || !sets.length) {
        sets = this.setsToUse[word] = this.setOptions.slice(0);
      }
      const set = sets.splice(rand(sets.length-1), 1)[0];
      let options = this.optionSets[word].sets[set].slice();
      const answer = options[this.optionSets[word].answers[set]];

      setTimeout(() => {
        group.options = options;
        group.answer = answer;
        group.ready = true;
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
      let boxes:any = [
        { w: 420 * scale, h: 470 * scale },
        { w: 498 * scale, h: 86 * scale },
        { w: 498 * scale, h: 668 * scale }
      ];

      const sw = rect.height; // * 100 / 70;
      const positions = [484, 444, 1030];
      for (let i = 0, iLen = positions.length; i < iLen; i++) {
        let left = sw * (positions[i] / 1920);
        let offset = (sw - rect.width) / 2;
        left -= offset;
        boxes[i].l = left;
      }

      this.ngZone.run(() => {
        this.boxStyles = boxes.map((box) => {
          return { 
            'width.px': box.w,
            'height.px': box.h,
            'left.px': box.l
          };
        });
      });
    }

    onReset() {
    }
  }
  return L3Ch8Component;
}