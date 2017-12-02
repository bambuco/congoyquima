import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GameDataProvider {
  constructor(private http: HttpClient) {
  }

  levels() {
    //return this.http.get(['./assets/game/game.json'].join(''));
  }
}
