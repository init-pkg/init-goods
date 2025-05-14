export type DoubleArray<T = unknown> = Array<Array<T>>;

export type MapMatrixCallback<T, R = unknown> = (
  item: T,
  row: number,
  col: number,
  array: DoubleArray<T>
) => R;

export class Matrix<T> extends Array<T[]> {
  constructor(matrix: Iterable<T[]>) {
    super(...Array.from(matrix));
  }

  static generateMatrix<T>(rows: number, cols: number, fill: T) {
    const result: DoubleArray<T> = Array.from({ length: rows }, () =>
      Array(cols).fill(fill)
    );
    return new this(result);
  }

  static sliceToMatrix<T>(elements: Iterable<T>, rowLength: number) {
    const array = Array.from(elements);
    const result: DoubleArray<T> = [];
    for (let i = 0; i < array.length; i += rowLength) {
      result.push(array.slice(i, i + rowLength));
    }
    return new this(result);
  }

  get cols() {
    const lengths = this.map((row) => row.length);
    return Math.max(...lengths);
  }

  get rows() {
    return this.length;
  }

  getElement(row: number, col: number): T | undefined {
    if (row < 0 || row >= this.length || col < 0 || col >= this[0].length) {
      return undefined;
    }
    return this[row][col];
  }

  flattern(): T[] {
    const result: T[] = [];
    this.forEach((item) => result.push(...item));
    return result;
  }

  flatMapMatrix<R = unknown>(callback: MapMatrixCallback<T, R>): R[] {
    const result: R[] = [];

    this.forEach((rowArray, row) =>
      rowArray.forEach((item, col) =>
        result.push(callback(item, row, col, this))
      )
    );

    return result;
  }

  mapMatrix<R = unknown>(callback: MapMatrixCallback<T, R>): DoubleArray<R> {
    return this.map((rowArray, row) =>
      rowArray.map((item, col) => callback(item, row, col, this))
    );
  }

  forEachMatrix(callback: MapMatrixCallback<T, void>): void {
    this.forEach((rowArray, row) =>
      rowArray.forEach((item, col) => callback(item, row, col, this))
    );
  }
}
