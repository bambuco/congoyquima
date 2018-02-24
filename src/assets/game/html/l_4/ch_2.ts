import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';

const MIN_CELL_SIZE = 45;

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L4Ch2Component {
    cellStyle:any;
    cellSize: number;
    rowHStyle:any;
    colHStyle:any;
    celHStyle:any;
    dimensions: number;
    matrix: number[][];
    private groups:any[];
    private observers:Subject<boolean>[];
    private resized: boolean;
    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.groups = [];
      this.observers = [];
      for(let k = 0; k < 5; k++) {
        this.observers.push(new Subject());
      }
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, group, value2) {
      group.data2 = value2;
      this.groups.push(group);
      group.ready$ = this.observers[group.id];
      if (this.resized) {
        this.setGroupData(group);
      }
    }

    setGroupData(group) {
      let rstart = this.findRangeStart(group.data);
      let cstart = this.findRangeStart(group.data2);
      let matrix = new Array(this.dimensions+1);
      for(let i = 0, iLen = this.dimensions+1; i < iLen; i++) {
        matrix[i] = new Array(this.dimensions+1);
        for(let k = 0; k < iLen; k++) {
          matrix[i][k] = (i == 0 ? (k == 0 ? 0 : k + cstart) : (k == 0 ? i + rstart : (i + rstart) * (k + cstart)));
        }
      }

      let correct_pattern = '(' + (group.data - rstart - 1) + (group.data2 - cstart - 1);
      correct_pattern += '|' + (group.data2 - rstart - 1) + (group.data - cstart - 1) + ')';
      setTimeout(() => {
        this.ngZone.run(() => {
          group.matrix = matrix;
          group.answer = new RegExp(correct_pattern);
          group.ready$.next(true);
        });
      }, 0);
    }

    @HostListener('window:resize', ['$event'])
    onResize(el) {
      setTimeout(() => {
        this.calculateDimensions(this.elRef.nativeElement);
      }, 400);
    }

    calculateDimensions(el) {
      const rect = this.platform.getElementBoundingClientRect(this.elRef.nativeElement);
      const maxHeight = rect.height * 0.7 * 0.9;
      let size = Math.min(maxHeight, rect.width * 0.95);
      let dimensions = 10;
      let cellSize = size / (dimensions + 1);
      if (cellSize < MIN_CELL_SIZE) {
        cellSize = MIN_CELL_SIZE;
        dimensions = Math.floor(size / cellSize) - 1;
      }
      this.cellSize = cellSize;
      this.rowHStyle = {
        'top.px': -4,
        'left.px': -4,
        'width.px': cellSize + 8,
        'height.px': cellSize + 8
      };
      this.colHStyle = Object.assign({}, this.rowHStyle);
      this.celHStyle = Object.assign({}, this.rowHStyle);
      this.dimensions = dimensions;

      this.groups.forEach((g) => {
        this.setGroupData(g);
      });
      this.resized = true;
      this.ngZone.run(() => {
        this.cellStyle = { 
          'width.px': cellSize,
          'height.px': cellSize,
          'fontSize.px': cellSize * .6,
          'lineHeight.px': cellSize
        };
      });
    }

    onSelect(i, k, group) {
      group.R = i;
      group.C = k;
      group.I = (i + 1) * (k + 1);

      this.celHStyle['top.px'] = this.rowHStyle['top.px'] = ((i+1) * this.cellSize) - 4;
      this.celHStyle['left.px'] = this.colHStyle['left.px'] = ((k+1) * this.cellSize) - 4;
      group.status = (group.answer.test(''+i+k) ? 'correct' : 'wrong');
    }

    onReset() {
      this.groups = [];
    }

    private findRangeStart(value) {
      let start = value - Math.floor(this.dimensions / 2);
      let delta = this.dimensions - (10 - start + 1);
      if (delta > 0) {
        start = start - delta;
      }
      return Math.max(0, --start);
    }
  }
  return L4Ch2Component;
}