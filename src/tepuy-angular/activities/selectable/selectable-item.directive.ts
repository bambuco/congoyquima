import { Directive, Input, ContentChild, ElementRef,
  Renderer2, OnInit, AfterViewInit, OnDestroy
} from '@angular/core';
import { DomController } from 'ionic-angular';

import { TepuyActivityService } from '../../activities/activity.provider';
import { TepuySelectableService } from './selectable.provider';

@Directive({ 
  selector: '[tepuy-selectable-item]',
  host: { 
    "(click)": "toggle($event)",
    "[class.tepuy-good]" : "succeed === true",
    "[class.tepuy-wrong]": "succeed === false",
    "[class.tepuy-selected]": "selected === true",
    "(touchstart)": "onTouchStart()",
    "(mousedown)": "onMouseDown()",
    "(drag)": "onDrag($event)",
    "(panstart)": "onPanStart($event)",
    "(panend)": "onPanEnd($event)"
  }
})
export class TepuySelectableItemDirective implements OnInit, AfterViewInit {
  @Input('tepuy-group') group: string;
  @Input('tepuy-correctFn') correctFn: string;
  @Input('tepuy-correct') correct: boolean;
  @Input('tepuy-draggable') draggable: boolean = false;

  valueEl: any;
  id: string;
  selected: boolean;
  done: boolean;
  succeed: boolean;
  isCorrect: boolean;
  private lastDragTranslate: string;
  private isDragging: boolean = false;
  private originalParent: HTMLElement=null;
  private originalStyle: any;

  private itemTouchedTime: number = 0;

  private service: TepuySelectableService;

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController,
    serviceWrapper: TepuyActivityService) { 
    this.service = serviceWrapper as TepuySelectableService;
  }

  ngOnInit() {    
    let el = this.el.nativeElement.querySelector('[tepuy-item-value]');
    this.valueEl = el || this.el.nativeElement;
    this.originalParent = this.el.nativeElement.parentElement;
    this.originalStyle = {
      left: this.el.nativeElement.style.left,
      top: this.el.nativeElement.style.top,
      position: this.el.nativeElement.style.position
    };
  }

  ngAfterViewInit(){
    this.initialize();

    if (this.draggable) {
      this.enableDraggable();
    }
  }

  initialize() {
    this.id = this.service.childId();
    //this.service.emit('itemAdded', this);
    this.service.itemAdded(this);
    this.service.on(this.service.ACTIVITY_RESET).subscribe(() => {
      this.refresh();
      if (this.draggable) {
        this.resetPosition();
      }
    });

    this.refresh();
  }

  refresh() {
    this.selected = false;
    this.done = false;
    this.succeed = null;
    this.isCorrect = null;
  }

  toggle() {    
    //toogle only if has not been resolved
    if (this.draggable) return;
    if (this.done) return;
    this.selected = !this.selected;
    //this.service.emit('itemChanged', this);
    this.service.itemChanged(this);
    this.isCorrect = (this.correct && this.selected);
  }

  onTouchStart() {
    this.itemTouchedTime = new Date().getTime();
    this.service.emit(this.service.ITEM_TOUCHED, this);
  }

  onMouseDown() {
    const time = new Date().getTime();
    if ((time)-this.itemTouchedTime > 2) { //To prevent touch and click firing twice
      this.itemTouchedTime = time;
      this.service.emit(this.service.ITEM_TOUCHED, this);
    }
  }

  //Getters/Setters

  get value() {
    //return this.el.nativeElement.value ? this.el.nativeElement.value : this.el.nativeElement.innerText;
    return ('value' in this.valueEl) ? this.valueEl.value : this.valueEl.innerText;
  }
  set value(val) {
    //var el = this.valueEl ? this.valueEl : this.el.nativeElement;
    if (this.valueEl.value)
      this.valueEl.value = val;
    else {
      this.valueEl.innerText = val;
    }
  }

  private enableDraggable() {
    //Get Current position
    let position = this.position();
    let hammer = new window['Hammer'](this.el.nativeElement);
    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });
    hammer.on('pan', (ev) => {
      this.onPan(ev);
    });
  }

  onPanStart(ev) {
    console.log('Pan started');
    this.isDragging = true;
    this.renderer.addClass(this.el.nativeElement, "tepuy-dragging");
  }

  onPanEnd(ev) {
    //Drag completed
    console.log('pan end');
    this.isDragging = false;
    if (true || ev.isFinal) {
      const targetEl = this.getElementFromPoint(this.el.nativeElement, ev.center.x, ev.center.y);
      if(targetEl && targetEl.hasAttribute('tepuy-drop-target')) {
        this.dropIt(targetEl, ev);
      }
      else if (targetEl && targetEl == this.originalParent) { //Allows to return to the parent container
        this.resetPosition();
      }
      else {
        this.domCtrl.write(() => {
          this.setTranslate(null);
        });
        this.lastDragTranslate = null;
      }
      this.renderer.removeClass(this.el.nativeElement, "tepuy-dragging");
      this.isDragging = false;
      return;
    }
  }

  onPan(ev) {
    if (!this.isDragging) return;
    console.log('Pan');
    /*//Drag started
    if (ev.type == 'press') { 
      this.isDragging = true;
      this.renderer.addClass(this.el.nativeElement, "tepuy-dragging");
    }
    */
    const translate = ['translate(', ev.deltaX+'px,', ev.deltaY+'px', ')'].join('');    
    //Pan moving
    this.domCtrl.write(() => {
      this.setTranslate(translate);
    });
  }

  dropIt(target, ev) {
    target.appendChild(this.el.nativeElement);
    this.domCtrl.write(() => {
      this.setTranslate(null);
      this.renderer.setStyle(this.el.nativeElement, 'left', '0px');
      this.renderer.setStyle(this.el.nativeElement, 'top', '0px');
      this.renderer.addClass(this.el.nativeElement, 'tepuy-dropped');
    });
    const targetVal = target.getAttribute('tepuy-correct-value');
    console.log(targetVal);
    console.log(this.value);
    this.isCorrect = (targetVal == this.value);
  }

  getElementFromPoint(el, x, y) {
    //Hide the dragging element so it took the first element behind
    var display = el.style.display;
    el.style.display = 'none';
    //Get the element behind
    var target = document.elementFromPoint(x, y);
    //Restart the visibility
    el.style.display = display;
    return target;
  }

  private position() {
    let el = this.el.nativeElement;
    let top = 0;
    let left = 0;
    do {
        top += el.offsetTop  || 0;
        left += el.offsetLeft || 0;
        el = el.offsetParent;
    } while(el);
    return { left: left, top: top };
  }

  private setTranslate(translate) {
    if(translate!=null){
      this.renderer.setStyle(this.el.nativeElement, 'transform', translate);
      this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', translate);
      this.renderer.setStyle(this.el.nativeElement, '-ms-transform', translate);
      this.renderer.setStyle(this.el.nativeElement, '-moz-transform', translate);
      this.renderer.setStyle(this.el.nativeElement, '-o-transform', translate);
    }
    else {
      this.renderer.removeStyle(this.el.nativeElement, 'transform');
      this.renderer.removeStyle(this.el.nativeElement, '-webkit-transform');
      this.renderer.removeStyle(this.el.nativeElement, '-ms-transform');
      this.renderer.removeStyle(this.el.nativeElement, '-moz-transform');
      this.renderer.removeStyle(this.el.nativeElement, '-o-transform');
    }
    console.log('translate set to:' + translate);
  }

  private resetPosition() {
    this.originalParent.appendChild(this.el.nativeElement);
    for(let prop in this.originalStyle){
      let val = this.originalStyle[prop];
      if (val == "") {
        this.renderer.removeStyle(this.el.nativeElement, prop);
      }
      else {
        this.renderer.setStyle(this.el.nativeElement, prop, val);
      }
    }
    this.domCtrl.write(() => {
      this.renderer.removeClass(this.el.nativeElement, 'tepuy-dropped');
      this.setTranslate(null);
    });
    this.isCorrect = false;
  }

}