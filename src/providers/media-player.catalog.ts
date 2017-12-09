export class MediaCatalog {
  assets: Array<any>;

  constructor() {
    this.assets = [];

    const path = "assets/game/aud/";
    for(let i = 0; i < 100; i++) {
      this.assets.push({
        type: 'audio',
        key: ''+i,
        path: path + 'numbers/'+i+'.mp3',
        simple: true
      });
    }
    //Add feedbacks
    for(let type of ['wrong', 'good', 'great']) {
      this.assets.push({
        type: 'audio',
        key: 'result-'+type,
        path: path + 'ch_'+type+'.mp3',
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
    return this.assets.filter(m => { console.log(m); return m.type == 'audio'; });
  }

}