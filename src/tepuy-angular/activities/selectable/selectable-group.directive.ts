import { Directive, ViewChildren, ContentChildren, QueryList, Input, ElementRef,
  Renderer2, OnInit, AfterViewInit, OnDestroy, AfterContentInit
} from '@angular/core';

import { TepuyActivityService } from '../../activities/activity.provider';
import { TepuySelectableService } from './selectable.provider';
import { TepuyGroupService } from './selectable-group.provider';
import { TepuyErrorProvider, Errors } from '../../providers/error.provider';

import { TepuySelectableItemDirective } from './selectable-item.directive';

@Directive({ 
  selector: '[tepuy-item-group]',
  host: { },
  providers: [ TepuyGroupService ]
})
export class TepuySelectableGroupDirective implements OnInit, AfterViewInit {
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

  @ContentChildren(TepuySelectableItemDirective, { descendants: true}) items: QueryList<TepuySelectableItemDirective>;
 
  private actProvider: TepuySelectableService;

  constructor(private el: ElementRef, private errorProvider: TepuyErrorProvider, private groupProvider: TepuyGroupService, serviceWrapper: TepuyActivityService) 
  { 
    this.actProvider = serviceWrapper as TepuySelectableService;    
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
    if (!options.id) options.id = this.actProvider.newGroupId();
    if (!/^(multiselect|single)$/i.test(options.type)) options.type = 'single';
    if (isNaN(options.size)) options.size = 2; //One correct, One wrong
    if (isNaN(options.correctSize)) options.correctSize = 1;
    
    options.size = parseInt(options.size);
    options.correctSize = parseInt(options.correctSize);

    //Do some verifications
    if (options.size < 2) {
      this.errorProvider.raise(Errors.InvalidGroupSize);      
    }

    this.options = options;
    this.correctOptions = this.actProvider.explodeExpression(options.correctSource);
    this.wrongOptions = this.actProvider.explodeExpression(options.wrongSource);

    this.actProvider.on(this.actProvider.ACTIVITY_RESET).subscribe(() => {
      this.resetItemValues();
    })
  }

  ngAfterContentInit() {
    //select a set of values
    this.resetItemValues();    
    ////Just in case new items are added
    //this.items.changes.subscribe(item => {
      //console.log(item);
    //});
  }

  ngAfterViewInit(){
  }

  private resetItemValues() {
    this.actProvider.shuffle(this.correctOptions);
    this.actProvider.shuffle(this.wrongOptions);
    let values = new Array<any>();
    for(let i = 0; i < this.options.correctSize; i++){
      values.push({value: this.correctOptions[i], correct: true });
    }

    for(let i = this.options.correctSize; i < this.options.size; i++){
      values.push({value: this.wrongOptions[i-this.options.correctSize], correct: false });
    }

    this.actProvider.shuffle(values);
    //Process all items in the query
    this.items.forEach((item, i) => {
      item.correct = values[i].correct;
      item.value = values[i].value;
    });
  }
}