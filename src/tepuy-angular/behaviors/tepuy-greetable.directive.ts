import { Directive, ElementRef, Input,
  AfterViewInit, OnDestroy
} from '@angular/core';

import { TepuyAudioPlayerProvider } from '../providers';

@Directive({ 
  selector: '[tepuy-greetable]',
  host: { 
    "(mousedown)": "onMouseDown()",
    "(tepuyitemready)": "onItemReady($event)",
    "(tepuyitemresolved)": "onItemResolved($event)"
  }
})
export class TepuyGreetableDirective implements AfterViewInit, OnDestroy {
  @Input('tepuy-greetable') valueSelector;
  private touchStartHandler:any;
  private itemTouchedTime: number = 0;
  private canGreet: boolean = false;
  private item: any;
  private audio_key: string;

  constructor(
      private elRef: ElementRef,
      private audioPlayer: TepuyAudioPlayerProvider
    ) {
  }
  //Lifecycle events
  ngAfterViewInit() {
    this.touchStartHandler = this.onTouchStart.bind(this);
    this.elRef.nativeElement.addEventListener('touchstart', this.touchStartHandler, { passive: true });


    if (!this.item) {
      this.canGreet = true;
      let valueEl = this.elRef.nativeElement;
      if (this.valueSelector) {
        valueEl = valueEl.querySelector(this.valueSelector);
      }

      if (valueEl) {
        this.audio_key = valueEl.value ? valueEl.value : valueEl.innerText;
        this.audio_key = this.audio_key.toLowerCase();
      }
    }
    else {
      this.audio_key = this.item.value.toLowerCase();
    }

    if (this.audio_key) {
      this.preload();
    }
  }

  ngOnDestroy() {
    if (this.touchStartHandler) {
      this.elRef.nativeElement.removeEventListener('touchstart', this.touchStartHandler);
    }
  }

  //Item Events
  onItemReady(item) {    
    this.canGreet = true;
    this.item = item;
    this.item.actAsGreetable = true;
    const key = this.item.value.toLowerCase();
    if (key && key != this.audio_key) {
      this.audio_key = key;
      this.preload();
    }
  }
  
  onItemResolved(item) {
    this.canGreet = false;
  }

  //Item DOM Event
  onTouchStart() {
    if (!this.canGreet) return true;
    const disabled = this.elRef.nativeElement.getAttribute('disabled');
    if (disabled && disabled == 'true') return true;
    this.itemTouchedTime = new Date().getTime();
    this.play();
    return true;
  }

  onMouseDown() {
    if (!this.canGreet) return true;
    const disabled = this.elRef.nativeElement.getAttribute('disabled');
    if (disabled && disabled == 'true') return true;
    const time = new Date().getTime();
    if ((time)-this.itemTouchedTime > 2) { //To prevent touch and click firing twice
      this.itemTouchedTime = time;      
      this.play();
    }
    return true;
  }

  private play() {
    let key = this.audio_key;
    if (this.item) {
      key = this.item.value.toLowerCase();
    }

    if (key) {
      this.audioPlayer.play(key);
    }
  }

  private preload() {
    setTimeout(() => {
      this.audioPlayer.preload(this.audio_key);
    });
  }

}