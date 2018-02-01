import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'objectkey'})
export class ObjectKeyPipe implements PipeTransform {

  transform(word: any): string {
    if (!word) {
      return word;
    }
    let val = word.normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g, "").toLowerCase();
    return val.replace(/[\u0303]/g, 'h');
  }
} //U+00F1