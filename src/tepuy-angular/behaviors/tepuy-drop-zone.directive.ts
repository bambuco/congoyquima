import { Directive, Input, ElementRef, HostBinding, AfterViewInit, Renderer2
} from '@angular/core';
import { DomController } from 'ionic-angular';

import { TepuyDraggableService } from '../providers';

@Directive({ 
  selector: '[tepuy-drop-zone]',
  host: {
    '[class.tepuy-droppable]': 'enabled !== false',
    "[class.tepuy-correct]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false"
  }
})
export class TepuyDropZoneDirective implements AfterViewInit {
  //@HostBinding('class.tepuy-droppable') isDroppable: boolean = true;
  @HostBinding('class.tepuy-drop-over') isDropOver: boolean = false;
  //@HostBinding('class.tepuy-droppable')
  @Input("tepuy-drop-zone") enabled: boolean = true;
  @Input("tepuy-correct-values") correctValueList;
  @Input('tepuy-auto-feedback') autoFeedback: boolean = false;

  private correctValues: Array<any> = [];
  private dropTarget:any;
  private valuePresenter:any;
  private subscription: any;
  private succeed: boolean;

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
    if (this.enabled === false) return;
    const el = this.elRef.nativeElement;
    let dropTarget = el.querySelector('.drop-target');
    this.dropTarget = (dropTarget == null ? el : dropTarget);
    this.valuePresenter = el.querySelector('.drop-value');
    if (!this.correctValueList) {
      //Try get values from a dl container
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
  onDragEnd(ev:any) {
    if (this.enabled === false) return;

    const el = this.elRef.nativeElement;
    const dropped = (el == ev.target);
    if (dropped) {
      ev.handled = true;
      //ToDo: Need to account for drop zone allowing multiple elements
      this.dropTarget.appendChild(ev.el);
      this.setValue(ev.item.value);
      this.domCtrl.write(() => {
        this.dragService.setTranslate(ev.el, null);
        this.renderer.setStyle(ev.el, 'left', '0px');
        this.renderer.setStyle(ev.el, 'top', '0px');
        this.renderer.addClass(ev.el, 'tepuy-dropped');
      });
      ev.item.isCorrect = !(this.correctValues.indexOf(ev.item.value) < 0);
      ev.item.answered = true;
      this.subscription = ev.item.resolved.subscribe(() => {
        this.succeed = ev.item.succeed;
      });
      this.checkAutofeedback(ev);      
      this.dragService.drop({
        dropped: dropped,
        target: this
      });
    }
  }

  //Helpers
  setAllowedValues(values){
    if (!Array.isArray(values)) {
      if (typeof(values) == 'number') values = values+'';
      //this.correctValues = [];
      const splitRE = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
      this.correctValues = !values ? [] : (values+'').split(splitRE, -1);
    }
    else {
      this.correctValues = values;
    }
  }
  
  clearValue(item:any) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.setValue('');
  }

  private setValue(value) {
    if (!this.valuePresenter) return;
    if (this.valuePresenter.value) {
      this.valuePresenter.value = value;
    }
    else {
      this.valuePresenter.innerHTML = value;
    }
  }

  private checkAutofeedback(data:any) {
    if (this.autoFeedback) {
      const service = data.item.activityService;
      service.emit(service.ITEM_GROUP_COMPLETING, { 
        succeed: data.item.isCorrect
      }, data.item.group);
    }
  }
}