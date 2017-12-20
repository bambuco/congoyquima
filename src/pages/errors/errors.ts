import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ErrorDetailComponent } from './error-detail';


const errors_key:string = 'APP_ERRORS';

@Component({
  selector: 'page-errors',
  templateUrl: 'errors.html'
})
export class ErrorsPage {
  noContent: boolean = false;
  errors: Observable<any>;

  constructor(private navCtrl: NavController,
      private modalCtrl: ModalController,
      private storage: Storage,
  ) {
    let promise = this.storage.get(errors_key).then((result) => {
      if (result == null) result = [];
      this.noContent = !result.length;
      return result;
    });
    this.errors = Observable.fromPromise(promise);
  }

  goHome(){
    this.navCtrl.setRoot(HomePage);
  }

  viewDetails(item) {
    const modal = this.modalCtrl.create(ErrorDetailComponent, { item: item });
    modal.present();
  }

}
