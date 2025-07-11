import {
  FlatMapCallback,
  FlattenedObject,
  FlattenerOptions,
  MapCallBack,
} from "./abstractions";
import { Branch } from "./branch";

/**
 * @template T - type of entity. Must include children field as same array
 * @param treeArray - array as a tree-like sturcture
 * @param childrenKey - definition of key, that contains children
 */
export class Tree<T extends object> extends Array<T> {
  private childrenKey: keyof T;

  constructor(treeArray: ArrayLike<T>, childrenKey: keyof T) {
    super(...Array.from(treeArray));
    this.childrenKey = childrenKey;
  }

  private findParentsInTree(
    targetField: keyof T,
    targetValue: unknown,
    options: T[],
    parents: T[] = []
  ): T[] {
    for (const item of options) {
      const children = item[this.childrenKey] as T[];

      if (children.length > 0) {
        const foundInChildren = this.findParentsInTree(
          targetField,
          targetValue,
          children,
          [...parents, item]
        );
        if (foundInChildren.length > 0) return foundInChildren;
      }

      if (item[targetField] === targetValue) {
        return parents;
      }
    }
    return [];
  }

  get flatLength() {
    let length = 0;
    this.recursiveForEach(() => length++);
    return length;
  }

  /**
   * @function getParents
   * @param field - key of item field to search for
   * @param value - value of item field to search for
   * @returns array of ancestors of the target item
   */
  getParents(field: keyof T, value: unknown): T[] {
    return this.findParentsInTree(field, value, this);
  }

  getClosestParent(field: keyof T, value: unknown): T | null {
    const parents = this.getParents(field, value);
    const result = parents[parents.length - 1];
    if (!result) return null;
    return result;
  }

  getChildren(field: keyof T, value: unknown): T[] {
    const foundElement = this.find((item) => item[field] === value);
    return foundElement ? (foundElement[this.childrenKey] as T[]) : [];
  }

  /**
   * @function deepSearch - searches for an item in the array of items and their children
   * @param field - key of item field to search for
   * @param value - value of item field to search for
   * @returns found item or undefined
   */
  deepSearch(field: keyof T, value: unknown): Branch<T> | undefined {
    for (const option of this) {
      if (option[field] == value) {
        return new Branch(option, this.childrenKey);
      }

      const children = option[this.childrenKey] as T[];

      if (children && children.length > 0) {
        // Create a new Tree instance for children and search recursively
        const childrenTree = new Tree(children, this.childrenKey);
        const found = childrenTree.deepSearch(field, value);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   *
   * @param field - key of item field to search in a whole tree
   * @param descendantValue - value of item field to search for
   * @param divider - string divider that will be used during concatination. Deafult is `,`
   * @param direction - defines concatination direction
   * @example
   * "default": parent -> children
   * "reversed": children -> parent
   * @returns string that based on found value and value of it's ancestors
   */

  joinHierachically(
    field: keyof T,
    descendantValue: unknown,
    divider = ", ",
    direction: "default" | "reversed" = "default"
  ): string {
    const target = this.deepSearch(field, descendantValue)?.object;
    if (!target) return "Item not found";
    const parents = this.findParentsInTree(field, target[field], this);
    const values = parents.map((parent) => parent[field]);
    values.push(target[field]);
    return direction === "default"
      ? values.join(divider)
      : values.reverse().join(divider);
  }

  recursiveForEach(callback: MapCallBack<T, void, T | null>) {
    this.forEach((item, index, array) => {
      const branch = new Branch(item, this.childrenKey);
      callback(item, index, null, array);
      branch.forEachChildrenRecursively(callback);
    });
  }

  flattern(
    uniqueKey: keyof T,
    options?: FlattenerOptions
  ): FlattenedObject<T>[] {
    const result: FlattenedObject<T>[] = Array(this.flatLength);
    const { withChildren = false } = options || {};

    let globalIndex = 0;

    this.recursiveForEach((item) => {
      const parent = this.getClosestParent(uniqueKey, item[uniqueKey]);

      result[globalIndex] = {
        ...item,
        [this.childrenKey]: withChildren ? (item[this.childrenKey] as T[]) : [],
        depth: this.getParents(uniqueKey, item[uniqueKey]).length,
        parent: parent?.[uniqueKey] ?? null,
      } as FlattenedObject<T>;

      globalIndex++;
    });

    return result;
  }

  flatternAndMap<R>(
    uniqueKey: keyof T,
    callback: FlatMapCallback<T, R> = (item) => item[uniqueKey] as R
  ): R[] {
    const result = this.flattern(uniqueKey);
    return result.map(callback);
  }

  toArray() {
    return Array.from(this);
  }

  static transformToTree<T extends object, R extends T = T & { children: T[] }>(
    array: T[],
    parentKey: keyof T,
    uniqueKey: keyof T,
    childrenKey: keyof R = "children" as keyof R
  ): Tree<R> {
    // Helper function to recursively build the tree
    const buildTree = (parentValue: unknown): R[] => {
      const children = array.filter((item) => item[parentKey] === parentValue);

      return children.map((child) => {
        // Create a new object with the children property
        const result = { ...child } as R;

        // Recursively find children for this item
        const childNodes = buildTree(child[uniqueKey]);
        result[childrenKey] = childNodes as R[keyof R];

        return result;
      });
    };

    // Find root items (items with null/undefined parent)
    const rootItems = buildTree(null);

    return new Tree(rootItems, childrenKey as keyof R);
  }
}
