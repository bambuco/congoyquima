import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContentProvider {
  private contents: any;


  constructor(private http: HttpClient) {
  }

  list(type) {
    return this.http.get(['./assets/content/', type, '/index.json'].join(''));
  }

  content(id) {
    return this.contents[id];
  }

}
