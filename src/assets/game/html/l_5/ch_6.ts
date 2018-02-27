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
  class L5Ch6Component {
    boxStyles:any[] = [];
    
    itemsSorted:any[];
    items:any[];
    private shufflePipe: ShufflePipe;
    private invitations:any = {
      "birthday": [
        { "val": 1, "text": "Querida Lina. El próximo " },
        { "val": 2, "text": "viernes celebraré mi cumpleaños y me " },
        { "val": 3, "text": "gustaría invitarte a una comida que estoy " },
        { "val": 4, "text": "planeando. Espero que puedas " },
        { "val": 5, "text": "asistir. ¡Te estaré esperando!" }
      ],
      "business": [
        { "val": 1, "text": "Estimado profesor: El miércoles" },
        { "val": 2, "text": "7 de febrero, a las 10:00 a.m., " },
        { "val": 3, "text": "realizaremos una reunión para hablar " },
        { "val": 4, "text": "del problema con la recolección de basuras. " },
        { "val": 5, "text": "La asistencia es obligatoria. Saludos. " }
      ],
      "reunion": [
        { "val": 1, "text": "¡Hola Camilo! " },
        { "val": 2, "text": "Estamos planeando hacer " },
        { "val": 3, "text": "un reencuentro con los compañeros del " },
        { "val": 4, "text": "colegio para la próxima semana. " },
        { "val": 5, "text": "¿Te gustaría asistir? ¿Qué día te queda fácil?" }
      ],
      "vaccination": [
        { "val": 1, "text": "¡Información de interés! El hospital " },
        { "val": 2, "text": "invita a todos los habitantes de la vereda " },
        { "val": 3, "text": "a la gran jornada de vacunación que se " },
        { "val": 4, "text": "realizará el sábado 10 de marzo a partir " },
        { "val": 5, "text": "de las 8:00 a.m. ¡Los esperamos!" }
      ],
      "wedding": [
        { "val": 1, "text": "¡Nos casaremos! Y queremos pasar ese día " },
        { "val": 2, "text": "tan importante contigo. La ceremonia será " },
        { "val": 3, "text": "el día 9 de junio a las 10:00 a.m. en la iglesia " },
        { "val": 4, "text": "del pueblo y después compartiremos un almuerzo " },
        { "val": 5, "text": "en la casa de mis padres. ¡Te esperamos!" }
      ],
      "fitness": [
        { "val": 1, "text": "¡Hola, Alejandra! ¿Vamos mañana " },
        { "val": 2, "text": "a montar en bicicleta? Si te animas, " },
        { "val": 3, "text": "paso por ti temprano en la mañana. " },
        { "val": 4, "text": "¡Aprovechemos que el clima " },
        { "val": 5, "text": "está muy bueno para salir! Un abrazo." }
      ],
      "dancing": [
        { "val": 1, "text": "¿Te gustaría aprender a bailar, " },
        { "val": 2, "text": "cantar, o actuar? ¡Nunca es tarde " },
        { "val": 3, "text": "para descubrir el artista que hay " },
        { "val": 4, "text": "en ti! Pregunta por los talleres gratuitos " },
        { "val": 5, "text": "que tenemos en la casa de la cultura. " }
      ],
      "meeting": [
        { "val": 1, "text": "La Junta de Acción Comunal de la " },
        { "val": 2, "text": "vereda La Clarita te invita a la primera " },
        { "val": 3, "text": "reunión del año, donde se discutirá sobre " },
        { "val": 4, "text": "el manejo del acueducto. ¡Es muy " },
        { "val": 5, "text": "importante tu opinión! ¡No faltes!" }
      ],
      "dating": [
        { "val": 1, "text": "¡Hola, Santiago! En los últimos días te he " },
        { "val": 2, "text": "notado aburrido y supe que has faltado " },
        { "val": 3, "text": "a clases. ¿Estás bien? ¿Te gustaría que " },
        { "val": 4, "text": "saliéramos a comer un helado? Recuerda " },
        { "val": 5, "text": "que cuentas conmigo siempre." },
      ],
      "maloca": [
        { "val": 1, "text": "¡Hola! Mañana vamos a construir una " },
        { "val": 2, "text": "maloca. No olvides traer contigo buena " },
        { "val": 3, "text": "energía, canciones que alegren el corazón, " },
        { "val": 4, "text": "comida para compartir, y disposición para " },
        { "val": 5, "text": "aprender. Bailaremos y la pasaremos muy bien." }
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

    prepare($event, invitation) {
      const sorted = [1,2,3,4,5];
      let items = this.shufflePipe.transform(this.invitations[invitation].slice(0)); //
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
        w: 1054 * scale,
        h: 700 * scale
      };
      const sw = rect.height; // * 100 / 70;
      let boxes = [];

      let left = sw * (455 / 1920);
      const offset = (sw - rect.width) / 2;
      left -= offset;
      boxes.push(Object.assign({
        l: left,
        t: 340 * scale
      }, tBoxRect));

      this.ngZone.run(() => {
        this.boxStyles = boxes.map((box) => {
          return { 
            'width.px': box.w,
            'height.px': box.h,
            'left.px': box.l,
            'top.px': box.t
          };
        });
      });
    }

    itemsReorder(ev) {
      const auxV = this.items[ev.from].val;
      const auxT = this.items[ev.from].text;
      let i = ev.from;
      let step = ev.from > ev.to ? -1 : 1;
      while(i != ev.to) {
        this.items[i].val = this.items[i+step].val;
        this.items[i].text = this.items[i+step].text;
        ev.items[i].isCorrect = (this.items[i].val == this.itemsSorted[i]);
        i += step;
      }
      this.items[i].val = auxV;
      this.items[i].text = auxT;
      ev.items[i].isCorrect = (auxV == this.itemsSorted[i]);
    }

    onReset() {
      this.itemsSorted = null;
    }
  }
  return L5Ch6Component;
}