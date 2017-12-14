import { Directive, ViewChildren, ContentChildren, QueryList, Input, ElementRef, ViewContainerRef,
  Renderer2, OnInit, AfterViewInit, OnDestroy
} from '@angular/core';

import { TepuyActivityService, TepuyErrorProvider, Errors, DataProviderFactory, IDataProvider } from '../providers';
//import { TepuyGroupService } from './selectable-group.provider';

//import { TepuySelectableItemDirective } from './selectable-item.directive';
//import { TepuyDropTargetDirective } from '../../directives/drop-target.directive';

@Directive({ 
  selector: '[tepuy-activity]',
  host: { },
  providers: [ TepuyActivityService ]
})
export class TepuyActivityDirective implements OnInit, AfterViewInit {
  @Input('tepuy-activity') options: any;
  @Input('tepuy-activity-id') id: string;
  @Input('tepuy-win-score') winScore: number;

  constructor(
    private el: ElementRef,
    protected vcRef: ViewContainerRef,
    private errorProvider: TepuyErrorProvider,
    //private groupProvider: TepuyGroupService,
    private activityService: TepuyActivityService) 
  { 
  }

  ngOnInit() {
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

    //Work around to be able to expose the service on a parent componet when the activity component is created dynamically
    let injector: any = this.vcRef.injector;
    var parent = injector.view.context;
    let t = {};
    if (parent.init && t.toString.call(parent.init) === '[object Function]') {
      parent.init(this.activityService);
    }
  }

  ngAfterViewInit(){
  }
}