import {
  Compiler, NgModule, Component, Input, ComponentRef, Directive, 
  ModuleWithComponentFactories, OnChanges, Type,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TepuyModule } from '../tepuy-angular/tepuy.module';
import { NgPipesModule } from 'ngx-pipes';


@Directive({
  selector: '[compile]'
})
export class CompileDirective implements OnChanges {
  @Input() compile: string;
  @Input() compileCss: string;
  @Input() compileContext: any;

  compRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef
    , private compiler: Compiler) {

  }

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

    let declarations = (this.compileContext && this.compileContext.componentBuilder) ?
      this.compileContext.componentBuilder(this.compile, this.compileCss) :
      this.createDynamicComponent(this.compile, this.compileCss );

    if (!Array.isArray(declarations)) declarations = [ declarations ];
    const component = declarations[0];

    const module = this.createDynamicModule(declarations, declarations);
    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        let compFactory = moduleWithFactories.componentFactories.find(x => x.componentType === component);

        this.compRef = this.vcRef.createComponent(compFactory);
        if (this.compRef.instance['setFactory']) {
          this.compRef.instance.setFactory(moduleWithFactories.componentFactories);
        }
        this.updateProperties();
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateProperties() {
    for(var prop in this.compileContext) {
      if (prop == 'componentBuilder') continue;
      this.compRef.instance[prop] = this.compileContext[prop];
    }
  }

  private createDynamicComponent (template:string, css:string) {
    @Component({
      selector: 'mini-game',
      template: template,
      styles: [ css || '' ],
      encapsulation: ViewEncapsulation.None
    })
    class CustomDynamicComponent {}
    return CustomDynamicComponent;
  }

  private createDynamicModule (declarations: Type<any>[], entries: Type<any>[]) {
    @NgModule({
      // You might need other modules, providers, etc...
      // Note that whatever components you want to be able
      // to render dynamically must be known to this module
      imports: [CommonModule, IonicModule, TepuyModule, NgPipesModule],
      declarations: declarations,
      entryComponents: entries
    })
    class DynamicModule {}
    return DynamicModule;
  }
}