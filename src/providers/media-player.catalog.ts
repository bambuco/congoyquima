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
    for(let l of [1,2]){
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
    let words = ["arbol", "casa", "canasta", "radio", "cama","baston", "televisor", "carro", "cuchara", "plato",
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
  }

  get audios():Array<any> {
    return this.assets.filter(m => { return m.type == 'audio'; });
  }

}