import { Component } from '@angular/core';

import { PopoverController, ViewController, ModalController } from 'ionic-angular';

import { AboutPage } from '../about/about';

@Component({
  template: `
    <ion-list class="config-popover">
      <!--ion-item (click)="config()">
        <ion-label>Configuración</ion-label>
      </ion-item-->
      <ion-item (click)="about()">
        <ion-label>Acerca de</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class ConfigPopover {
  constructor(private modalCtrl: ModalController,
    private viewCtrl: ViewController) {
  }

  config() {
    this.viewCtrl.dismiss();
  }

  about() {
    this.viewCtrl.dismiss();
    this.modalCtrl.create(AboutPage).present();
  }
}