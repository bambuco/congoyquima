import { Directive, Input, ElementRef, Renderer2, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { TepuyActivityService } from '../../activities/activity.provider';
import { TepuySelectableService } from './selectable.provider';
import { TepuyGroupService } from './selectable-group.provider';
import { TepuyErrorProvider, Errors } from '../../providers/error.provider';

@Directive({ 
  selector: '[tepuy-selectable-group]',
  host: { },
  providers: [ TepuyGroupService ]
})
export class TepuySelectableGroupDirective implements OnInit, AfterViewInit {
  @Input('tepuy-selectable-group') options: any;
  @Input('tepuy-group-id') id: string;
  @Input('tepuy-type') type: string;
  @Input('tepuy-options-size') size: number;
  @Input('tepuy-correct-size') correctSize: number;
  @Input('tepuy-correct-options') correctSource: any;
  @Input('tepuy-wrong-options') wrongSource: any;
 
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
    if (!/(multiple|single)/i.test(options.type)) options.type = 'single';
    if (isNaN(options.size)) options.size = 2; //One correct, One wrong
    if (isNaN(options.correctSize)) options.correctSize = 1;

    //Do some verifications
    if (options.size < 2) {
      this.errorProvider.raise(Errors.InvalidGroupSize);      
    }




    console.log(this.id);
    console.log(this.type);
    console.log(this.size);
    console.log(this.correctSize);
    console.log(this.correctSource);
    console.log(this.wrongSource);

  }

  ngAfterViewInit(){
  }

}