import { Directive, Input, HostBinding, HostListener, OnChanges } from '@angular/core';

@Directive({ 
  selector: '[tepuy-scale-width]'
 })
export class TepuyScaleWidthDirective implements OnChanges {
  @Input('tepuy-scale-width') public widthToScale: number ;
  @Input('scale-original-height') public originalHeight: number;
  @Input('scale-current-height') public currentHeight: number;
  @HostBinding('style.width.px') width: number;

  @HostListener('window:resize', ['$event'])
  onResize($event=null) {
    console.log('Resize from directive');
    console.log(this.currentHeight);
  }

  constructor() { 
    console.log('constructor');
  }

  ngOnChanges() {
    console.log('onChanges');
    if (this.currentHeight != undefined) {
      this.calculateWidth();
    }
  }

  calculateWidth() {
    console.log(this.currentHeight);
    console.log(this.originalHeight);
    console.log(this.widthToScale);
    const height = this.currentHeight;
    const scale = height / this.originalHeight;
    const newWidth = scale * this.widthToScale;
    console.log(newWidth);
    this.width = newWidth;
  }
}
