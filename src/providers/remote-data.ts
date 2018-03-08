import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { AppConfigProvider } from './app-config';
import { AppDataProvider } from './app-data';
import { encrypt, decypher } from './utils';

import { GAME_FACTS_NEXT_KEY, GAME_FACTS_NEXT_KEY_TO_SYNC } from './constants';

@Injectable()
export class RemoteDataProvider {
  private apiUrl: string;
  private IV: string;
  private pubKey: string;

  constructor(
    config:AppConfigProvider,
    private http: HttpClient,
    private appData: AppDataProvider,
    private storage: Storage
  ) {
    this.apiUrl = config.get('api.url', '');
    this.apiUrl = this.apiUrl.replace(/[\/\s]+$/, '');
    this.IV = config.get('cypher.IV');
    this.pubKey = config.get('public.key');
  }

  register(registryinfo:any) {
    const payload = { registryinfo: encrypt(JSON.stringify(registryinfo), this.pubKey) };

    return this.http.post<any>(this.apiUrl+"/registries", payload)
      .map((response) => {
        return { token: decypher(response.token, registryinfo.password, this.IV) };
      });
  }

  registerGameFacts(gameFacts: any, onErrorStore:boolean = true) {
    const online = this.appData.getMemory('onLine');
    const registryinfo = this.appData.getMemory('registryinfo');   
    return new Promise((resolve, reject) => {
      if (online) {
        gameFacts.uuid = registryinfo.uuid;
        gameFacts.token = registryinfo.token;
        let payload = { traceinfo: encrypt(JSON.stringify(gameFacts), this.pubKey) };
        this.http.post<any>(this.apiUrl+"/tracers", payload)
          .subscribe(() => {
            //remote call succeed, nothing else to do
            resolve(true);
          }, () => {
            //Store it locally for later synchronization
            if (onErrorStore) {
              this.storeFactsLocally(gameFacts);
            }
            resolve(false);
          });
      }
      else {
        //Store it for later synchronization
        if (onErrorStore) {
          this.storeFactsLocally(gameFacts);
        }
        resolve(false);
      }
    });
  }

  private storeFactsLocally(gameFacts:any) {
    let nextKey = this.appData.get(GAME_FACTS_NEXT_KEY, 0);
    let lastSyncedKey = this.appData.get(GAME_FACTS_NEXT_KEY_TO_SYNC, null);
    this.storage.set(`facts_${nextKey}`, gameFacts)
      .then(() => {
        this.appData.set(GAME_FACTS_NEXT_KEY, nextKey + 1);
      });

    if (lastSyncedKey == null) {
      this.appData.set(GAME_FACTS_NEXT_KEY_TO_SYNC, nextKey);
    }
  }
}
