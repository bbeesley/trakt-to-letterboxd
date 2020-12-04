import sinon from 'sinon';
import mapper, { __RewireAPI__ as RewireAPI } from '../../main/mapper';
import {
    expect, it, beforeEach, afterEach,
} from './helpers';
import traktMergedData from '../mocks/traktMergedData';
import expected from '../mocks/letterboxdData';

describe('mapper.js', () => {
    describe('mapper', () => {
        it('converts an array of trakt data to letterboxd data', () => {
            const res = mapper(traktMergedData);
            expect(res).to.deep.equal(expected);
        });

        it('converts an array of trakt watchlist data to letterboxd data', () => {
            const res = mapper(traktMergedData, true);
            expect(res).to.deep.equal(
                expected.map((val) => {
                    val.WatchedDate = undefined;
                    return val;
                }),
            );
        });
    });
});
