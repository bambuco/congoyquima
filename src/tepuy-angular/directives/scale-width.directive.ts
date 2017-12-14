import { Directive, Input, HostBinding, HostListener, OnChanges, Renderer2, ElementRef } from '@angular/core';

function _window() : any {
   // return the global native browser window object
   return window;
}
function _document() : any {
   // return the global native browser window object
   return document;
}

@Directive({ 
  selector: '[tepuy-scale-width]'
 })
export class TepuyScaleWidthDirective implements OnChanges {
  @Input('tepuy-scale-width') public widthToScale: number ;
  @Input('scale-original-height') public originalHeight: number;
  @Input('scale-current-height') public currentHeight: number;
  @Input('scale-current-width') public currentWidth: number;
  @HostBinding('style.width.px') width: number;

  @HostListener('window:resize', ['$event'])
  onResize($event=null) {
  }

  constructor(private elRef:ElementRef, private renderer:Renderer2) { 
  }

  ngOnChanges() {
    if (this.currentHeight != undefined) {
      this.calculateWidth();
    }
  }

  calculateWidth() {
    const height = this.currentHeight;
    const scale = height / this.originalHeight;
    const newWidth = scale * this.widthToScale;
    this.width = Math.min(newWidth, this.currentWidth);
  }
  /*

  //Explore this alternative to not pass the width and height from Input
function _document() : any {
   return document;
}
    const d = _document(), e = d.documentElement;
    const content = e.querySelector(this.reference); //'.content-zone'
    const height =  content.offsetHeight; //this.currentHeight;
    const scale = height / this.originalHeight;
    const newWidth = scale * this.widthToScale;
    this.width = Math.min(newWidth, content.offsetWidth); //this.currentWidth);
  */

}
