import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, AfterContentInit } from '@angular/core';

//import { Content } from '../content/content';
import { Platform, DomController } from 'ionic-angular';
import { isTrueProperty, reorderArray } from '../classes/utils';
import { ItemReorderGesture, ItemReorderGestureDelegate } from '../classes/reorder-gesture.class';


export class ReorderIndexes {
  constructor(public from: number, public to: number, public items?:any[]) {}

  applyTo(array: any) {
    reorderArray(array, this);
  }
}

/**
 * @name TepuySortableDirective
 * @description
 * Based on ItemReorder directive from Ionic
 *
 */
@Directive({
  selector: '[tepuy-sortable]',
  host: {
    '[class.tepuy-sortable]': '_sortEnabled'
  }
})
export class TepuySortableDirective implements ItemReorderGestureDelegate, AfterContentInit {

  _sortEnabled: boolean = false;
  _visibleReorder: boolean = false;
  _order: any[] = [];
  _direction: ('h'|'v') = 'h';
  _reorderGesture: ItemReorderGesture;
  _lastToIndex: number = -1;
  _element: HTMLElement;
  private $group: any;

  /**
   * @output {object} Emitted when the item is reordered. Emits an object
   * with `from` and `to` properties.
   */
  @Output() tepuyItemReorder: EventEmitter<ReorderIndexes> = new EventEmitter<ReorderIndexes>();

  /**
   * @input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
   */
  @Input('tepuy-order')
  set order(order: any[]) {
    this._order = order;
    if (this.$group) {
      this.$group.expected_answers = order;
    }
  }

  @Input('tepuy-direction')
  set direction(direction: ('h'|'v')) {
    this._direction = direction;
  }

  constructor(
    private _plt: Platform,
    private _dom: DomController,
    elementRef: ElementRef,
    private _rendered: Renderer2,
    private _zone: NgZone,
    //@Optional() private _content: Content
  ) {
    this._element = elementRef.nativeElement;
  }

  ngAfterContentInit() {
    let children:any = this._element.children;

    for(let i = 0, iLen = children.length; i < iLen; i++) {
      let item = children[i].$tepuyItem;

      if (item) {
        item.answered = true;
        item.isCorrect = (item.value == this._order[i]);
        setTimeout(() => {
          if (!this.$group && item.$group) {
            this.$group = item.$group;
            item.$group.expected_answers = this._order;
          }
        }, 100);
      }

    }
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._element = null;
    this._reorderGesture && this._reorderGesture.destroy();
  }

  /**
   * @hidden
   */
  @Input('tepuy-sortable')
  get reorder(): boolean {
    return this._sortEnabled;
  }
  set reorder(val: boolean) {
    let enabled = isTrueProperty(val);
    if (!enabled && this._reorderGesture) {
      this._reorderGesture.destroy();
      this._reorderGesture = null;

      this._visibleReorder = false;
      setTimeout(() => this._sortEnabled = false, 400);

    } else if (enabled && !this._reorderGesture) {
      this._reorderGesture = new ItemReorderGesture(this._plt, this, this._direction);

      this._sortEnabled = true;

      this._dom.write(() => {
        this._zone.run(() => {
          this._visibleReorder = true;
        });
      }, 16);
    }
  }

  _reorderPrepare() {
    let ele = this._element;
    let children: any = ele.children;
    for (let i = 0, ilen = children.length; i < ilen; i++) {
      var child = children[i];
      child.$ionIndex = i;
      child.$ionReorderList = ele;
    }
  }

  _reorderStart() {
    this.setElementClass('reorder-list-active', true);
  }

  _reorderEmit(fromIndex: number, toIndex: number) {
    this._reorderReset();
    if (fromIndex !== toIndex) {
      this._zone.run(() => {
        let children: any = this._element.children;
        if (this.tepuyItemReorder.observers.length) {
          const items:any[] = Array.from(children).map((it:any) => it.$tepuyItem);
          this.tepuyItemReorder.emit(new ReorderIndexes(fromIndex, toIndex, items));
          return;
        }
        let i = fromIndex;
        let step = fromIndex > toIndex ? -1 : 1;
        let aux = children[fromIndex].$tepuyItem.value;
        while(i != toIndex) {
          const val = children[i+step].$tepuyItem.value
          children[i].$tepuyItem.value = val;
          children[i].$tepuyItem.isCorrect = (val == this._order[i]);
          i+=step;         
        }
        children[i].$tepuyItem.value = aux;
        children[i].$tepuyItem.isCorrect = (aux == this._order[i]);
      });
    }
  }

  /*_scrollContent(scroll: number) {
    const scrollTop = this._content.scrollTop + scroll;
    if (scroll !== 0) {
      this._content.scrollTo(0, scrollTop, 0);
    }
    return scrollTop;
  }*/

  _reorderReset() {
    let children = this._element.children;
    let len = children.length;

    this.setElementClass('reorder-list-active', false);
    let transform = this._plt.Css.transform;
    for (let i = 0; i < len; i++) {
      (<any>children[i]).style[transform] = '';
    }
    this._lastToIndex = -1;
  }

  _reorderMove(fromIndex: number, toIndex: number, itemSize: number) {
    if (this._lastToIndex === -1) {
      this._lastToIndex = fromIndex;
    }
    let lastToIndex = this._lastToIndex;
    this._lastToIndex = toIndex;

    // TODO: I think both loops can be merged into a single one
    // but I had no luck last time I tried

    /********* DOM READ ********** */
    let children = this._element.children;
    const coord = this._direction == 'h' ? 'X' : 'Y';

    /********* DOM WRITE ********* */
    let transform = this._plt.Css.transform;
    if (toIndex >= lastToIndex) {
      for (let i = lastToIndex; i <= toIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i > fromIndex)
            ? `translate${coord}(${-itemSize}px)` : '';
        }
      }
    }

    if (toIndex <= lastToIndex) {
      for (let i = toIndex; i <= lastToIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i < fromIndex)
            ? `translate${coord}(${itemSize}px)` : '';
        }
      }
    }
  }

  /**
   * @hidden
   */
  setElementClass(classname: string, add: boolean) {
    if (add) {
      this._rendered.addClass(this._element, classname);
    }
    else {
      this._rendered.removeClass(this._element, classname);
    }
  }

  /**
   * @hidden
   */
  getNativeElement(): HTMLElement {
    return this._element;
  }
}