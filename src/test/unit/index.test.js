import { readFile, stat } from 'node:fs/promises';
import test from 'ava';
import nock from 'nock';
import delay from 'delay';
import { execa } from 'execa';
import { createSandbox } from 'sinon';
import { traktHistoryToCsv } from '../../main/index.js';
import traktRatingData from '../mocks/trakt-rating-data.js';
import traktData from '../mocks/trakt-data.js';

test.serial.beforeEach(async (t) => {
  t.context.sandbox = createSandbox();
  t.context.requestsMade = [];
  t.context.scope = nock('https://api.trakt.tv')
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
  t.context.props = {
    userName: 'foo',
    fileName: 'bar',
  };
  try {
    await execa('rm', ['*.csv'], { shell: true });
  } catch {}
});
test.serial.afterEach(async (t) => {
  t.context.sandbox.restore();
  nock.cleanAll();
  try {
    await execa('rm', ['*.csv'], { shell: true });
  } catch (error) {
    console.error('unable to delete files', error);
  }
});

test.serial(
  'traktHistoryToCsv() - will use default filenames if none are given',
  async (t) => {
    delete t.context.props.fileName;
    delete t.context.props.watchListFileName;
    await traktHistoryToCsv(t.context.props);
    await delay(500);
    t.is(t.context.requestsMade.length, 3);
    let watchlistMissing = false;
    try {
      await stat('watchlist.csv');
    } catch {
      watchlistMissing = true;
    }

    t.false(watchlistMissing);
    const fileContent = await readFile('watchlist.csv', { encoding: 'utf8' });
    t.snapshot(fileContent);
  },
);
test.serial(
  'traktHistoryToCsv() - only generates watchlist if only a watchlist file is given',
  async (t) => {
    t.context.props.watchListFileName = 'baz';
    delete t.context.props.fileName;
    await traktHistoryToCsv(t.context.props);
    await delay(500);
    t.is(t.context.requestsMade.length, 1);
    let watchlistMissing = false;
    try {
      await stat('baz.csv');
    } catch {
      watchlistMissing = true;
    }

    t.false(watchlistMissing);

    let historyMissing = false;
    try {
      await stat('bar.csv');
    } catch {
      historyMissing = true;
    }

    t.true(historyMissing);
  },
);
test.serial(
  'traktHistoryToCsv() - passes fileName to createWriteStream',
  async (t) => {
    await traktHistoryToCsv({
      userName: 'foo',
      fileName: 'bar.csv',
    });
    await delay(500);
    t.is(t.context.requestsMade.length, 2);
    let historyMissing = false;
    try {
      await stat('bar.csv');
    } catch {
      historyMissing = true;
    }

    t.false(historyMissing);
  },
);
test.serial(
  'traktHistoryToCsv() - passes watchListFileName to createWriteStream',
  async (t) => {
    await traktHistoryToCsv({
      userName: 'foo',
      fileName: 'bar.csv',
      watchListFileName: 'baz.csv',
    });
    await delay(500);
    t.is(t.context.requestsMade.length, 3);
    let watchlistMissing = false;
    try {
      await stat('baz.csv');
    } catch {
      watchlistMissing = true;
    }

    t.false(watchlistMissing);

    let historyMissing = false;
    try {
      await stat('bar.csv');
    } catch {
      historyMissing = true;
    }

    t.false(historyMissing);
  },
);
test.serial(
  'traktHistoryToCsv() - ensures fileName has a .csv extension and passes it to createWriteStream',
  async (t) => {
    await traktHistoryToCsv(t.context.props);
    await delay(500);
    t.is(t.context.requestsMade.length, 2);
    let historyMissing = false;
    try {
      await stat('bar.csv');
    } catch {
      historyMissing = true;
    }

    t.false(historyMissing);
  },
);
test.serial(
  'traktHistoryToCsv() - ensures watchListFileName has a .csv extension and passes it to createWriteStream',
  async (t) => {
    t.context.props.watchListFileName = 'baz';
    await traktHistoryToCsv(t.context.props);
    await delay(500);
    t.is(t.context.requestsMade.length, 3);

    let watchlistMissing = false;
    try {
      await stat('baz.csv');
    } catch {
      watchlistMissing = true;
    }

    t.false(watchlistMissing);
  },
);
test.serial(
  'traktHistoryToCsv() - logs an error message if something throws',
  async (t) => {
    const errorStub = t.context.sandbox.stub(console, 'error');

    nock.cleanAll();
    nock('https://api.trakt.tv').get(/.*/).reply(500);
    await traktHistoryToCsv(t.context.props);
    await delay(500);
    t.true(errorStub.called);
    t.snapshot(errorStub.args[0][0]);
    t.snapshot(errorStub.args[0][1]);
  },
);
