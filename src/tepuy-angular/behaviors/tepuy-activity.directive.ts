import { Directive, ContentChild, ContentChildren, QueryList, Input, ViewContainerRef,
  OnInit, AfterContentInit, HostBinding, Output, EventEmitter
} from '@angular/core';
import { Slides } from 'ionic-angular';

import { TepuyActivityService } from '../providers';
import { TepuyValueGeneratorDirective } from './tepuy-group-container.directive';

@Directive({ 
  selector: '[tepuy-activity]',
  host: { "class" : "tepuy-activity" },
  providers: [ TepuyActivityService ]
})
export class TepuyActivityDirective implements OnInit, AfterContentInit {
  @HostBinding("class.tepuy-completed") isComplete: boolean = false;

  @Input('tepuy-activity') options: any;
  @Input('tepuy-activity-id') id: string;
  @Input('tepuy-win-score') winScore: number;
  @Input('tepuy-slide-delay') slideDelay: number = 1;

  @Output() activityRestart = new EventEmitter();

  @ContentChild(TepuyValueGeneratorDirective) valueGenerator: TepuyValueGeneratorDirective;
  @ContentChildren(Slides, { descendants: true}) slides: QueryList<Slides>;

  //private dataGroupProvider:IDataProvider;
  private slideCtrl:Slides;
  
  constructor(
    protected vcRef: ViewContainerRef,
    private activityService: TepuyActivityService)   
  { 
  }

  ngOnInit() {
    //Work around to be able to expose the service on a parent componet when the activity component is created dynamically
    let injector: any = this.vcRef.injector;
    var parent = injector.view.context;
    let t = {};
    if (parent.init && t.toString.call(parent.init) === '[object Function]') {
      parent.init(this.activityService);
    }

    //Get options, it must be an object
    let options = (this.options && typeof(this.options) == 'object') ? this.options : {};
    //Override options with attribute options
    if (this.id) options.id = this.id;
    if (this.winScore) options.winScore = this.winScore;

    //Set default values if required
    if (!options.id) options.id = this.activityService.newId();  
    if (!isNaN(options.winScore)){
      this.activityService.winScore = parseFloat(options.winScore);
    }
    this.activityService.on(this.activityService.ITEM_GROUP_COMPLETED).subscribe((result) => {
      this.groupCompleted(result);
    });
    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      this.isComplete = false;
      this.activityRestart.emit();
      this.resetGroupValues();
    });
  }

  ngAfterContentInit(){
    if (this.slides.length) {
      this.setupSlider();
      this.setGroupActive(0);
    }

    this.slides.changes.subscribe((changes) => {
      this.setupSlider();
      this.setGroupActive(0);
    });
  }

  private setGroupActive(id) {
    setTimeout(() => {
      this.valueGenerator.values[id].active = true;
    }, 100);
  }

  private setupSlider() {
    this.slideCtrl = this.slides.first;
    this.slideCtrl.fade = { crossFade: true };
    this.slideCtrl.enableKeyboardControl(false);
    this.slideCtrl.lockSwipes(true);
  }

  private resetGroupValues() {
    if (!this.valueGenerator) return;

    this.activityService.clearItems();
    this.valueGenerator.refresh();
  }

  private groupCompleted(result){
    this.slideCtrl.lockSwipeToPrev(true);
    this.slideCtrl.update();
    setTimeout(() => {
      this.autoVerifyActivity(result);
    }, this.slideDelay * 1000);
  }

  private autoVerifyActivity(result:any){
    const group = parseInt(result.group);
    this.valueGenerator.values[group].state = result.state;
    delete this.valueGenerator.values[group].active;
    //is it last group?
    if (group == (this.valueGenerator.tepuyValueGeneratorCount - 1)) {
      this.activityService.verify();
      this.isComplete = true;
    }
    else {
      if (this.slideCtrl) {
        this.slideCtrl.lockSwipes(false);
        this.slideCtrl.slideNext();
        this.slideCtrl.lockSwipes(true);
        this.valueGenerator.values[group+1].active = true;
      }
    }
  }
}