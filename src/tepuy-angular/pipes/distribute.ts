import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'distribute'})
export class DistributePipe implements PipeTransform {

  transform(arr: any, max:number): any[] {
    if (!Array.isArray(arr)) {
      return arr;
    }

    if (arr.length > max) {
        throw new RangeError("DistributePipe: more elements in the array than positions to distribute");
    }

    let copy = arr.slice(0);
    let len = copy.length;
    let used = new Array(len);
    let val;
    console.log(max);
    while(len--) {
      do {
        val = Math.floor(Math.random() * max);
      } while(used[val])      
      used[val] = true;
      copy[len].pos = val + 1;
    }
    return copy;
  }
}