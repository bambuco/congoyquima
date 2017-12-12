import { Directive, Input, ContentChildren, ElementRef, HostBinding, QueryList,
  OnInit, AfterContentInit, OnDestroy
} from '@angular/core';

import { TepuySelectableItemDirective } from '../activities/selectable/selectable-item.directive';

@Directive({ 
  selector: '[tepuy-drop-target]',
  host: { 
  }
})
export class TepuyDropTargetDirective implements AfterContentInit {
  @Input("tepuy-allow-multiple") allowMultiple: boolean = false;
  @HostBinding("attr.tepuy-correct-value")
  @Input("tepuy-correct-value") correctValue: string;
  @HostBinding('class.tepuy-droppable') isDroppable: boolean = true;
  @ContentChildren(TepuySelectableItemDirective) items: QueryList<TepuySelectableItemDirective>;


  constructor() {    
  }

  ngAfterContentInit() {
  }

}