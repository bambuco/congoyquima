import { Injectable, Renderer2 } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class TepuyDraggableService {

  private dragstart = new Subject();
  private dragmove = new Subject();
  private dragend = new Subject();
  private dropped = new Subject();

  ondragstart = this.dragstart.asObservable();
  ondragmove = this.dragmove.asObservable();
  ondragend = this.dragend.asObservable();
  ondrop = this.dropped.asObservable();


  constructor(private renderer: Renderer2) {

  }

  dragEnd(data) {
    this.dragend.next(data);
  }
  
  dragStart(data) {
    this.dragstart.next(data);
  }
  
  dragMove(data) {
    this.dragmove.next(data);
  }

  drop(data) {
    this.dropped.next(data);
  }

  setTranslate(el, translate) {
    const tprops = 'transform,-webkit-transform,-ms-transform,-moz-transform,-o-transform'.split(',');
    if(translate!=null){
      for(let prop of tprops){
        this.renderer.setStyle(el, prop, translate);
      }
    }
    else {
      for(let prop of tprops){
        this.renderer.removeStyle(el, prop);
      }
    }
  }
}