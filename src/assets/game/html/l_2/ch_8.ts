import { Component, Type, ViewEncapsulation } from '@angular/core';

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L2Ch7Component {
    private itemsSelected;

    constructor() {
      this.itemsSelected = 0;
    }

    prepare($event) {      
      this.itemsSelected = 0;
    }

    onSelecting($event) {
      $event.cancel = (!$event.selected && this.itemsSelected === 3);
      if (!$event.cancel) {
        this.itemsSelected += ($event.selected ? -1 : 1);
      }
    }
  }
  return L2Ch7Component;
}