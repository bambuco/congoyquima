import { Directive, ElementRef,
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
    this.play();
    return true;
  }

  onMouseDown() {
    if (!this.canGreet) return true;
    const time = new Date().getTime();
    if ((time)-this.itemTouchedTime > 2) { //To prevent touch and click firing twice
      this.itemTouchedTime = time;      
      this.play();
    }
    return true;
  }

  private play() {
    let key = null;
    if (this.item) {
      key = this.item.value.toLowerCase();
    }
    else {
      const el = this.elRef.nativeElement;
      key = el.value ? el.value : el.innerText;
    }

    if (key) {
      this.audioPlayer.play(key);
    }
  }

}