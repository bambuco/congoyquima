import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { TepuyAudioPlayerProvider } from '../../../../tepuy-angular/providers/audio-player.provider';

import { ShufflePipe } from 'ngx-pipes';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L4Ch10Component {
    tBoxStyle:any;
    phStyle:any;
    options: any[];
    items: any[];
    tag: string;
    ready: boolean;
    enabled: boolean;
    showSelector: boolean;
    activeItem: any;
    private shuffle:ShufflePipe;

    private invitations:any = {
      "birthday": {
        "options": ["Querida", "viernes", "cumpleaños", "comida", "puedas", "esperando"],
        "wording":  [
          ["", " Lina."], 
          ["El", " próximo", "", " celebraré", " mi", "", " y", " me", " gustaría", " invitarte", " a", " una", "", " que", " estoy", " planeando.", " Espero", " que", "", " asistir."],
          ["¡Te", " estaré", "", "!"]
        ]
      },
      "business": {
        "options": ["profesor", "febrero", "realizaremos", "reunión", "basuras", "obligatoria"],
        "wording": [
          ["Estimado", "", ":"],
          ["El", " miércoles", " 7", " de", "", ", a las", " 10:00 a.m.,", "", " una", "", " para", " hablar", " del", " problema", " con la", " recolección", " de", "", "."],
          ["La", " asistencia", " es", "", "."],
          ["Saludos."]
        ]
      },
      "reunion": {
        "options": ["Hola", "planeando", "colegio", "semana", "asistir", "día"],
        "wording": [
          ["¡", "", " Camilo!"],
          ["Estamos", "", " hacer", " un", " reencuentro", " con", " los", " compañeros", " del", "", " para", " la", " próxima", "", "."],
          ["¿Te", " gustaría", "", "?", " ¿Qué", "", " te", " queda", " fácil?"]
        ]
      },
      "vaccination": {
        "options": ["de", "hospital", "vereda", "vacunación", "sábado", "esperamos"],
        "wording": [
          ["¡Información", "", " interés!"],
          ["El", "", " invita", " a todos", " los", " habitantes", " de la", "", " a la", " gran", " jornada", " de", "", " que", " se", " realizará", " el", "", " 10", " de", " marzo", " a", " partir", " de las", " 8:00 a.m."],
          ["¡Los", "", "!"]
        ]
      },
      "wedding": {
        "options": ["queremos", "importante", "ceremonia", "Junio", "iglesia", "almuerzo"],
        "wording": [
          ["¡Nos", " casaremos!", " Y", "", " pasar", " ese", " día", " tan", "", " contigo."],
          ["La", "", " será", " el", " día", " 9 de", "", " a las", " 10:00 am", " en la", "", " del", " pueblo", " y", " después", " compartiremos", " un", "", " en", " la", " casa", " de", " mis", " padres."],
          ["¡Te", " esperamos!"]
        ]
      },
      "game": {
        "options": ["Gran", "fútbol", "febrero", "cancha", "Asiste", "equipo"],
        "wording": [
          ["¡", "", " final", " del", " campeonato", " veredal", " de", "", "!"],
          ["Fecha:", " viernes", " 23 de", "", "."],
          ["Hora:", " 9:00 a.m."],
          [" Lugar:", "", " de", " la", " vereda", " San", " Joaquín."],
          ["¡", "", " y", " anima", " a", " tu", "", " favorito!"] 
        ]
      },
      "fitness": {
        "options": ["bicicleta", "temprano", "Aprovechemos", "está", "salir", "abrazo"],
        "wording": [
          ["¡Hola,", " Alejandra!", " ¿Vamos", " mañana", " a", " montar", " en", "", "?"],
          ["Si", " te", " animas,", " paso", " por", " ti", "", " en", " la", " mañana."],
          ["¡", "", " que", " el", " clima", "", " muy", " bueno", " para", "", "!"],
          ["Un", "", "."]
        ]
      },
      "dancing": {
        "options": ["aprender", "cantar", "tarde", "hay", "talleres", "casa"],
        "wording": [
          ["¿Te", " gustaría", "", " a", " bailar,", "", ",", " o", " actuar?", " ¡Nunca", " es", "", " para", " descubrir", " el", " artista", " que", "", " en", " ti!", " Pregunta", " por", " los", "", " gratuitos", " que", " tenemos", " en", " la", "", " de", " la", " cultura."]
        ]
      },
      "meeting": {
        "options": ["La", "vereda", "reunión", "discutirá", "acueducto", "faltes"],
        "wording": [
          ["", " Junta", " de", " Acción", " Comunal", " de", " la", "", " La", " Clarita", " te", " invita", " a", " la", " primera", "", " del", " año,", " donde", " se", "", " sobre", " el", " manejo", " del", "", ". ¡Es", " muy", " importante", " tu", " opinión!", " ¡No", "", "!"]
        ]
      },
      "dating": {
        "options": ["Hola", "días", "faltado", "bien", "comer", "siempre"],
        "wording": [
          ["¡", "", ", Santiago!", " En", " los", " últimos", "", " te", " he", " notado", " aburrido", " y", " supe", " que", " has", "", " a", " clases.", " ¿Estás", "", "?", " ¿Te", " gustaría", " que", " saliéramos", " a", "", " un", " helado?"],
          ["Recuerda", " que", " cuentas", " conmigo", "", "."]
        ]
      },
      "maloca": {
        "options": ["construir", "olvides", "energía", "corazón", "para", "muy"],
        "wording": [
          ["¡Hola!", " Mañana", " vamos", " a", "", " una", " maloca.", " No", "", " traer", " contigo", " buena", "", ", canciones", " que", " alegren", " el", "", ", comida", " para", " compartir,", " y", " disposición", "", " aprender.", " Bailaremos", " y", " la", " pasaremos", "", " bien."]
        ]
      }
    };

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private audioPlayer: TepuyAudioPlayerProvider,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, invite) {

      let oInvite = this.invitations[invite];
      let options = oInvite.options.map((opt) => { return { used: false, val: opt }; });
      let items = [];
      let o = 0;
      let idx = 0;

      for(let i = 0, iLen = oInvite.wording.length; i < iLen; i++) {
        let it:any = { words: [] };
        items.push(it);
        for(let k = 0, kLen = oInvite.wording[i].length; k < kLen; k++) {
          let text:string = oInvite.wording[i][k];
          let word:any = { text: text, index: idx++ };
          if (!text) {
            word.value = options[o++].val;
          }
          it.words.push(word);
        }
      }
      
      options = this.shuffle.transform(options);

      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          this.tag = invite;
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
        w: 800 * scale,
        h: 796 * scale
      };
      const sw = rect.height;
      let left = sw * (684 / 1920);
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
      this.audioPlayer.stopAll();
      if (!this.enabled || !it.value) {
          return
      }
      //assign the item if not assigned yet
      if (!it.item) {
        let el = ev.target.querySelector('input');
        it.item = el.$tepuyItem;
      }
      it.active = true;
      this.activeItem = it;
      //this.options = cell.options.slice(0);
      this.showSelector = true;
    }

    onSelect(opt) {
      let it = this.activeItem;
      it.text = opt.val;
      it.active = false;
      it.item.isCorrect = (opt.val == it.value);
      if (it.selectedOption) {
        it.selectedOption.used = false;
      }
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
  return L4Ch10Component;
}