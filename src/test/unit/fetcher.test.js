import test from 'ava';
import { createSandbox } from 'sinon';
import nock from 'nock';
import fetchMovies from '../../main/fetcher.js';
import config from '../../main/config.js';
import traktData from '../mocks/trakt-data.js';
import traktRatingData from '../mocks/trakt-rating-data.js';
import letterboxdData from '../mocks/letterboxd-data.js';

test.serial.beforeEach((t) => {
  t.context.sandbox = createSandbox();
  t.context.requestsMade = [];
  t.context.scope = nock('https://api.trakt.tv', {
    reqheaders: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': config.clientId,
    },
  })
    .persist()
    .get(/.*/)
    .reply(200, (uri) => {
      t.context.requestsMade.push(uri);
      if (uri.includes('watched')) return JSON.parse(JSON.stringify(traktData));
      if (uri.includes('watchlist'))
        return JSON.parse(JSON.stringify(traktData));
      if (uri.includes('ratings'))
        return JSON.parse(JSON.stringify(traktRatingData));
    });
});
test.serial.afterEach((t) => {
  t.context.sandbox.restore();
  nock.cleanAll();
});
test.serial(
  'fetchMovies() - calls fetch with the correct url and options for the history',
  async (t) => {
    await fetchMovies('test');
    const url = 'https://api.trakt.context.tv/users/test/watched/movies';
    const ratingUrl = 'https://api.trakt.context.tv/users/test/ratings/movies';
    console.error(t.context.requestsMade);
    t.true(
      t.context.requestsMade.includes(
        url.replace('https://api.trakt.context.tv', ''),
      ),
    );
    t.true(
      t.context.requestsMade.includes(
        ratingUrl.replace('https://api.trakt.context.tv', ''),
      ),
    );
  },
);
test.serial(
  'fetchMovies() - calls fetch with the correct url and options if used for a watchlist',
  async (t) => {
    await fetchMovies('test', true);
    const url = 'https://api.trakt.context.tv/users/test/watchlist/movies';
    t.true(t.context.requestsMade.length > 0);
    t.is(
      t.context.requestsMade[0],
      url.replace('https://api.trakt.context.tv', ''),
    );
  },
);
test.serial(
  'fetchMovies() - returns the data it got from the url for the history after matching with review',
  async (t) => {
    const response = await fetchMovies('test');
    t.deepEqual(response, letterboxdData);
  },
);
test.serial(
  'fetchMovies() - returns the data it got from the url without matching ratings',
  async (t) => {
    const response = await fetchMovies('test', true);
    t.snapshot(response);
  },
);
test.serial('fetchMovies() - logs an error if there is one', async (t) => {
  const errorStub = t.context.sandbox.stub(console, 'error');

  nock.cleanAll();
  nock('https://api.trakt.tv').get(/.*/).reply(500);

  await fetchMovies('test');
  t.true(errorStub.called);
  t.snapshot(errorStub.args[0][0]);
  t.snapshot(errorStub.args[0][1]);
});
test.serial(
  'fetchMovies() - returns an empty array if it cant fetch data',
  async (t) => {
    t.context.sandbox.stub(console, 'error');

    nock.cleanAll();
    nock('https://api.trakt.tv').get(/.*/).reply(500);

    const response = await fetchMovies('test');
    t.deepEqual(response, []);
  },
);
