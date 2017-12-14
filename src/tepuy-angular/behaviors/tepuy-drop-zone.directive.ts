import { Directive, Input, ElementRef, HostBinding, AfterViewInit, Renderer2
} from '@angular/core';
import { DomController } from 'ionic-angular';

import { TepuyDraggableService } from '../providers';

@Directive({ 
  selector: '[tepuy-drop-zone]',
  host: {
  }
})
export class TepuyDropZoneDirective implements AfterViewInit {
  @HostBinding('class.tepuy-droppable') isDroppable: boolean = true;
  @HostBinding('class.tepuy-drop-over') isDropOver: boolean = false;
  @Input("tepuy-correct-values") correctValueList;

  private correctValues: Array<any> = [];

  constructor(
      private elRef: ElementRef,
      private dragService: TepuyDraggableService,
      private domCtrl: DomController,
      private renderer: Renderer2
    ) {
    dragService.ondragend.subscribe((data) => { //subscribe to dragend events
      this.onDragEnd(data);
    });
  }

  //Lifecycle events
  ngAfterViewInit() {
    if (!this.correctValueList) {
      //Try get values from a dl container
      const el = this.elRef.nativeElement;
      const valuesContainer = el.querySelector('dl.tepuy-correct-values');
      if (valuesContainer) {
        this.correctValues = valuesContainer.querySelectorAll('dd').map(dd => {
          return dd.innerText;
        });
        //this.corr
        this.correctValues.join(',');
      }
    }
    else {
      this.setAllowedValues(this.correctValueList);
    }
  }

  //Item events
  onDragEnd(data:any) {
    const el = this.elRef.nativeElement;
    const dropped = (el == data.target);
    if (dropped) {
      //ToDo: Need to account for drop zone allowing multiple elements
      el.appendChild(data.el);
      this.domCtrl.write(() => {
        this.dragService.setTranslate(data.el, null);
        this.renderer.setStyle(data.el, 'left', '0px');
        this.renderer.setStyle(data.el, 'top', '0px');
        this.renderer.addClass(data.el, 'tepuy-dropped');
      });
      data.item.isCorrect = !(this.correctValues.indexOf(data.item.value) < 0);
    }
    this.dragService.drop({
      dropped: dropped      
    });
  }

  //Helpers
  setAllowedValues(values){
    if (typeof(values) == 'number') values = values+'';
    //this.correctValues = [];
    const splitRE = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    this.correctValues = !values ? [] : (values+'').split(splitRE, -1);
  }
}