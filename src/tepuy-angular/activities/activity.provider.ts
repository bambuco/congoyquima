import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { TepuyUtils } from '../tepuy-utils';
//import { TepuyActivityService } from '../activity/activity.provider';

@Injectable()
export class TepuyActivityService {
  protected id: string;
  protected observers: any = {};

  constructor() {
    this.registerEvent('activityVerified');
    this.registerEvent('verifyRequested');
    this.registerEvent('activityReset');
  }

  childId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  /**
   * Evaluates the result of the activity.
   * @emit {event} {id: activityId, score: the score for the activity }
   */  
  verify() {
    this.emit('activityVerified', {id:'00000'});
  }

  /**
   * Evaluates the result of the activity.
   * @emit {event} {id: activityId, score: the score for the activity }
   */  
  restart() {
    this.emit('activityReset');
  }
  /**
   * Get and observable to subscribe to events on this service.
   * @eventName {string} Event name to subscribe
   * returns observable for subscription
   */  
  on(eventName: string): Observable<any> {
    if (!(eventName in this.observers)) throw Error('No event emitter registered for: ' + eventName);
    return this.observers[eventName];
  }

  /**
   * Evaluates the result of the activity.
   * @emit {event} {id: activityId, score: the score for the activity }
   */  
  emit(eventName:string, eventData?:any) {
    if (!(eventName in this.observers)) throw Error('No event emitter registered for: ' + eventName);
    this.observers[eventName].next(eventData);
  }

  /**
   * Register an event users of this service will be able to listen to.
   * @eventName {string} The name of the event to register
   */  
  registerEvent(eventName: string){
    if (eventName in this.observers) return; 
    this.observers[eventName] = new ReplaySubject(1);
  }
}