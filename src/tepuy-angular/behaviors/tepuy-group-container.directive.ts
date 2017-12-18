import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges } from '@angular/core';

import { TepuyActivityService, IDataProvider } from '../providers';

@Directive({ selector: '[tepuyValueGenerator]' })
export class TepuyValueGeneratorDirective implements OnChanges {

  constructor( private templateRef: TemplateRef<any>,
             private viewContainer: ViewContainerRef,
             private activityService: TepuyActivityService) { 
  }

  @Input() tepuyValueGenerator: string;
  @Input() tepuyValueGeneratorCount: number = 1;
  
  private dataProvider:IDataProvider = null;

  values:any[];

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.viewContainer.clear();
    if (!this.dataProvider) {
      if (!this.tepuyValueGenerator) return; //No expression provided

      if (isNaN(this.tepuyValueGeneratorCount)) return; //No limit for the value provider

      this.dataProvider = this.activityService.getDataProvider(this.tepuyValueGenerator);

      if (!this.dataProvider) {
        throw new Error('TepuyValueProviderDirective: provider expression resulted in a null provider');      
      }
    }
    
    this.dataProvider.reset();
    this.values = [];
    for(let i = 0; i < this.tepuyValueGeneratorCount; i++) {
      this.values.push({id: i, data: this.dataProvider.next() });
    }

    this.viewContainer.createEmbeddedView(this.templateRef, {
      values: this.values
    });      
  }
}
