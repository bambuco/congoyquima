import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'spell'})
export class SpellPipe implements PipeTransform {

  transform(word: any): string {
    if (!word) {
      return word;
    }
    return word.split('');
  }
}