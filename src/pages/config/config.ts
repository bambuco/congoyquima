import { Component } from '@angular/core';

import { ViewController, Events } from 'ionic-angular';

import { AppDataProvider } from '../../providers/app-data';

import { WIFI_ONLY_KEY, WIFI_CONFIGURATION_EVENT } from '../../providers/constants';


@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {
  wifiOnly: boolean;

	constructor(private viewCtrl: ViewController,
    private appData: AppDataProvider,
    private events: Events
  ) {
    
	}

  ngOnInit() {
    this.wifiOnly = this.appData.getConfig(WIFI_ONLY_KEY, true);
  }

	dismiss() {
		this.viewCtrl.dismiss();
	}

  onChange(key) {
    switch (key) {
      case "wifi":
        this.appData.setConfig(WIFI_ONLY_KEY, !this.wifiOnly).then(() => {
          this.wifiOnly = !this.wifiOnly;
          this.events.publish(WIFI_CONFIGURATION_EVENT, this.wifiOnly);
        });

        break;
      
      default:
        // code...
        break;
    }
  }
}