import { Component, Type, ViewEncapsulation, ElementRef, NgZone, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ShufflePipe } from 'ngx-pipes';
import { rand } from '../utils';

const MIN_CELL_SIZE = 45;

export function componentBuilder(template:string, css:string): Type<any> {
  @Component({
    selector: 'mini-game',
    template: template,
    styles: [ css || '' ],
    encapsulation: ViewEncapsulation.None
  })
  class L4Ch3Component {
    cellStyle:any;
    cellSize: number;
    dimensions: number;
    matrix: any[][];
    ready$: Subject<boolean>;
    enabled: boolean;
    showSelector: boolean;
    activeCell: any;
    options: any[];    
    private shuffle:ShufflePipe;
    private x:number;
    private y:number;
    private resized:boolean;

    constructor(private elRef: ElementRef,
        private ngZone: NgZone,
        private platform: Platform) {
      this.shuffle = new ShufflePipe();
      this.ready$ = new Subject();
    }

    ngOnInit() {
      this.onResize(null);
    }

    prepare($event, x, y) {
      this.x = x;
      this.y = y;
      if (this.resized) {
        this.setMatrixData(x, y);
      }
    }

    setMatrixData(x, y) {
      let rstart = this.findRangeStart(x);
      let cstart = this.findRangeStart(y);
      let matrix = new Array(this.dimensions+1);
      //Prepare matrix
      for(let i = 0, iLen = this.dimensions+1; i < iLen; i++) {
        matrix[i] = new Array(this.dimensions+1);
        for(let k = 0; k < iLen; k++) {
          const val = (i == 0 ? (k == 0 ? 0 : k + cstart) : (k == 0 ? i + rstart : (i + rstart) * (k + cstart)))
          matrix[i][k] = {
            val: val,
            text: val
          };
        }
      }
      //Define missings
      let missingPos = [];
      let missingValues = [];
      //Get the missing values
      while (missingPos.length < 6) {
        let pos = rand(this.dimensions**2-1);
        if (missingPos.indexOf(pos) < 0) {
          let i = Math.floor(pos / this.dimensions) + 1;
          let j = (pos % this.dimensions) + 1;
          let cell = matrix[i][j];
          if (missingValues.indexOf(cell.val) < 0) {
            missingPos.push(pos);
            missingValues.push(cell.val);
            cell.missing = true;
            cell.text = '&nbsp;'; //Leave it empty
            cell.options = [ cell.val ];
            //Define distractors
            while (cell.options.length < 3) {
              let option = rand(100, 1);
              if (cell.options.indexOf(option) < 0) {
                cell.options.push(option);
              }
            }
            cell.options = this.shuffle.transform(cell.options);
          }
        }
      }      
      //Make it render
      setTimeout(() => {
        this.ngZone.run(() => {
          this.matrix = matrix;
          this.enabled = true;
          this.ready$.next(true);
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
      this.dimensions = dimensions;

      this.resized = true;
      this.setMatrixData(this.x, this.y);
      this.ngZone.run(() => {
        this.cellStyle = { 
          'width.px': cellSize,
          'height.px': cellSize,
          'fontSize.px': cellSize * .6,
          'lineHeight.px': cellSize
        };
      });
    }

    onFill(ev, cell) {
      if (!this.enabled || !cell.missing) {
          return
      }
      //assign the item if not assigned yet
      if (!cell.item) {
        let el = ev.target.querySelector('input');
        cell.item = el.$tepuyItem;
      }
      cell.active = true;
      this.activeCell = cell;
      this.options = cell.options.slice(0);
      this.showSelector = true;
    }

    onSelect(it) {
      let cell = this.activeCell;
      cell.text = it;
      cell.active = false;
      cell.item.isCorrect = (it == cell.val);
      cell.item.answered = true;
      cell.item.value = it;
      this.activeCell = null;
      this.showSelector = false;
    }

    onComplete(result) {
      this.showSelector = false; //Just in case is opened.
      this.enabled = false;
    }

    onReset() {
      this.ready$.next(false);
      this.matrix = [];
    }

    bdClick() {
      this.showSelector = false;
      this.activeCell.active = false;
      this.activeCell = null;
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
  return L4Ch3Component;
}