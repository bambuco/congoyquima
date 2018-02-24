import { CachedResource, ResourceType } from './cached-resource.interface';
import { CachedImage } from './cached-image.class';

export function createCachedResource(type: ResourceType) {
  if (type == ResourceType.Image) {
    let img = new CachedImage();
    img.type = type;
    return img;
  }
  throw new Error('Unknow resource type ' + type);
}