import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//General directives
import { TepuyRandomDirective } from './directives/random.directive';
import { TepuyRepeatDirective } from './directives/repeat.directive';
import { TepuyScaleWidthDirective, TepuyScaleDirective } from './directives/scale-width.directive';

//Activity directives
import { 
  TepuyActivityDirective, TepuyGroupDirective, TepuyItemDirective,
  TepuySelectableDirective, TepuyGreetableDirective, TepuyDraggableDirective, TepuyDropZoneDirective,
  TepuyMarkableComponent, TepuyValueGeneratorDirective
} from './behaviors';

//Activity Services
import {
  TepuyActivityService,
  //TepuyDraggableService,
  TepuyAudioPlayerProvider,
  TepuyErrorProvider
} from './providers';

//import { TepuyUtils } from './tepuy-utils';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyScaleDirective,
    TepuyActivityDirective,
    TepuyValueGeneratorDirective,
    TepuyGroupDirective,
    TepuyItemDirective,
    TepuySelectableDirective,
    TepuyGreetableDirective,
    TepuyDraggableDirective,
    TepuyDropZoneDirective,
    TepuyMarkableComponent
  ],
  entryComponents: [
    //TepuySelectableComponent
    TepuyMarkableComponent
  ],
  exports: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyScaleDirective,
    //
    TepuyActivityDirective,
    TepuyValueGeneratorDirective,
    TepuyGroupDirective,
    TepuyItemDirective,
    TepuySelectableDirective,
    TepuyGreetableDirective,
    TepuyDraggableDirective,
    TepuyDropZoneDirective,
    TepuyMarkableComponent
  ],
  providers: [
    TepuyActivityService, TepuyErrorProvider, TepuyAudioPlayerProvider
  ]
})
export class TepuyModule {}