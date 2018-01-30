import { Directive, ContentChildren, QueryList, Input, Output, HostBinding,
  OnInit, AfterContentInit, OnDestroy, EventEmitter, NgZone, ElementRef
} from '@angular/core';

import { 
  TepuyActivityService, TepuyDraggableService,
  IDataProvider,
  TepuyErrorProvider, Errors 
} from '../providers';

import { TepuyItemDirective } from './tepuy-item.directive';
import { TepuyDropZoneDirective } from './tepuy-drop-zone.directive';

@Directive({ 
  selector: '[tepuy-item-group]',
  host: { },
  providers: [ TepuyDraggableService ]
})
export class TepuyGroupDirective implements OnInit, AfterContentInit, OnDestroy {
  @HostBinding("class.tepuy-group-completed") isComplete: boolean = false;
  @Input('tepuy-item-group') options: any;
  @Input('tepuy-group-id') id: string;
  @Input('tepuy-allow-multiple') multiple: boolean = false;
  @Input('tepuy-options-size') size: number;
  @Input('tepuy-correct-size') correctSize: number;
  @Input('tepuy-correct-options') correctSource: any;
  @Input('tepuy-wrong-options') wrongSource: any;
  @Input('tepuy-autocomplete-after') autocompleteAfter: number = 1;
  
  @Output('groupInit') groupinit = new EventEmitter();

  valueSource: Array<any>;
  isCorrect: boolean;
  correctDataProvider: IDataProvider;
  wrongDataProvider: IDataProvider;

  @ContentChildren(TepuyItemDirective, { descendants: true}) items: QueryList<TepuyItemDirective>;
  @ContentChildren(TepuyDropZoneDirective, { descendants: true}) targets: QueryList<TepuyDropZoneDirective>;
 
  //private actProvider: TepuySelectableService;
  groupValue:any;

  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    private errorProvider: TepuyErrorProvider,
    //private groupProvider: TepuyGroupService,
    private actProvider: TepuyActivityService) 
  { 
  }

  ngOnDestroy() {
    this.actProvider.unregisterEvent(this.actProvider.ITEM_GROUP_COMPLETING, this.id);
  }

  ngOnInit() {
    this.actProvider.registerEvent(this.actProvider.ITEM_GROUP_COMPLETING, this.id);
    //Get options, it must be an object
    let options = (this.options && typeof(this.options) == 'object') ? this.options : {};
    //Override options with attribute options
    if (this.id) options.id = this.id;
    if (this.size) options.size = this.size;
    if (this.correctSize) options.correctSize = this.correctSize;
    if (this.correctSource) options.correctSource = this.correctSource;
    if (this.wrongSource) options.wrongSource = this.wrongSource;

    if (this.multiple === true) options.multiple = true;
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

    this.actProvider.on(this.actProvider.ACTIVITY_VERIFIED).subscribe(() => {
      this.isComplete = true;
    });
    
    this.actProvider.on(this.actProvider.ACTIVITY_RESET).subscribe(() => {
      this.resetItemValues();
    });

    this.actProvider.on(this.actProvider.ITEM_GROUP_COMPLETING, this.id).subscribe((result) => {
      this.onGroupCompleting(result);      
    });
  }

  ngAfterContentInit() {
    //Set group ids for the items
    this.items.forEach((item) => {
      item.group = this.id;
    });        
    //select a set of values
    this.resetItemValues();
    this.groupinit.emit({ zone: this.zone, elRef: this.elRef });
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

  private onGroupCompleting(result) {
    //Need to make sure it will count only as one if the markable does not accept multiple selection.
    const answered = this.items.filter((it) => { return it.answered === true });
    if (this.items.length && answered.length < this.autocompleteAfter) return;

    const groupFailures = this.items.find((itm) => { return itm.group == this.id && itm.isCorrect === false });
    const succeed = (this.items.length) ? groupFailures == null : result.succeed;
    result.group = this.id;
    result.state = succeed ? 'correct' : 'wrong';
    answered.forEach((it) => { it.resolve(it.isCorrect); });
    this.actProvider.addGroup({
      id: this.id,
      succeed: succeed
    });
    this.actProvider.emit(this.actProvider.ITEM_GROUP_COMPLETED, result);
    this.isComplete = true;
  }
}