import { Directive, ContentChildren, QueryList, Input, Output, HostBinding,
  OnInit, AfterContentInit, OnDestroy, EventEmitter, NgZone, ElementRef
} from '@angular/core';

import { Subscription } from 'rxjs/subscription';

import { 
  TepuyActivityService, TepuyDraggableService,
  IDataProvider,
  TepuyErrorProvider, Errors 
} from '../providers';

import { TepuyItemDirective } from './tepuy-item.directive';
import { TepuyDropZoneDirective } from './tepuy-drop-zone.directive';
import { TepuyMarkableComponent } from './tepuy-markable.directive';

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
  @Input('tepuy-question') question: string;
  
  @Output('groupInit') groupinit = new EventEmitter();

  @ContentChildren(TepuyItemDirective, { descendants: true}) items: QueryList<TepuyItemDirective>;
  @ContentChildren(TepuyDropZoneDirective, { descendants: true}) targets: QueryList<TepuyDropZoneDirective>;
  @ContentChildren(TepuyMarkableComponent, { descendants: true}) markables: QueryList<TepuyMarkableComponent>;
 
  valueSource: Array<any>;
  isCorrect: boolean;
  correctDataProvider: IDataProvider;
  wrongDataProvider: IDataProvider;
  available_answers: any[];
  expected_answers: any[];
  user_answers: any[];
  private subscriptions: Subscription[] = [];

  //private actProvider: TepuySelectableService;
  groupValue:any;

  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    private errorProvider: TepuyErrorProvider,
    //private groupProvider: TepuyGroupService,
    private actProvider: TepuyActivityService
  ){
    this.available_answers = [];
    this.expected_answers = [];
    this.user_answers = [];
  }

  ngOnDestroy() {
    this.actProvider.unregisterEvent(this.actProvider.ITEM_GROUP_COMPLETING, this.id);
    for(let s of this.subscriptions) {
      s.unsubscribe();
    }
    this.subscriptions = [];
  }

  ngOnInit() {

    this.available_answers = [];
    this.expected_answers = [];
    this.user_answers = [];

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

    this.subscriptions.push(this.actProvider.on(this.actProvider.ACTIVITY_VERIFIED).subscribe(() => {
      this.isComplete = true;
    }));
    
    this.subscriptions.push(this.actProvider.on(this.actProvider.ACTIVITY_RESET).subscribe(() => {
      this.available_answers = [];
      this.expected_answers = [];
      this.user_answers = [];
      this.resetItemValues();
    }));

    this.subscriptions.push(this.actProvider.on(this.actProvider.ITEM_GROUP_COMPLETING, this.id).subscribe((result) => {
      this.onGroupCompleting(result);      
    }));
  }

  ngAfterContentInit() {
    //Set group ids for the items
    this.items.forEach((item:any) => {
      item.group = this.id;
      item.$group = this;
      setTimeout(() => {
        this.available_answers.push(item.value);
        this.grabCorrectAnswerFromItem(item);
      }, 100);
    });
    
    this.items.changes.subscribe((it) => {
      it.forEach((item) => {
        item.$group = this;
        this.available_answers.push(item.value);
        this.grabCorrectAnswerFromItem(item);
      })      
    });

    this.grabCorrectAnswersFromMarkables(this.markables);
    this.markables.changes.subscribe((changes) => {
      this.grabCorrectAnswersFromMarkables(this.markables);
    });
    
    this.grabCorrectAnswersFromDropZones(this.targets);
    this.targets.changes.subscribe((targets) => {
      this.grabCorrectAnswersFromDropZones(targets);
    });

    //select a set of values
    this.resetItemValues();
    this.groupinit.emit({ zone: this.zone, elRef: this.elRef });
    this.actProvider.setStartTime();
  }

  private grabCorrectAnswerFromItem(item:any) {
    if (!this.correctDataProvider && item.correct && !item.actAsDraggable) {
      this.expected_answers.push(item.value);
    }
  }

  private grabCorrectAnswersFromDropZones(targets) {
    if (!this.correctDataProvider) {
      targets.forEach((target:any) => {
        if (target.correctValues && target.correctValues.length) {
          let value = target.correctValues.length > 1 ? target.correctValues : target.correctValues[0];
          this.expected_answers.push(value);
        }
      });
    }
  }

  private grabCorrectAnswersFromMarkables(markables) {
    if (!markables) return;
    setTimeout(() => {
      markables.forEach((markable:any) => {
        if (!markable.items) return;
        markable.items.forEach((it:any) => {
          if (it.correct) {
            this.expected_answers.push(it.value);
          }
        });
      });
    }, 100);
  }

  private resetItemValues() {
    if (!this.correctDataProvider) return;
    this.available_answers = [];
    this.expected_answers = [];
    this.user_answers = [];

    this.correctDataProvider.reset();
    if (this.wrongDataProvider){
      this.wrongDataProvider.reset();
    }

    let values = new Array<any>();
    for(let i = 0; i < this.options.correctSize; i++){
      const value = this.correctDataProvider.next();
      values.push({value: value, correct: true });
      this.expected_answers.push(value);
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
    this.user_answers = answered.map((it:any, i) => { return { value: it.value, index: it.index != undefined ? it.index : i }; })
      .sort((a,b) => { return a.index - b.index })
      .map((it => it.value));
    this.grabUserAnswersFromMarkables();

    const groupFailures = this.items.find((itm) => { return itm.group == this.id && itm.isCorrect === false });
    const succeed = (this.items.length) ? groupFailures == null : result.succeed;
    result.group = this.id;
    result.state = succeed ? 'correct' : 'wrong';
    answered.forEach((it) => { it.resolve(it.isCorrect); });
    
    this.actProvider.addGroup({
      id: this.id,
      succeed: succeed,
      $group: this
    });
    
    this.actProvider.emit(this.actProvider.ITEM_GROUP_COMPLETED, result);
    this.isComplete = true;
  }

  private grabUserAnswersFromMarkables() {
    if (this.markables && this.markables.length) {
      this.markables.forEach((markable) => {
        markable.items.forEach((it) => {
          if (it.answered) {
            this.user_answers.push(it.value);
          }
        });
      });
    }
  }
}