import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[tepuyGroupContainer]' })
export class TepuyGroupContainerDirective {

  constructor( private templateRef: TemplateRef<any>,
             private viewContainer: ViewContainerRef) { }

  @Input('tepuyGroupContainer') set groupValue(v:any) {
    this.viewContainer.clear();
    if (v!=null) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        groupValue: v
      });      
    }
  }
}
