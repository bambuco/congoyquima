import { Injectable } from '@angular/core';


export const Errors = {
  InvalidGroupSize: 'tepuy-options-size is missing or has an invalid value. It is expected to be a number greather than or equal 2',
  InvalidWinScore: 'Invalid win score value provide. It must be a value between 0 and 1',
  EventEmitterNotRegistered: 'No event emitter registered for ${eventName}'
}

@Injectable()
export class TepuyErrorProvider {
  constructor() {

  }

  raise(message:string) {
    throw new Error(message);
  }

}