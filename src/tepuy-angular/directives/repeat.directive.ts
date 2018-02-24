import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[tepuyRepeat]' })
export class TepuyRepeatDirective {

  constructor( private templateRef: TemplateRef<any>,
             private viewContainer: ViewContainerRef) { }

  @Input('tepuyRepeat') set count(c:number) {
    this.viewContainer.clear();
    const last = c-1;
    for(var i=0;i<c;i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        index: i,
        last: last==i,
        first: i == 0
      });
    }
  }
}
