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
  class L5Ch7Component {
    boxStyles: any[];
    options:string[] = ["Invitación", "Nota", "Receta", "Carta"];

    private legendSets:any = {
      "Invitación": ["Pedirle a una amiga que te acompañe a almorzar", "Convidar a una fiesta de cumpleaños", "Invitar a alguien para ir a cine", "Citar a la comunidad a participar en una reunión", "Pedir a tus padres que te visiten en tu casa"],
      "Nota": ["Informarle a tu hijo que el almuerzo está en la nevera", "Escribir una razón que le dejaron a tu compañera", "Indicar que el contenido de la caja es delicado", "Anotar la dirección de la nueva biblioteca", "Recordar pedir la cita con el médico"],
      "Receta": ["Explicarle a tu vecina cómo preparar sopa de verduras", "Indicarle a tu hermano cómo hacer arroz con pollo", "Explicación de cómo preparar un remedio para la gripa", "Indicaciones sobre cómo hacer una ensalada", "Instrucciones para preparar jabón casero"],
      "Carta": ["Pedirle autorización a la jefa para sacar vacaciones", "Contarle a tu madre cómo es la vida en otra ciudad", "Solicitar información formalmente en la Alcaldía", "Reservar un espacio en el salón comunal", "Expresar una inconformidad a la empresa de acueducto"]
    };
    private legendsToUse:any = {};
    private usedInThisRound:string[];

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.boxStyles = [];
      this.usedInThisRound = [];
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group) {
      const type = this.options[group.data%4];
      let legends = this.legendsToUse[type];
      let legend:string;
      while(true) {
        if (!legends || !legends.length) {
          legends = this.legendsToUse[type] = this.legendSets[type].slice(0);
        }
        legend = legends.splice(rand(legends.length-1), 1)[0];
        if (this.usedInThisRound.indexOf(legend)<0) {
          this.usedInThisRound.push(legend);
          break;
        }
      }

      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          group.legend = legend;
          group.value = type;
          group.ready = true;
        });
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
        w: 759 * scale,
        h: 234 * scale
      };

      let positions:any[] = [[605,210],[479,555],[995,555],[609,903],[1147,903]]; //
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
        if (k < 1) {
          boxes[k]['width.px'] = box.w;
          boxes[k]['height.px'] = box.h;
          boxes[k]['fontSize.px'] = box.h / 3 * .7;
          boxes[k++]['lineHeight.px'] = box.h / 3;
        }
      }

      this.ngZone.run(() => {
        this.boxStyles = boxes
      });
    }

    onReset() {
      this.usedInThisRound = [];
    }
  }
  return L5Ch7Component;
}