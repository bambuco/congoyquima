import { Directive, Input, ContentChildren, ElementRef, HostBinding, QueryList,
  Renderer2, OnInit, AfterViewInit, AfterContentInit, OnDestroy
} from '@angular/core';

import { TepuySelectableItemDirective } from '../activities/selectable/selectable-item.directive';

@Directive({ 
  selector: '[tepuy-drop-target]',
  host: { 
    "(dragenter)": "onDragEnter($event)"    
  }
})
export class TepuyDropTargetDirective implements AfterContentInit {
  @Input("tepuy-allow-multiple") allowMultiple: boolean = false;
  @HostBinding("attr.tepuy-correct-value")
  @Input("tepuy-correct-value") correctValue: string;
  @HostBinding('class.tepuy-droppable') isDroppable: boolean = true;
  @ContentChildren(TepuySelectableItemDirective) items: QueryList<TepuySelectableItemDirective>;


  constructor(private el: ElementRef) {    
  }

  onDragEnter($event) {
  }

  ngAfterContentInit() {
    this.items.changes.subscribe(data => {
    });
  }

}