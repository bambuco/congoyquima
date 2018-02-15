export class HashMap<V>{
  private data: { [key: string]: V };
  private size: number;

  constructor() {
    this.data = {};
    this.size = 0;
  }

  public put(key: string, value: V) {
    this.data[key] = value;
    this.size++;
  }

  public get(key: string): V {
    if (!this.containsKey(key)) {
      return null;
    } else {
      return this.data[key];
    }
  }

  public remove(key: string): V {
    if (!this.containsKey(key)) {
      return null;
    } else {
      const val: V = this.data[key];
      delete this.data[key];
      this.size--;
      return val;
    }
  }

  public length(): number {
    return this.size;
  }

  public containsKey(key: string): boolean {
    return this.data.hasOwnProperty(key);
  }
}