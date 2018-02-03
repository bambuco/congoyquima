import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'sumofdigits'})
export class SumOfDigitsPipe implements PipeTransform {

  transform(value: number, digits?:number): string[] {
    let str = value+'';
    if (digits) {
      str = this.padStart(str, '0', digits);
    }
    return str.split('').join('+').split('');
  }

  private padStart(str:string, padChar:string, len:number):string {
    while(str.length < len) {
      str = padChar + str;
    }
    return str;
  }
}