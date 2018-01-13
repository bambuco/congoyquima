import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'objectkey'})
export class ObjectKeyPipe implements PipeTransform {

  transform(word: any): string {
    if (!word) {
      return word;
    }
    return word.normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g, "").toLowerCase();
  }
} //U+00F1