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
  class L5Ch9Component {
    boxStyles:any[] = [];
    
    ready:boolean;
    items:any[];
    question:string;
    enabled:boolean;
    private shufflePipe: ShufflePipe;
    private fragments:any = {
      "fr_1": [
        {
          "question": "¿Cuál es la gran fortuna de María?",
          "answers": ["Su casa y sus animales.", "Su casa y su dinero.", "Su dinero y sus animales."]
        }, 
        {
          "question": "¿Qué tanto dinero tenía María?",
          "answers": ["Poco.", "Mucho.", "Nada."]
        }
      ],
      "fr_2": [
        {
          "question": "¿De dónde nunca había salido Juan?",
          "answers": ["De su casa.", "De la cocina.", "De la escuela."]
        }, 
        {
          "question": "Según Juan ¿Qué le permitía viajar a mundos desconocidos?",
          "answers": ["La lectura.", "Sus sueños.", "Los medios de transporte."]
        }
      ],
      "fr_3": [
        {
          "question": "¿Dónde escuchó Carlos que las verduras son buenas para la salud?",
          "answers": ["De la radio.", "De la televisión.", "De su vecino."]
        }, 
        {
          "question": "¿Qué tan seguido comía frutas Carlos antes de escuchar el programa?",
          "answers": ["Nunca.", "Siempre.", "Algunas veces."]
        }
      ],
      "fr_4": [
        {
          "question": "¿De qué se encarga el esposo?",
          "answers": ["Cocinar.", "Lavar los platos.", "Barrer."]
        }, 
        {
          "question": "¿De qué se encarga ella?",
          "answers": ["Lavar los platos.", "Cocinar.", "Barrer."]
        }
      ],
      "fr_5": [
        {
          "question": "¿Qué hace Carlos cada año?",
          "answers": ["Regala la ropa que ya no usa.", "Regala comida.", "Compra ropa nueva."]
        }, 
        {
          "question": "¿Qué tipo de persona es Carlos?",
          "answers": ["Solidaria.", "Acumuladora.", "Egoísta."]
        }, 
        {
          "question": "¿Cada cuánto recoge Carlos la ropa que no usa?",
          "answers": ["Cada 12 meses.", "Cada 6 meses.", "Cada 10 meses."]
        }
      ],
      "fr_6": [
        {
          "question": "¿Qué es lo que hace Diana en la noche?",
          "answers": ["Escribir.", "Cocinar.", "Jugar."]
        }, 
        {
          "question": "¿En qué momento está más inspirada Diana para escribir?",
          "answers": ["En la noche.", "En la tarde.", "En la mañana."]
        }
      ]
    };

    private questionsToUse:any = {};

   constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shufflePipe = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, fragment) {
      let questions = this.questionsToUse[fragment];
      let oQuestion:any;
      if (!questions || !questions.length) {
        questions = this.questionsToUse[fragment] = this.fragments[fragment].slice(0);
      }
      oQuestion = questions.splice(rand(questions.length-1), 1)[0];
      
      let items = oQuestion.answers.map((it, i) => {
        return {id: i, text: it };
      });
      items = this.shufflePipe.transform(items); //

      setTimeout(() => {
        this.question = oQuestion.question;
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
        h: 210 * scale
      };

      let positions:any[] = [[582,700],[856,554],[856,804],[856,979],[856,1154]]; //
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
          boxes[k]['height.px'] = (k == 1 ? box.h : (box.h * (2 / 3)));
          boxes[k]['fontSize.px'] = box.h / 3 * .7;
          boxes[k]['lineHeight.px'] = box.h / 3;
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