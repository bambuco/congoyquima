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
        simple: true
      });
    }

    //Level audios
    for (let level of []) {
      this.assets.push({
        type: 'audio',
        key: 'result-'+level,
        path: path + 'ch_'+level+'.mp3',
        simple: true
      });
    }
  }

  get audios():Array<any> {
    return this.assets.filter(m => { return m.type == 'audio'; });
  }

}