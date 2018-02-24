export class MediaCatalog {
  assets: Array<any>;

  constructor() {
    this.assets = [];
    //Numbers
    const path = "assets/game/aud/";
    for(let i = 0; i < 100; i++) {
      this.assets.push({
        type: 'audio',
        key: ''+i,
        path: path + 'numbers/'+i+'.mp3',
        simple: true
      });
    }
    //Letters
    for(let i of 'abcdefghijkLmnñopqrstuvwxyz'.split('')) {
      this.assets.push({
        type: 'audio',
        key: i.toLowerCase(),
        path: path + 'letters/'+i+'.mp3',
        simple: true
      });
    }
    //Add feedbacks
    for(let type of ['wrong', 'good', 'perfect']) {
      this.assets.push({
        type: 'audio',
        key: 'result-'+type,
        path: path + 'shared/ch_r_'+type+'.mp3',
        preload: true
      });
    }
    //Challenge completed
    this.assets.push({
      type: 'audio',
      key: 'ch_completed',
      path: path + 'shared/ch_completed.mp3',
      preload: true
    });

    //Challenge intro
    for(let l of [1,2,3,4]){
      for (let ch = 1; ch < 11; ch++) {
        this.assets.push({
          type: 'audio',
          key: ['l_', l, '_ch_', ch, '_intro'].join(''),
          path: path + ['l_', l, '/ch_', ch, '_intro.mp3'].join(''),
          preload: true
        });
      }
    }

    //Words
    const words = ["arbol", "casa", "canasta", "radio", "cama","baston", "televisor", "carro", "cuchara", "plato",
      "vaso", "vaca", "perro", "gato","caballo", "sombrero", "zapato", "camisa", "pantalon", "reloj",
      "mesa", "silla", "moneda","billete", "llave", "lapiz", "libro", "manzana", "banano", "pera",
      "zanahoria", "tomate","telefono", "vela", "cuchillo", "tenedor", "olla", "motocicleta","bicicleta",
      "bus", "computador", "escoba", "cepillo", "gafas", "balon", "bombillo",
      "puerta", "ventana", "ventilador", "pastillas", "cuaderno","tijeras", "caja", "frasco", "botella",
      "vestido", "flor", "sol", "luna", "estufa", "sombrilla"
    ];
    for (let word of words) {
      this.assets.push({
        type: 'audio',
        key: word,
        path: path + ['words/', word, '.mp3'].join(''),
        preload: true
      });
    }

    //Level 2 - Challenge 3 directions
    const directions = ["r_gr","r_ye","r_fu","l_bk","r_bk","l_qu","r_qu","l_wh","r_wh","l_re","l_bl","l_vi","b_gr","a_ye","b_ye","a_fu","b_bk","a_qu","b_qu","a_wh","b_re","a_bl","b_bl","a_vi"];
    for(let dir of directions) {
      this.assets.push({
        type: 'audio',
        key: dir,
        path: path + ['l_2/ch_3/', dir, '.mp3'].join(''),
        preload: true
      });
    }
    //Level 2 - Challenge 4 questions
    const questions = ["picnic_in","picnic_out","room_in","room_out","house_in","house_out"];
    for(let q of questions) {
      this.assets.push({
        type: 'audio',
        key: q,
        path: path + ['l_2/ch_4/', q, '.mp3'].join(''),
        preload: true
      });
    }
    //Level 2 - Challenge 7 Fragments
    const fragments = ['fr_1','fr_2','fr_3','fr_4','fr_5','fr_6'];
    for(let frg of fragments) {
      this.assets.push({
        type: 'audio',
        key: frg,
        path: path + ['l_2/ch_7/', frg, '.mp3'].join(''),
        preload: true
      });
    }

    //Level 4 - Challenge 7 Phrases
    const l4ch7_phrases = ["aprender", "importante", "bailar", "seca", "lavar", "caliente", "jugar", "grande", "caminar", "olvidar", "frio", "dormir", "liso", "mejorar", "joven", "ganar", "grueso", "canta", "dulce", "necesita"];
    for(let phr of l4ch7_phrases) {
      this.assets.push({
        type: 'audio',
        key: 'l4ch7_'+phr,
        path: path + ['l_4/ch_7/fra_', phr, '.mp3'].join(''),
        preload: false
      });
    }
    const l4ch8_phrases = ["fria", "fea", "triste", "silenciosa", "valiente", "alto", "facil", "apagadas", "caerse", "luz", "morir", "verdad", "liquido", "meter", "faltar", "lejos", "construir", "blando", "preocupado", "limpio"];
    for(let phr of l4ch8_phrases) {
      this.assets.push({
        type: 'audio',
        key: 'l4ch8_'+phr,
        path: path + ['l_4/ch_8/fra_', phr, '.mp3'].join(''),
        preload: false
      });
    }
    const l4ch10_invites = ["birthday", "business", "reunion", "vaccination", "wedding", "game", "fitness", "dancing", "meeting", "dating", "maloca"];
    for(let inv of l4ch10_invites) {
      this.assets.push({
        type: 'audio',
        key: 'l4ch10_'+inv,
        path: path + ['l_4/ch_10/', inv, '.mp3'].join(''),
        preload: false
      });
    }

    const signals = ["gas_inflamable", "hospedaje", "montallantas", "museo", "obra_en_la_via", "paradero_de_bus", "pare", "peligro_de_caida", "peligro_de_intoxicacion", "personas_con_discapacidad", "primeros_auxilios", "prohibido_fumar", "prohibido_parquear", "punto_de_informacion", "restaurante", "riesgo_electrico", "servicio_de_telefono", "taxis", "wifi", "zona_escolar", "ciclovia", "cruce_peatonal", "discapacitados", "baños", "estacion_de_gasolina"];
    for (let signal of signals) {
      this.assets.push({
        type: 'audio',
        key: signal,
        path: path + ['signals/', signal, '.mp3'].join(''),
        preload: true
      });
    }
    //Miscellaneous
    const miscellaneous = ["por"];
    for (let misc of miscellaneous) {
      this.assets.push({
        type: 'audio',
        key: misc,
        path: path + ['misc/', misc, '.mp3'].join(''),
        preload: true
      });
    }
  }

  get audios():Array<any> {
    return this.assets.filter(m => { return m.type == 'audio'; });
  }

}