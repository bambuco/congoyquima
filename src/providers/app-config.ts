import { Injectable } from '@angular/core';



declare function require(moduleName: string): any;
const config = require('../app.config.json');

@Injectable()
export class AppConfigProvider {

  constructor() {
  }

  ionViewCanEnter() {

  }

  get(key:string, defaultValue?:any):any {
    let v = config && config[key];
    return v === undefined ? defaultValue : v;
  }
}
