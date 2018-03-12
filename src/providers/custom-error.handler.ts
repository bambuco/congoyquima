import { IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

export function provideStorage() { return new Storage({ name: '__congoyquima' }) }
export function replaceErrors(key, value) {
    if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }
    return value;
}

const errors_key:string = 'APP_ERRORS';

export class CustomErrorHandler extends IonicErrorHandler {
  private storage;

  constructor() {
    super();
    this.storage = provideStorage();
  }

  handleError(err: any) {

    try{
      let obj = {};
      Object.getOwnPropertyNames(err).forEach(function (key) {
          obj[key] = err[key];
        }, this);

      let raw: string;
      try {
        raw = JSON.stringify(obj);
      }
      catch(err) {}

      let obj1 = {
        message: err.message,
        stack: err.stack,
        raw: raw
      };

      this.storage.get(errors_key).then((result:any) => {
        let errors = result == null ? [] : result;
        const now = new Date();
        errors.push({when: now.toISOString(), message: obj1.message, info: JSON.stringify(obj1, replaceErrors)});

        if (errors.length > 100 ) { //Just keep the last 100 errors
          errors.splice(0, 100 - errors.length);
        }

        this.storage.set(errors_key, errors).then(result => {
        })
        .catch((reason) => {
        });
      });
    }
    catch (err) {
      //DoNothing
    }
    //Keep calling ionic error handler for development.
    super.handleError(err);
  }
}

