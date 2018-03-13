import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ViewController, AlertController } from 'ionic-angular';

import { AppDataProvider } from '../../providers/app-data';
import { RemoteDataProvider } from '../../providers/remote-data';

import { REGISTRY_INFO_KEY } from '../../providers/constants';

@Component({
  selector: 'page-sign',
  templateUrl: 'sign.html'
})
export class SignPage {
  password: string = "";
  username: string = "jotero";
  displayname: string = "Jesus Otero";
  registrationResult: any;
  form: FormGroup;

  private registryinfo:any;

	constructor(private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private appData: AppDataProvider,
    private remoteData: RemoteDataProvider
  ) {
    
	}

  ngOnInit() {

    let registryinfo = this.appData.get(REGISTRY_INFO_KEY);
    this.form = this.formBuilder.group({
      username: [registryinfo.username, Validators.required],
      displayname: [registryinfo.displayname]
    });

    this.registryinfo = registryinfo;
  }

	dismiss() {
		this.viewCtrl.dismiss();
	}

  doRegistration(form:FormGroup) {

    if (form.invalid) return;

    let registryinfo:any = {
      uuid: this.registryinfo.uuid,
      password: this.registryinfo.password,
      username: form.controls['username'].value,
      displayname: form.controls['displayname'].value
    };

    this.remoteData.register(registryinfo)
      .subscribe((result) => {
        registryinfo.token = result.token;
        this.appData.set(REGISTRY_INFO_KEY, registryinfo)
          .then(() => {
            this.appData.setMemory(REGISTRY_INFO_KEY, registryinfo);
            Object.assign(this.registryinfo, registryinfo);
          });
        
        this.alertCtrl.create({
          title: '¡Registro exitoso!',
          subTitle: 'El registro se ha completado exitosamente!',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.dismiss();
            }
          }]
        }).present();
      }, (error) => {
        this.alertCtrl.create({
          title: '¡Registro fallido!',
          subTitle: 'El registro no se ha podido completar. Intente nuevamente mas tarde',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.dismiss();
            }
          }]
        }).present();
      });
  }
}