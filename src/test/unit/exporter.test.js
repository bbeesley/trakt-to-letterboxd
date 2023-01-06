import test from 'ava';
import CsvBuilder from 'csv-builder';
import builder from '../../main/exporter.js';

test('exporter.js - builder - is an instanceof CsvBuilder', (t) => {
  t.true(builder instanceof CsvBuilder);
});
