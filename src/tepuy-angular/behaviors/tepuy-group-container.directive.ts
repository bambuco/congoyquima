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
  @Input() tepuyValueGeneratorInclude: any;
  @Input() tepuyValueGeneratorType: string = 'object';
  @Input() tepuyValueGeneratorData: any;  
  @Input() tepuyValueGeneratorShuffle: boolean = false;  
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

      this.dataProvider = this.activityService.getDataProvider(this.tepuyValueGenerator, this.tepuyValueGeneratorData);

      if (!this.dataProvider) {
        throw new Error('TepuyValueProviderDirective: provider expression resulted in a null provider');      
      }
    }
    
    this.dataProvider.reset();
    this.values = [];
    const isArray = this.tepuyValueGeneratorArray;
    let exclude = [];
    if (this.tepuyValueGeneratorExclude) {
      if (Array.isArray(this.tepuyValueGeneratorExclude)) {
        exclude = this.tepuyValueGeneratorExclude;
      }
      else if (typeof(this.tepuyValueGeneratorExclude) === 'string') {
        exclude = this.tepuyValueGeneratorExclude.split('');
      }
    }
    let include = [];
    if (this.tepuyValueGeneratorInclude) {
      if (Array.isArray(this.tepuyValueGeneratorInclude)) {
        include = this.tepuyValueGeneratorInclude;
      }
      else if (typeof(this.tepuyValueGeneratorInclude) === 'string') {
        include = this.tepuyValueGeneratorInclude.split('');
      }
    }

    if (include.length) {
      this.values = include.slice();
      exclude = exclude.concat(include);
    }
    let val;
    let attempts = 0;
    const maxAttempts = 100;
    for(let i = include.length; i < this.tepuyValueGeneratorCount; i++) {
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
      values: (this.tepuyValueGeneratorShuffle ? this.shuffle(this.values) : this.values)
    });      
  }

  /**
   * Shuffles an array.
   * @a {Array} An array containing the items.
   */
  shuffle(a) {
    if (!a) return;
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
  }
}
