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
    //Challenge completed
    this.assets.push({
      type: 'audio',
      key: 'ch_completed',
      path: path + 'shared/ch_completed.mp3',
      preload: true
    });

    //Challenge intro
    for(let l of [1]){
      for (let ch of [1, 2, 3]) {
        this.assets.push({
          type: 'audio',
          key: ['l_', l, '_ch_', ch, '_intro'].join(''),
          path: path + ['l_', l, '/ch_', ch, '_intro.mp3'].join(''),
          preload: true 
        });
      }
    }
  }

  get audios():Array<any> {
    return this.assets.filter(m => { return m.type == 'audio'; });
  }

}