import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//General directives
import { TepuyRandomDirective } from './directives/random.directive';
import { TepuyTemplateCompileDirective } from './directives/template-compiler.directive';
import { TepuyActivityVerifyDirective } from './directives/activity-verify.directive';
//Activity components
import { TepuyActivityComponent } from './activities/activity.component';
import { TepuySelectableComponent } from './activities/selectable/selectable.component';
//Activity directives
import { TepuySelectableItemDirective } from './activities/selectable/selectable-item.directive';

//Activity providers
//import { TepuySelectableService } from './activities/selectable/selectable.provider';
import { TepuyActivityService } from './activities/activity.provider';
import { TepuyUtils } from './tepuy-utils';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TepuyRandomDirective,
    TepuyTemplateCompileDirective,
    TepuyActivityVerifyDirective,
    TepuySelectableComponent,
    TepuySelectableItemDirective
  ],
  entryComponents: [
    TepuySelectableComponent
  ],
  exports: [
    TepuyRandomDirective,
    TepuyTemplateCompileDirective,
    TepuyActivityVerifyDirective,
    TepuySelectableComponent,
    TepuySelectableItemDirective
  ],
  providers: [
    TepuyActivityService
  ]
})
export class TepuyModule {}