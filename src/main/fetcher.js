// @flow
import fetch from 'node-fetch';
import config from './config';
import type { TraktMovieHistoryType, TraktMovieWatchlistType } from './types';

/**
 * HTTP headers to send with our request to trakt's api
 */
const headers = {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': config.clientId,
};

/**
 * The fetch options object (only really needs headers)
 */
const options = {
    headers,
};

/**
 * Fetches the user's history data from the trakt api
 * @param   {string}  user    The username we're getting data for
 * @returns {Promise<TraktMovieHistoryType>}    Promise that resolves to trakt history array
 */
export const fetchMovies = async (user: string): Promise<TraktMovieHistoryType> => {
    const url = `https://api.trakt.tv/users/${user}/watched/movies`;
    try {
        const res = await fetch(url, options);
        const movieData: TraktMovieHistoryType = await res.json();
        return movieData;
    } catch (err) {
        const message = err.message || 'Unknown error';
        console.error(message, err);
        return [];
    }
};

/**
 * Fetches the user's watchlist data from the trakt api
 * @param   {string}  user    The username we're getting data for
 * @returns {Promise<TraktMovieWatchlistType>}    Promise that resolves to trakt watchlist array
 */
export const fetchWatchlist = async (user: string): Promise<TraktMovieWatchlistType> => {
    const url = `https://api.trakt.tv/users/${user}/watchlist/movies`;
    try {
        const res = await fetch(url, options);
        const movieData: TraktMovieWatchlistType = await res.json();
        return movieData;
    } catch (err) {
        const message = err.message || 'Unknown error';
        console.error(message, err);
        return [];
    }
};
