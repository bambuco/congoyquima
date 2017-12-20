import { Directive, Input, HostBinding, HostListener, OnChanges,
  ElementRef, AfterViewInit
} from '@angular/core';
/*
function _window() : any {
   return window;
}
*/
function _document() : any {
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

  constructor() { 
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


@Directive({ 
  selector: '[tepuy-scale]',
  host: {
    "(window:resize)": "onResize($event)"
  }
 })
export class TepuyScaleDirective implements OnChanges, AfterViewInit {
  @Input('tepuy-scale') tepuyScale: number;
  @Input('tepuy-scale-using') public scaleUsing: string = 'height';
  @Input('tepuy-scale-extra') public extra: string;

  //@HostListener('window:resize', ['$event'])
  onResize($event=null) {
    setTimeout(() => {
      this.calculateScale();
    }, 200);
  }

  private originalDisplay: string;

  constructor(private elRef:ElementRef) {
    this.originalDisplay = elRef.nativeElement.style.display;
    this.elRef.nativeElement.style.display = 'none';
  }

  ngOnChanges() {
    if (this.tepuyScale != undefined) {
      //this.calculateScale();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateScale();
    }, 200);
  }

  calculateScale(onResize:boolean=false) {
    const el = this.elRef.nativeElement;
    const content = _document().querySelector('.content-zone');
    let height = content.offsetHeight;
    const scale = Math.round(height / this.tepuyScale * 1000) / 1000;
    const transform = 'scale(' + scale + ') ' + (!this.extra? '' : this.extra);
    el.style.transform = transform;      
    el.style.display = this.originalDisplay;
  }
}
