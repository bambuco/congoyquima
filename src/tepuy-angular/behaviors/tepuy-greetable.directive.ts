import { Directive, Input, Output, ElementRef, HostBinding,
  AfterViewInit, EventEmitter, Renderer2, OnDestroy
} from '@angular/core';
import { DomController } from 'ionic-angular';

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

  private touchStartHandler:any;
  private itemTouchedTime: number = 0;
  private canGreet: boolean = false;
  private item: any;

  constructor(
      private elRef: ElementRef,
      private audioPlayer: TepuyAudioPlayerProvider
    ) {
  }
  //Lifecycle events
  ngAfterViewInit() {
    this.touchStartHandler = this.onTouchStart.bind(this);
    this.elRef.nativeElement.addEventListener('touchstart', this.touchStartHandler, { passive: true });
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
  }
  
  onItemResolved(item) {
    this.canGreet = false;
  }


  //Item DOM Event
  onTouchStart() {
    if (!this.canGreet) return true;
    this.itemTouchedTime = new Date().getTime();
    this.audioPlayer.play(this.item.value.toLowerCase());
    return true;
  }

  onMouseDown() {
    if (!this.canGreet) return true;
    const time = new Date().getTime();
    if ((time)-this.itemTouchedTime > 2) { //To prevent touch and click firing twice
      this.itemTouchedTime = time;
      this.audioPlayer.play(this.item.value.toLowerCase());
    }
    return true;
  }

}