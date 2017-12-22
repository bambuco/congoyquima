import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'objectkey'})
export class ObjectKeyPipe implements PipeTransform {

  transform(word: any): string {
    if (!word) {
      return word;
    }
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
}