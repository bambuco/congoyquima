import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//General directives
import { TepuyRandomDirective } from './directives/random.directive';
import { TepuyRepeatDirective } from './directives/repeat.directive';
//import { TepuyTemplateCompileDirective } from './directives/template-compiler.directive';
import { TepuyScaleWidthDirective } from './directives/scale-width.directive';
import { TepuyDropTargetDirective } from './directives/drop-target.directive';

import { TepuyActivityVerifyDirective } from './directives/activity-verify.directive';
//Activity components
import { TepuyActivityComponent } from './activities/activity.component';
import { TepuySelectableComponent } from './activities/selectable/selectable.component';
//Activity directives
import { TepuySelectableGroupDirective } from './activities/selectable/selectable-group.directive';
import { TepuySelectableItemDirective } from './activities/selectable/selectable-item.directive';
//Activity providers
//import { TepuySelectableService } from './activities/selectable/selectable.provider';
import { TepuyActivityService } from './activities/activity.provider';
import { TepuyErrorProvider } from './providers/error.provider';
import { TepuyUtils } from './tepuy-utils';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyDropTargetDirective,
    //TepuyTemplateCompileDirective,
    TepuyActivityVerifyDirective,
    TepuySelectableComponent,
    TepuySelectableGroupDirective,
    TepuySelectableItemDirective,
    TepuyActivityComponent
  ],
  entryComponents: [
    TepuySelectableComponent
  ],
  exports: [
    TepuyRandomDirective,
    TepuyRepeatDirective,
    TepuyScaleWidthDirective,
    TepuyDropTargetDirective,
    //TepuyTemplateCompileDirective,
    TepuyActivityVerifyDirective,
    TepuySelectableComponent,
    TepuySelectableGroupDirective,
    TepuySelectableItemDirective,
  ],
  providers: [
    TepuyActivityService, TepuyErrorProvider
  ]
})
export class TepuyModule {}