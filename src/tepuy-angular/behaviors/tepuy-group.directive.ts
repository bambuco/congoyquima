import { Directive, ViewChildren, ContentChildren, QueryList, Input, ElementRef,
  Renderer2, OnInit, AfterViewInit, OnDestroy, AfterContentInit
} from '@angular/core';

import { 
  TepuyActivityService, TepuyDraggableService,
  DataProviderFactory, IDataProvider,
  TepuyErrorProvider, Errors 
} from '../providers';

import { TepuyItemDirective } from './tepuy-item.directive';
import { TepuyDropZoneDirective } from './tepuy-drop-zone.directive';

@Directive({ 
  selector: '[tepuy-item-group]',
  host: { },
  providers: [ TepuyDraggableService ]
})
export class TepuyGroupDirective implements OnInit, AfterViewInit {
  @Input('tepuy-item-group') options: any;
  @Input('tepuy-group-id') id: string;
  @Input('tepuy-group-type') type: string;
  @Input('tepuy-options-size') size: number;
  @Input('tepuy-correct-size') correctSize: number;
  @Input('tepuy-correct-options') correctSource: any;
  @Input('tepuy-wrong-options') wrongSource: any;

  private correctOptions: Array<string>;
  private wrongOptions: Array<string>;
  valueSource: Array<any>;
  isCorrect: boolean;
  correctDataProvider: IDataProvider;
  wrongDataProvider: IDataProvider;

  @ContentChildren(TepuyItemDirective, { descendants: true}) items: QueryList<TepuyItemDirective>;
  @ContentChildren(TepuyDropZoneDirective, { descendants: true}) targets: QueryList<TepuyDropZoneDirective>;
 
  //private actProvider: TepuySelectableService;
  groupValue:any;

  constructor(
    private el: ElementRef,
    private errorProvider: TepuyErrorProvider,
    //private groupProvider: TepuyGroupService,
    private actProvider: TepuyActivityService) 
  { 
  }

  ngOnInit() {
    //Get options, it must be an object
    let options = (this.options && typeof(this.options) == 'object') ? this.options : {};
    //Override options with attribute options
    if (this.id) options.id = this.id;
    if (this.type) options.type = this.type;
    if (this.size) options.size = this.size;
    if (this.correctSize) options.correctSize = this.correctSize;
    if (this.correctSource) options.correctSource = this.correctSource;
    if (this.wrongSource) options.wrongSource = this.wrongSource;

    //Set default values if required
    if (!options.id) options.id = this.actProvider.groupId();
    //if (!/^(multiselect|single)$/i.test(options.type)) options.type = 'single';
    if (isNaN(options.size)) options.size = 2; //One correct, One wrong
    if (isNaN(options.correctSize)) options.correctSize = 1;
    
    options.size = parseInt(options.size);
    options.correctSize = parseInt(options.correctSize);

    //Do some verifications
    if (options.size < 2) {
      this.errorProvider.raise(Errors.InvalidGroupSize);      
    }

    this.options = options;
    if (options.correctSource) {
      this.correctDataProvider = this.actProvider.getDataProvider(options.correctSource);
    }

    if (options.wrongSource) {
      this.wrongDataProvider = this.actProvider.getDataProvider(options.wrongSource);
    }
    //this.correctOptions = this.actProvider.explodeExpression(options.correctSource);
    //this.wrongOptions = this.actProvider.explodeExpression(options.wrongSource);

    this.actProvider.on(this.actProvider.ACTIVITY_RESET).subscribe(() => {
      this.resetItemValues();
    });
  }

  ngAfterContentInit() {
    //select a set of values
    this.resetItemValues();    
  }

  ngAfterViewInit(){
  }

  private resetItemValues() {
    
    if (!this.correctDataProvider) return;

    this.correctDataProvider.reset();
    if (this.wrongDataProvider){
      this.wrongDataProvider.reset();
    }

    let values = new Array<any>();
    for(let i = 0; i < this.options.correctSize; i++){
      values.push({value: this.correctDataProvider.next(), correct: true });
    }

    for(let i = this.options.correctSize; i < this.options.size; i++){
      values.push({value: this.wrongDataProvider.next(), correct: false });
    }

    const shuffled = values.slice();
    this.actProvider.shuffle(shuffled);
    
    //Process all items in the query
    this.items.forEach((item, i) => {
      item.correct = shuffled[i].correct;
      item.value = shuffled[i].value;
    });

    ////ToDo: Targes can accept multiple values, this will only satisfy one to one droppables
    if (this.targets.length > 0) {
      this.targets.forEach((item, i) => {
        setTimeout(() => {
          item.setAllowedValues(values[i].value);
        });
      })
    }

  }
}