import { Component } from '@angular/core';

import { ViewController, ModalController } from 'ionic-angular';

import { SignPage } from '../sign/sign';
import { AboutPage } from '../about/about';
import { ConfigPage } from '../config/config';

@Component({
  template: `
    <ion-list class="config-popover">
      <ion-item (click)="register()">
        <ion-icon name="person" item-end></ion-icon>
        <ion-label>Registro</ion-label>
      </ion-item>
      <ion-item (click)="config()">
        <ion-icon name="settings" item-end></ion-icon>
        <ion-label>Configuración</ion-label>
      </ion-item>
      <ion-item (click)="about()">
        <ion-icon name="information-circle" item-end></ion-icon>
        <ion-label>Acerca de</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class ConfigPopover {
  constructor(private modalCtrl: ModalController,
    private viewCtrl: ViewController) {
  }

  register() {
    this.viewCtrl.dismiss();
    this.modalCtrl.create(SignPage).present();
  }

  about() {
    this.viewCtrl.dismiss();
    this.modalCtrl.create(AboutPage).present();
  }

  config() {
    this.viewCtrl.dismiss();
    this.modalCtrl.create(ConfigPage).present();
  }
}