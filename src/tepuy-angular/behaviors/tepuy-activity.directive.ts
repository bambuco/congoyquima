import { Directive, ViewChildren, ContentChild, ContentChildren, QueryList, Input, ElementRef, ViewContainerRef,
  Renderer2, OnInit, AfterContentInit, OnDestroy, AfterViewInit
} from '@angular/core';
import { Slides } from 'ionic-angular';

import { TepuyActivityService, TepuyErrorProvider, Errors, DataProviderFactory, IDataProvider } from '../providers';
import { TepuyGroupContainerDirective } from './tepuy-group-container.directive';

@Directive({ 
  selector: '[tepuy-activity]',
  host: { },
  providers: [ TepuyActivityService ]
})
export class TepuyActivityDirective implements OnInit, AfterContentInit, AfterViewInit {
  @Input('tepuy-activity') options: any;
  @Input('tepuy-activity-id') id: string;
  @Input('tepuy-win-score') winScore: number;
  @Input('tepuy-slide-delay') slideDelay: number = 1;
  @Input('tepuy-group-values') groupValues: any;

  @ContentChildren(TepuyGroupContainerDirective, { descendants: true}) groups: QueryList<TepuyGroupContainerDirective>;
  @ContentChildren(Slides, { descendants: true}) slides: QueryList<Slides>;

  private dataGroupProvider:IDataProvider;
  private slideCtrl:Slides;
  
  constructor(
    private el: ElementRef,
    protected vcRef: ViewContainerRef,
    private errorProvider: TepuyErrorProvider,
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
    if (this.groupValues) options.groupValues = this.groupValues;

    //Set default values if required
    if (!options.id) options.id = this.activityService.newId();  
    if (!isNaN(options.winScore)){
      this.activityService.winScore = parseFloat(options.winScore);
    }

    if (options.groupValues) {
      this.dataGroupProvider = this.activityService.getDataProvider(options.groupValues);
    }

    this.activityService.on(this.activityService.ITEM_GROUP_COMPLETED).subscribe(() => {
      this.groupCompleted();
    });

    this.activityService.on(this.activityService.ACTIVITY_RESET).subscribe(() => {
      console.log('handling reset on activity');
      this.resetGroupValues();
    });
  }

  ngAfterContentInit(){
    this.resetGroupValues();
  }

  ngAfterViewInit() {
    if (this.slideCtrl) {
      console.log('setting additional slide settings');
      //this.slideCtrl.slidesPerView = 4;
      //this.slideCtrl.slidesPerColumn = 2;
    }
  }

  private resetGroupValues() {
    if (!this.dataGroupProvider) return;

    this.dataGroupProvider.reset();
    this.groups.forEach((group, i) => {
      const value = this.dataGroupProvider.next();
      setTimeout(() => {
        group.groupValue = value;
      }, 0);      
    });

    if (this.slides.length) {
      this.slideCtrl = this.slides.first;
      if (this.slideCtrl.isEnd()) {
        this.slideCtrl.lockSwipes(false);
        this.slideCtrl.slideTo(0, 0, false);
      }
    }

    if (this.slideCtrl) {
      this.slideCtrl.enableKeyboardControl(false);
      this.slideCtrl.lockSwipes(true);
    }
  }

  private groupCompleted(){
    //this.slideCtrl.pager = true;
    this.slideCtrl.lockSwipes(false);
    this.slideCtrl.lockSwipeToPrev(true);
    this.slideCtrl.paginationType = 'progress';
    this.slideCtrl.update();
    setTimeout(() => {
      if (this.slideCtrl) {
        if(this.slideCtrl.isEnd()) {
          this.activityService.verify();
          //this.slideCtrl.slidesPerColumn = 2;
          //this.slideCtrl.slidesPerView = 4;
        }
        else {
          this.slideCtrl.lockSwipes(false);
          console.log('sliding next.. from: ' + this.slideCtrl.getActiveIndex())
          this.slideCtrl.slideNext();
          this.slideCtrl.lockSwipes(true);
        }
      }
    }, this.slideDelay * 1000);
  }
}