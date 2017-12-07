import { Injectable } from '@angular/core';


export const Errors = {
  InvalidGroupSize: 'tepuy-options-size is missing or has an invalid value. It is expected to be a number greather than or equal 2'
}

@Injectable()
export class TepuyErrorProvider {
  constructor() {

  }

  raise(message:string) {
    throw new Error(message);
  }

}