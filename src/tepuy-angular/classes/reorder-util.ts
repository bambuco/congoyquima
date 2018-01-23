export interface PointerCoordinates {
  x?: number;
  y?: number;
}

/**
 * @hidden
 */
export function indexForItem(element: any): number {
  return element['$ionIndex'];
}

/**
 * @hidden
 */
export function reorderListForItem(element: any): any {
  return element['$ionReorderList'];
}

/**
 * @hidden
 */
export function findReorderItem(node: any, listNode: any): HTMLElement {
  let nested = 0;
  while (node && nested < 4) {
    if (indexForItem(node) !== undefined) {
      if (listNode && node.parentNode !== listNode) {
        return null;
      }
      return node;
    }
    node = node.parentNode;
    nested++;
  }
  return null;
}

export function pointerCoord(ev: any): PointerCoordinates {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      var touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    var pageX = ev.pageX;
    if (pageX !== undefined) {
      return { x: pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
}