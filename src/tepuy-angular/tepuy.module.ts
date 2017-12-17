import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//General directives
import { TepuyRandomDirective } from './directives/random.directive';
import { TepuyRepeatDirective } from './directives/repeat.directive';
import { TepuyScaleWidthDirective } from './directives/scale-width.directive';

//Activity directives
import { 
  TepuyActivityDirective, TepuyGroupContainerDirective, TepuyGroupDirective, TepuyItemDirective,
  TepuySelectableDirective, TepuyGreetableDirective, TepuyDraggableDirective, TepuyDropZoneDirective,
  TepuyMarkableComponent
} from './behaviors';

//Activity Services
import {
  TepuyActivityService,
  TepuyDraggableService,
  TepuyAudioPlayerProvider,
  TepuyErrorProvider
} from './providers';

import { TepuyUtils } from './tepuy-utils';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyActivityDirective,
    TepuyGroupContainerDirective,
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
    //
    TepuyActivityDirective,
    TepuyGroupContainerDirective,
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