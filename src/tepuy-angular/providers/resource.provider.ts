import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';

import { CachedResource, ResourceType } from '../classes/cached-resource.interface';
import { HashMap } from '../classes/hashmap.class';
import * as resourceFactory from '../classes/resource-factory'; 


export interface Resource {
  url: string;
  type: ResourceType
}

@Injectable()
export class ResourceProvider {
  private cachedResources: HashMap<CachedResource>;

  constructor() {
    this.cachedResources = new HashMap<CachedResource>();
  }

  public getResource(res: Resource) {
    let resource = this.cachedResources.get(res.url);
    if (resource && resource.type == res.type && resource.loaded) {
      return Observable.of(resource.item);
    } else if (resource && resource.type == res.type && resource.loading) {
      return resource.loadingObservable;
    } else {
      resource = resourceFactory.createCachedResource(res.type);
      this.cachedResources.put(res.url, resource);
      return resource.load(res.url);
    }
  }

  public preload(resources: Resource[]) {
    if (!resources) resources = [];
    return Observable.from(resources).concatMap(res => this.getResource(res));
  }
}