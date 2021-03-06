import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//General directives
import { TepuyRandomDirective } from './directives/random.directive';
import { TepuyRepeatDirective } from './directives/repeat.directive';
import { TepuyScaleWidthDirective, TepuyScaleDirective, TepuyAutofitDirective, TepuyTextFillDirective, TepuyPortraitDirective } from './directives/scale-width.directive';

//Activity directives
import { 
  TepuyActivityDirective, TepuyGroupDirective, TepuyItemDirective,
  TepuySelectableDirective, TepuyGreetableDirective, TepuyDraggableDirective, TepuyDropZoneDirective,
  TepuyMarkableComponent, TepuyValueGeneratorDirective, TepuySortableDirective
} from './behaviors';

//Activity Services
import {
  TepuyActivityService,
  //TepuyDraggableService,
  TepuyAudioPlayerProvider,
  TepuyErrorProvider,
  ResizeSensor,
  ResourceProvider
} from './providers';

import {
  DistributePipe, ObjectKeyPipe, SpellPipe, SumOfDigitsPipe
} from './pipes';

//import { TepuyUtils } from './tepuy-utils';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyScaleDirective,
    TepuyAutofitDirective,
    TepuyTextFillDirective,
    TepuyPortraitDirective,
    TepuyActivityDirective,
    TepuyValueGeneratorDirective,
    TepuyGroupDirective,
    TepuyItemDirective,
    TepuySelectableDirective,
    TepuyGreetableDirective,
    TepuyDraggableDirective,
    TepuyDropZoneDirective,
    TepuyMarkableComponent,
    TepuySortableDirective,
    DistributePipe,
    ObjectKeyPipe,
    SpellPipe,
    SumOfDigitsPipe
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
    TepuyAutofitDirective,
    TepuyTextFillDirective,
    TepuyPortraitDirective,
    //
    TepuyActivityDirective,
    TepuyValueGeneratorDirective,
    TepuyGroupDirective,
    TepuyItemDirective,
    TepuySelectableDirective,
    TepuyGreetableDirective,
    TepuyDraggableDirective,
    TepuyDropZoneDirective,
    TepuyMarkableComponent,
    TepuySortableDirective,
    DistributePipe,
    ObjectKeyPipe,
    SpellPipe,
    SumOfDigitsPipe
  ],
  providers: [
    TepuyActivityService, TepuyErrorProvider, TepuyAudioPlayerProvider, ResizeSensor, ResourceProvider, ObjectKeyPipe
  ]
})
export class TepuyModule {}