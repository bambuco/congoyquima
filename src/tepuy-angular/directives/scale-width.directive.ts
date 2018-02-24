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
    }, 300);
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


@Directive({ 
  selector: '[tepuy-autofit]',
  host: {
    "(window:resize)": "onResize($event)"
  }
 })
export class TepuyAutofitDirective implements OnChanges, AfterViewInit {
  @Input('tepuy-square') public square: boolean = false;
  @Input('tepuy-offset') public offset: number = 0;
  //@HostListener('window:resize', ['$event'])
  onResize($event=null) {
    setTimeout(() => {
      this.autofit();
    }, 200);
  }

  //private originalDisplay: string;
  //private offset:number = 8;

  constructor(private elRef:ElementRef) {
  }

  ngOnChanges() {
    this.autofit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.autofit();
    }, 200);
  }

  autofit() {
    const el = this.elRef.nativeElement;
    if (!el.children || !el.children.length) return;

    const first = el.children[0];
    const rect = first.getBoundingClientRect();
    //el.style.width = first.offsetWidth + 'px';
    //el.style.height = first.offsetHeight + 'px';
    const width = (this.square ? Math.max(rect.width, rect.height) : rect.width) + this.offset;
    const height = (this.square ? Math.max(rect.width, rect.height) : rect.height) + this.offset;
    el.style.width = width + 'px';
    el.style.height = height + 'px';
  }
}


@Directive({ 
  selector: '[tepuy-portrait]',
  host: {
    "(window:resize)": "onResize($event)"
  }
 })
export class TepuyPortraitDirective implements OnChanges, AfterViewInit {
  //@HostListener('window:resize', ['$event'])
  onResize($event=null) {
    setTimeout(() => {
      this.autofit();
    }, 200);
  }

  constructor(private elRef:ElementRef) {
  }

  ngOnChanges() {
    this.autofit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.autofit();
    }, 200);
  }

  autofit() {
    const el = this.elRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const width = Math.min(rect.width, rect.height);
    el.style.width = width + 'px';
  }
}
