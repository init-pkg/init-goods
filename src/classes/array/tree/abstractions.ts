export type MapCallBack<T, R extends object | void = void, P = T> = (
  item: T,
  index: number,
  parent: P,
  array: T[]
) => R;
export type FlatMapCallback<T, R> = (item: T, index: number, array: T[]) => R;

export type FlattenedObject<T extends object = object> = T & {
  parent: T[keyof T] | null;
  depth: number;
};

export interface FlattenerOptions {
  withChildren?: boolean;
}
