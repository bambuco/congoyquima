import { Component } from '@angular/core';

import { ViewController, Events } from 'ionic-angular';

import { AppDataProvider } from '../../providers/app-data';

import {
  WIFI_ONLY_KEY,
  WIFI_CONFIGURATION_EVENT,
  GAME_FACTS_NEXT_KEY_TO_SYNC,
  NETWORK_CONNECTED_EVENT
} from '../../providers/constants';


@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {
  wifiOnly: boolean;
  synced: boolean;
  syncColor: string;

  private syncInterval: any;
  private onLine: boolean = false;

	constructor(private viewCtrl: ViewController,
    private appData: AppDataProvider,
    private events: Events
  ) {
    
	}

  ngOnInit() {
    this.wifiOnly = this.appData.getConfig(WIFI_ONLY_KEY, true);

    this.checkSyncStatus();
  }

  ngOnDestroy() {
    clearInterval(this.syncInterval);
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

  syncNow() {
    this.events.publish(NETWORK_CONNECTED_EVENT, this.onLine);
  }

  private checkSyncStatus() {
    let key = this.appData.get(GAME_FACTS_NEXT_KEY_TO_SYNC, null);
    this.synced = (key == null);
    this.syncColor = (this.synced ? 'secondary' : 'danger');
    this.onLine = this.appData.getMemory('onLine');

    if (!this.synced) {
      this.syncInterval = setTimeout(() => {
        this.checkSyncStatus();
      }, 3000);      
    }
  }
}