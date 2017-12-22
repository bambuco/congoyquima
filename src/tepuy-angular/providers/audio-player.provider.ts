import { Injectable } from '@angular/core';

//import { Subject } from 'rxjs/Subject';

@Injectable()
export class TepuyAudioPlayerProvider {

  private sounds: any = {};
  private playlist: Array<string> = [];
  private currentPlayer:any; // = new Audio();

  constructor() {
  }

  register(key:string, path:string, preload=false) {
    this.sounds[key] = { path: path }
    if (preload){
      this.preload(key);
    }
  }

  /**
   * Preload an audio file and add it to the cache.
   * @key {string} Key of the audio to play
   * @path {string} Path to the audio file
   */  
  preload(key:string) {
    const sound = this.sounds[key];
    if (!sound) {
      console.log('Audio not found: ' + key);
      return;
    }

    if (sound.ready) return; //If already preloaded, just return

    let player = new Audio();
    player.addEventListener('canplaythrough', (ev) => {
      this.sounds[key].ready = true;
    }, false);
    player.addEventListener('ended', this.onPlayEnd.bind(this), false);
    player.src = sound.path;
    sound.player = player;    
  }

  /**
   * Play an audio by key from the cache.
   * @key {string} Key of the audio to play
   */  
  preloadAll(sounds:Array<{key:string, path:string}>) {
    for(let sound of sounds) {
      this.preload(sound.key);
    }
  }

  stopAll() {
    if (!this.currentPlayer || this.currentPlayer.paused) return;
    this.playlist = [];
    this.currentPlayer.pause();
    this.currentPlayer.currentTime = 0;
  }

  /**
   * Play an audio by key from the cache.
   * @key {string} Key of the audio to play
   */  
  play(key:string, append:boolean = false) {
    const sound = this.sounds[key];
    if (!sound) {
      console.log('Audio not found: ' + key);
      return;
    }
    
    if (append) {
      this.playlist.push(key);
      this.startPlaylist();
    }
    else {
      this.playlist = [ key ];
      if (this.currentPlayer && !this.currentPlayer.paused) {
        this.currentPlayer.pause();
        this.currentPlayer.currentTime = 0;
      }
      this.startPlaylist();
    }
  }

  private startPlaylist() {
    if (this.currentPlayer && !this.currentPlayer.paused) return;
    const sound = this.playlist.splice(0, 1)[0];
    if (!this.currentPlayer) {
      this.currentPlayer = new Audio();
      this.currentPlayer.addEventListener('ended', this.onPlayEnd.bind(this), false);
    }
    //this.currentPlayer = this.sounds[sound].player;
    this.currentPlayer.src = this.sounds[sound].path;
    this.currentPlayer.play();
  }


  private onPlayEnd() {
    if (this.playlist.length){
      this.startPlaylist();
    }
  }
}