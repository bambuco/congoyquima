import { findReorderItem, indexForItem, pointerCoord, PointerCoordinates } from './reorder-util';
import { Platform } from 'ionic-angular';
//import { PointerCoordinates, pointerCoord } from '../../util/dom';
import { UIEventManager } from '../classes/ui-event-manager.class';

/**
 * @hidden
 */
export class ItemReorderGesture {
  private selectedItemEle: HTMLElement = null;
  private selectedItemSize: number;
  private offset: PointerCoordinates;
  private lastToIndex: number;
  private lastCoord: number;
  //private lastScrollPosition: number;
  private emptyZone: boolean;
  private windowSize: number;
  private events: UIEventManager;


  constructor(public plt: Platform, public reorderList: ItemReorderGestureDelegate, public direction:('h'|'v')='h') {
    this.events = new UIEventManager(plt);
    this.events.pointerEvents({
      element: this.reorderList.getNativeElement(),
      pointerDown: this.onDragStart.bind(this),
      pointerMove: this.onDragMove.bind(this),
      pointerUp: this.onDragEnd.bind(this),
      zone: false
    });
  }

  private onDragStart(ev: any): boolean {
    if (this.selectedItemEle) {
      return false;
    }
    let reorderElement = ev.target;
    let reorderMark = reorderElement['$tepuyItem'];
    if (!reorderMark) {
      console.error('tepuy-reorder does not contain $tepuyItem');
      return false;
    }
    this.reorderList._reorderPrepare();

    const item = reorderMark.getReorderNode();
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.preventDefault();

    const isH = this.direction == HORIZONTALLY;
    // Preparing state
    this.selectedItemEle = item;
    this.selectedItemSize = isH ? item.offsetWidth : item.offsetHeight;
    this.lastCoord = -100;
    this.lastToIndex = indexForItem(item);

    this.windowSize = (isH ? this.plt.width() : this.plt.height()) - AUTO_SCROLL_MARGIN;
    //this.lastScrollPosition = this.reorderList._scrollContent(0);

    this.offset = pointerCoord(ev);
    //this.offset.y += this.lastScrollPosition;

    item.classList.add(ITEM_REORDER_ACTIVE);
    this.reorderList._reorderStart();
    return true;
  }

  private onDragMove(ev: any) {
    const selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    ev.preventDefault();

    const isH = this.direction == HORIZONTALLY;
    // Get coordinate
    const coord = pointerCoord(ev);
    const pos = isH ? coord.x : coord.y;

    // Scroll if we reach the scroll margins
    //const scrollPosition = this.scroll(posY);

    // Only perform hit test if we moved at least 30px from previous position
    if (Math.abs(pos - this.lastCoord) > 30) {
      var overItem = this.itemForCoord(coord);
      if (overItem) {
        var toIndex = indexForItem(overItem);
        if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
          var fromIndex = indexForItem(selectedItem);
          this.lastToIndex = toIndex;
          this.lastCoord = pos;
          this.emptyZone = false;
          this.reorderList._reorderMove(fromIndex, toIndex, this.selectedItemSize);
        }
      } else {
        this.emptyZone = true;
      }
    }

    // Update selected item position
    const diff = Math.round(pos - (isH ? this.offset.x : this.offset.y)); // + scrollPosition);
    const coordStr = isH ? 'X' : 'Y';
    (<any>selectedItem.style)[this.plt.Css.transform] = `translate${coordStr}(${diff}px)`;
  }

  private onDragEnd(ev: any) {
    const selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    const toIndex = this.lastToIndex;
    const fromIndex = indexForItem(selectedItem);
    const reorderInactive = () => {
      this.selectedItemEle.style.transition = '';
      this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
      this.selectedItemEle = null;
    };
    if (toIndex === fromIndex) {
      selectedItem.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }
    this.reorderList._reorderEmit(fromIndex, toIndex);
  }

  private itemForCoord(coord: PointerCoordinates): HTMLElement {
    //const sideOffset = this.reorderList._isStart === this.plt.isRTL ? -100 : 100;
    const x = coord.x; //this.offset.x + sideOffset;
    const y = coord.y;
    const element = this.plt.getElementFromPoint(x, y);
    return findReorderItem(element, this.reorderList.getNativeElement());
  }

  /*private scroll(posY: number): number {
    if (posY < AUTO_SCROLL_MARGIN) {
      this.lastScrollPosition = this.reorderList._scrollContent(-SCROLL_JUMP);
    } else if (posY > this.windowHeight) {
      this.lastScrollPosition = this.reorderList._scrollContent(SCROLL_JUMP);
    }
    return this.lastScrollPosition;
  }*/

  /**
   * @hidden
   */
  destroy() {
    this.onDragEnd(null);
    this.events.destroy();
    this.events = null;
    this.reorderList = null;
  }
}

export enum Direction {
  Horizontally = 'h',
  Vertically = 'y'
};

const HORIZONTALLY = 'h';
const AUTO_SCROLL_MARGIN = 60;
//const SCROLL_JUMP = 10;
const ITEM_REORDER_ACTIVE = 'reorder-active';

export interface ItemReorderGestureDelegate {
  //_isStart: boolean;
  getNativeElement: () => any;
  _reorderPrepare: () => void;
  //_scrollContent: (scrollPosition: number) => number;
  _reorderStart: () => void;
  _reorderMove: (fromIndex: number, toIndex: number, itemHeight: number) => void;
  _reorderEmit: (fromIndex: number, toIndex: number) => void;
}