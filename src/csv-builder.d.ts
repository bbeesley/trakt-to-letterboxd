declare module 'csv-builder' {
  import type { Readable, Transform } from 'node:stream';

  export = CsvBuilder;

  class CsvBuilder {
    constructor(...args: any[]);

    alias(...args: any[]): CsvBuilder;

    createReadStream(...args: any[]): Readable;

    createTransformStream(...args: any[]): Transform;

    getHeaders(...args: any[]): string;

    getRow(...args: any[]): string;

    headers(...args: any[]): CsvBuilder;

    set(...args: any[]): CsvBuilder;

    virtual(...args: any[]): CsvBuilder;
  }
}
