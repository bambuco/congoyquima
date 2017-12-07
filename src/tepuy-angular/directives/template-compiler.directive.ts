import {
  Compiler, NgModule, Component, Input, ComponentRef, Directive, 
  ModuleWithComponentFactories, OnChanges, Type,
  ViewContainerRef, EventEmitter, Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TepuyModule } from '../tepuy.module';

import { TepuyActivityComponent } from '../activities/activity.component';


@Directive({
  selector: '[tepuyTemplateCompile]'
})
export class TepuyTemplateCompileDirective implements OnChanges {
  @Input() compile: string;
  @Input() compileContext: any;
  @Output() componentReady:EventEmitter<any> = new EventEmitter();


  compRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {}

  ngOnChanges(changes) {
    if(!this.compile) {
      if(this.compRef) {
        this.updateProperties();
        return;
      }
      throw Error('You forgot to provide template');
    }

    this.vcRef.clear();
    this.compRef = null;

    const component = this.createDynamicComponent(this.compile);
    const module = this.createDynamicModule(component);
    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        let compFactory = moduleWithFactories.componentFactories.find(x => x.componentType === component);

        this.compRef = this.vcRef.createComponent(compFactory);
        this.updateProperties();
        this.componentReady.emit(this.compRef);
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateProperties() {
    for(var prop in this.compileContext) {
      this.compRef.instance[prop] = this.compileContext[prop];
    }
  }

  private createDynamicComponent (template:string) {
    @Component({
      selector: 'mini-game',
      template: template,
    })
    class CustomDynamicComponent {}
    return CustomDynamicComponent;
  }

  private createDynamicModule (component: Type<any>) {
    @NgModule({
      // You might need other modules, providers, etc...
      // Note that whatever components you want to be able
      // to render dynamically must be known to this module
      imports: [CommonModule, IonicModule, TepuyModule],
      declarations: [component]
    })
    class DynamicModule {}
    return DynamicModule;
  }
}