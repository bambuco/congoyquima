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
  @Input() tepuyValueGeneratorArray: boolean = false;
  @Input() tepuyValueGeneratorExclude: any;
  @Input() tepuyValueGeneratorType: string = 'object';
  
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
    const isArray = this.tepuyValueGeneratorArray;
    let exclude = [];
    if (this.tepuyValueGeneratorExclude && Array.isArray(this.tepuyValueGeneratorExclude)) {
      exclude = this.tepuyValueGeneratorExclude;
    }
    let val;
    let attempts = 0;
    const maxAttempts = 100;
    for(let i = 0; i < this.tepuyValueGeneratorCount; i++) {
      do {
        val = (this.tepuyValueGeneratorType == 'scalar') ?
          (isArray ? this.dataProvider.nextGroup() : this.dataProvider.next()) :
          {id: i, data: (isArray ? this.dataProvider.nextGroup() : this.dataProvider.next()) };
      } while(exclude.indexOf(val) >= 0 && (attempts++) < maxAttempts)
      if (attempts == maxAttempts) {
        throw new Error('Unable to generate value not in the exclude array');
      }
      this.values.push(val);
    }

    this.viewContainer.createEmbeddedView(this.templateRef, {
      values: this.values
    });      
  }
}
