import { Injectable } from '@angular/core';

import * as elementResizeDetectorMaker from 'element-resize-detector';

@Injectable()
export class ResizeSensor {

  private erd;
  constructor() { 
    this.erd = elementResizeDetectorMaker({ strategy: "scroll" });
  }

  listenTo(element: HTMLElement, callback: (elem: HTMLElement) => void): void {
    this.erd.listenTo(element, callback);
  }
  removeListener(element: HTMLElement, callback: (elem: HTMLElement) => void): void {
    this.erd.removeListener(element, callback);
  }
  removeAllListeners(element: HTMLElement): void {
    this.removeAllListeners(element);
  }
  
  uninstall(element: HTMLElement): void {
    this.erd.uninstall(element);
  }
}