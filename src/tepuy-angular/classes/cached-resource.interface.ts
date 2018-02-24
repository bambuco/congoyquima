export enum ResourceType {
    Image
}

export interface CachedResource {
  type: ResourceType;
  loaded: boolean;
  loading: boolean;
  loadingObservable: any;
  item: any;  

  load(url: string): any;
}
