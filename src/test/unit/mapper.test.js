import test from 'ava';
import mapper from '../../main/mapper.js';
import traktMergedData from '../mocks/trakt-merged-data.js';
import expected from '../mocks/letterboxd-data.js';

test('mapper - converts an array of trakt data to letterboxd data', (t) => {
  const response = mapper(traktMergedData);
  t.deepEqual(response, expected);
});
test('mapper - converts an array of trakt watchlist data to letterboxd data', (t) => {
  const response = mapper(traktMergedData, true);
  t.deepEqual(
    response,
    expected.map((value) => {
      return { ...value, WatchedDate: null };
    }),
  );
});
