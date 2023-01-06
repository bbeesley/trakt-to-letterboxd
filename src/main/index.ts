import { createWriteStream } from 'node:fs';
import getData from './fetcher.js';
import builder from './exporter.js';

export type PropsType = {
  userName: string;
  fileName?: string;
  watchListFileName?: string;
};

/**
 * Export a trakt user's history to csv to be uploaded to letterboxd
 * @param {Object}  props           Properties passed from argv
 * @param {string}  props.userName  The user whose data you want to export
 * @param {string}  props.fileName  The name of the file to output the history to
 * @param {string}  props.fileName  The name of the file to output the watchlist to
 * @return {Promise<void>}          We dont return anything
 */

export const traktHistoryToCsv = async ({
  userName,
  fileName,
  watchListFileName,
}: PropsType) => {
  try {
    let tFileName = fileName;
    let tWatchListFileName = watchListFileName;

    if (userName && !fileName && !watchListFileName) {
      tFileName = 'history.csv';
      tWatchListFileName = 'watchlist.csv';
    }

    if (tFileName) {
      const movieList = await getData(userName);
      const outFile = tFileName.endsWith('.csv')
        ? tFileName
        : `${tFileName}.csv`;
      const stream = createWriteStream(outFile);
      builder.createReadStream(movieList).pipe(stream);
    }

    if (tWatchListFileName) {
      const watchList = await getData(userName, true);
      const wlOutFile = tWatchListFileName.endsWith('.csv')
        ? tWatchListFileName
        : `${tWatchListFileName}.csv`;
      const wlStream = createWriteStream(wlOutFile);
      builder.createReadStream(watchList).pipe(wlStream);
    }
  } catch (error) {
    console.error('Bang!', error.message, error);
  }
};
