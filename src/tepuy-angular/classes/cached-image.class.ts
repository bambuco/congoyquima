import { Observable } from 'rxjs/Observable';
import { CachedResource, ResourceType } from './cached-resource.interface';

export class CachedImage implements CachedResource {
  public type: ResourceType = ResourceType.Image;
  public loaded: boolean = false;
  public loading: boolean = false;
  public loadingObservable: Observable<HTMLImageElement> = null;
  public item: HTMLImageElement;

  public load(imgUrl: string) {
    this.item = new Image();
    this.item.src = imgUrl;
    this.loadingObservable = Observable.create((x: any) => this.createObservable(x));
    return this.loadingObservable;
  }

  private createObservable(observer: any) {
    let self = this;
    self.loading = true;
    this.item.onload = function() {
      self.loaded = true;
      self.loading = false;
      observer.next(this);
      observer.complete();
    };
    this.item.onerror = function(err) {
      self.loading = false;
      observer.error(err);
    };
  }

}