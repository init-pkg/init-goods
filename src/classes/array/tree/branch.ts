import { MapCallBack } from "./abstractions";

export class Branch<T extends object> {
  private data: T;
  private childrenKey: keyof T;

  constructor(data: T, childrenKey: keyof T) {
    this.data = data;
    this.childrenKey = childrenKey;
  }

  private construct = this.constructor as new (
    data: T,
    childrenKey: keyof T
  ) => Branch<T>;

  get object() {
    return this.data;
  }

  get children(): T[] {
    return this.data[this.childrenKey] as T[];
  }

  set children(children: ArrayLike<T>) {
    this.data[this.childrenKey] = Array.from(children) as T[keyof T];
  }

  mapChildrenRecursively<R extends object>(callback: MapCallBack<T, R>): R[] {
    return this.children.map<R>((item, index, array) => {
      const itemTree = new this.construct(item, this.childrenKey);
      const mappedChildren = callback(item, index, this.data, array);
      const newChildren = itemTree.mapChildrenRecursively(callback);
      return { ...mappedChildren, [this.childrenKey]: newChildren };
    });
  }

  forEachChildrenRecursively(callback: MapCallBack<T, void>) {
    this.children.forEach((item, index, array) => {
      const itemTree = new this.construct(item, this.childrenKey);
      callback(item, index, this.data, array);
      itemTree.forEachChildrenRecursively(callback);
    });
  }
}
