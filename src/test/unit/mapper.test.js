import sinon from 'sinon';
import mapper, { __RewireAPI__ as RewireAPI } from '../../main/mapper';
import {
    expect,
    it,
    beforeEach,
    afterEach,
} from './helpers';
import traktData from '../mocks/traktData';
import expected from '../mocks/letterboxdData';

describe('mapper.js', () => {
    describe('mapper', () => {
        it('converts an array of trakt data to letterboxd data', () => {
            const res = mapper(traktData);
            expect(res).to.deep.equal(expected);
        });
    });
});
