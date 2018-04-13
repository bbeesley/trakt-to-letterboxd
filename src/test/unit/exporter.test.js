import sinon from 'sinon';
import CsvBuilder from 'csv-builder';
import builder from '../../main/exporter';
import {
    expect,
    it,
} from './helpers';

describe('exporter.js', () => {
    describe('builder', () => {
        it('is an instanceof CsvBuilder', () => {
            expect(builder).to.be.an.instanceof(CsvBuilder);
        });
    });
});
