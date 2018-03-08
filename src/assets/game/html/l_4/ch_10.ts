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
    lBoxStyle:any;
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
          ["_PH", " Lina."], 
          ["El", " próximo", "_PH", " celebraré", " mi", "_PH", " y", " me", " gustaría", " invitarte", " a", " una", "_PH", " que", " estoy", " planeando.", " Espero", " que", "_PH", " asistir."],
          ["¡Te", " estaré", "_PH!"]
        ]
      },
      "business": {
        "options": ["profesor", "febrero", "realizaremos", "reunión", "basuras", "obligatoria"],
        "wording": [
          ["Estimado", "_PH", ":"],
          ["El", " miércoles", " 7", " de", "_PH,", " a las", " 10:00 a.m.,", "_PH", " una", "_PH", " para", " hablar", " del", " problema", " con", " la", " recolección", " de", "_PH."],
          ["La", " asistencia", " es", "_PH."],
          ["Saludos."]
        ]
      },
      "reunion": {
        "options": ["Hola", "planeando", "colegio", "semana", "asistir", "día"],
        "wording": [
          ["¡", "_PH", " Camilo!"],
          ["Estamos", "_PH", " hacer", " un", " reencuentro", " con", " los", " compañeros", " del", "_PH", " para", " la", " próxima", "_PH."],
          ["¿Te", " gustaría", "_PH?", " ¿Qué", "_PH", " te", " queda", " fácil?"]
        ]
      },
      "vaccination": {
        "options": ["de", "hospital", "vereda", "vacunación", "sábado", "esperamos"],
        "wording": [
          ["¡Información", "_PH", " interés!"],
          ["El", "_PH", " invita", " a todos", " los", " habitantes", " de", " la", "_PH", " a la", " gran", " jornada", " de", "_PH", " que", " se", " realizará", " el", "_PH", " 10", " de", " marzo", " a", " partir", " de las", " 8:00 a.m."],
          ["¡Los", "_PH!"]
        ]
      },
      "wedding": {
        "options": ["queremos", "importante", "ceremonia", "Junio", "iglesia", "almuerzo"],
        "wording": [
          ["¡Nos", " casaremos!", " Y", "_PH", " pasar", " ese", " día", " tan", "_PH", " contigo."],
          ["La", "_PH", " será", " el", " día", " 9", " de", "_PH", " a", " las", " 10:00 am", " en", " la", "_PH", " del", " pueblo", " y", " después", " compartiremos", " un", "_PH", " en", " la", " casa", " de", " mis", " padres."],
          ["¡Te", " esperamos!"]
        ]
      },
      "game": {
        "options": ["Gran", "fútbol", "febrero", "cancha", "Asiste", "equipo"],
        "wording": [
          ["¡", "_PH", " final", " del", " campeonato", " veredal", " de", "_PH!"],
          ["Fecha:", " viernes", " 23 de", "_PH."],
          ["Hora:", " 9:00 a.m."],
          [" Lugar:", "_PH", " de", " la", " vereda", " San", " Joaquín."],
          ["¡", "_PH", " y", " anima", " a", " tu", "_PH", " favorito!"] 
        ]
      },
      "fitness": {
        "options": ["bicicleta", "temprano", "Aprovechemos", "está", "salir", "abrazo"],
        "wording": [
          ["¡Hola,", " Alejandra!", " ¿Vamos", " mañana", " a", " montar", " en", "_PH", "?"],
          ["Si", " te", " animas,", " paso", " por", " ti", "_PH", " en", " la", " mañana."],
          ["¡", "_PH", " que", " el", " clima", "_PH", " muy", " bueno", " para", "_PH!"],
          ["Un", "_PH."]
        ]
      },
      "dancing": {
        "options": ["aprender", "cantar", "tarde", "hay", "talleres", "casa"],
        "wording": [
          ["¿Te", " gustaría", "_PH", " a", " bailar,", "_PH", ",", " o", " actuar?", " ¡Nunca", " es", "_PH", " para", " descubrir", " el", " artista", " que", "_PH", " en", " ti!", " Pregunta", " por", " los", "_PH", " gratuitos", " que", " tenemos", " en", " la", "_PH", " de", " la", " cultura."]
        ]
      },
      "meeting": {
        "options": ["La", "vereda", "reunión", "discutirá", "acueducto", "faltes"],
        "wording": [
          ["_PH", " Junta", " de", " Acción", " Comunal", " de", " la", "_PH", " La", " Clarita", " te", " invita", " a", " la", " primera", "_PH", " del", " año,", " donde", " se", "_PH", " sobre", " el", " manejo", " del", "_PH.", " ¡Es", " muy", " importante", " tu", " opinión!", " ¡No", "_PH!"]
        ]
      },
      "dating": {
        "options": ["Hola", "días", "faltado", "bien", "comer", "siempre"],
        "wording": [
          ["¡", "_PH", ", Santiago!", " En", " los", " últimos", "_PH", " te", " he", " notado", " aburrido", " y", " supe", " que", " has", "_PH", " a", " clases.", " ¿Estás", "_PH?", " ¿Te", " gustaría", " que", " saliéramos", " a", "_PH", " un", " helado?"],
          ["Recuerda", " que", " cuentas", " conmigo", "_PH."]
        ]
      },
      "maloca": {
        "options": ["construir", "olvides", "energía", "corazón", "para", "muy"],
        "wording": [
          ["¡Hola!", " Mañana", " vamos", " a", "_PH", " una", " maloca.", " No", "_PH", " traer", " contigo", " buena", "_PH,", " canciones", " que", " alegren", " el", "_PH,", " comida", " para", " compartir,", " y", " disposición", "_PH", " aprender.", " Bailaremos", " y", " la", " pasaremos", "_PH", " bien."]
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
          if (/^_PH[\s\.,!¡?¿]*$/.test(text)) {
            word.value = options[o++].val;
            word.text = '';
            word.extra = text.replace('_PH', '');
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
        w: 780 * scale,
        h: 690 * scale,
        t: 285 * scale,
      };
      const sw = rect.height;
      let left = sw * (704 / 1920);
      let offset = (sw - rect.width) / 2;
      left -= offset;
      tBoxRect.l = left;
      const rows = 11;
      const lBox = {
        l: sw * (1002 / 1920) - offset, //484
        t: 1110 * scale //124
      };

      this.ngZone.run(() => {
        this.tBoxStyle = { 
          'width.px': tBoxRect.w,
          'height.px': tBoxRect.h,
          'left.px': tBoxRect.l,
          'top.px': tBoxRect.t,
          'fontSize.px': (tBoxRect.h / rows * .9),
          'lineHeight.px': tBoxRect.h / (rows - 1)
        };
        this.phStyle = {
          'width.px': 383 * scale,
          'height.px': tBoxRect.h / rows,
        };
        this.lBoxStyle = {
          'left.px': lBox.l,
          'top.px': lBox.t
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
      //Clear previous selection
      if (it.selectedOption) {
        it.selectedOption.used = false;
        it.text = '';
        it.item.isCorrect = false;
        it.item.answered = false;
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
      it.item.answered = true;
      it.item.value = opt.val;
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