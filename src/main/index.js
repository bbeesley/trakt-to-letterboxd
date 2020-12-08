// @flow
import fs from 'fs';
import { fetchMovies, fetchWatchlist } from './fetcher';
import { builder } from './exporter';

export type PropsType = {
    userName: string,
    fileName: string,
};

/**
 * Export a trakt user's history to csv to be uploaded to letterboxd
 * @param {Object}  props           Properties passed from argv
 * @param {string}  props.userName  The user whose data you want to export
 * @param {string}  props.fileName  The name of the file to output to
 * @return {Promise<void>}          We dont return anything
 */
export const traktHistoryToCsv = async ({ userName, fileName }: PropsType) => {
    try {
        const movieList = await fetchMovies(userName);
        const outFile = (fileName.endsWith('.csv')) ? fileName : `${fileName}.csv`;
        const stream = fs.createWriteStream(outFile);
        builder.createReadStream(movieList).pipe(stream);
    } catch (err) {
        console.error('Bang!', err.message, err);
    }
};


/**
 * Export a trakt user's watchlist to csv to be uploaded to letterboxd
 * @param {Object}  props           Properties passed from argv
 * @param {string}  props.userName  The user whose data you want to export
 * @param {string}  props.fileName  The name of the file to output to
 * @return {Promise<void>}          We dont return anything
 */
export const traktWatchlistToCsv = async ({ userName, fileName }: PropsType) => {
    try {
        const watchlist = await fetchWatchlist(userName);
        const outFile = (fileName.endsWith('.csv')) ? fileName : `${fileName}.csv`;
        const stream = fs.createWriteStream(outFile);
        builder.createReadStream(watchlist).pipe(stream);
    } catch (err) {
        console.error('Bang!', err.message, err);
    }
};
