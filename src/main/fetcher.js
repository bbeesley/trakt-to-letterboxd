// @flow
import fetch from 'node-fetch';
import config from './config';
import type {
    TraktMovieHistoryType,
    TraktRatingsType,
    TraktRatingMergedHistoryType,
    LetterboxdHistoryEntityType,
} from './types';
import mapper from './mapper';

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
 * Fetch the ratings of a user and merge them with the movie history based on the movie's Trakt ID
 *
 * @param {string} user The username we're getting data for
 * @param {TraktMovieHistoryType} watched A list of movies that have been watched
 * @returns {Promise<TraktRatingMergedHistoryType>} Promise that resolves to Trakt movie data with merged rating
 */
const mergeWatchedWithRatings = async (
    user: string,
    watched: TraktMovieHistoryType,
): Promise<TraktRatingMergedHistoryType> => {
    const url = `https://api.trakt.tv/users/${user}/ratings/movies`;
    const res = await fetch(url, options);
    const ratingData: TraktRatingsType = await res.json();
    const traktIdToRatingMap = new Map<number, number>();
    for (const rating of ratingData) {
        traktIdToRatingMap.set(rating.movie.ids.trakt, rating.rating);
    }
    const mergedData: TraktRatingMergedHistoryType = [];
    for (const movieHist of watched) {
        movieHist.rating = traktIdToRatingMap.get(movieHist.movie.ids.trakt);
        mergedData.push(movieHist);
    }
    return mergedData;
};

/**
 * Fetches the user's history data from the trakt api
 * @param   {string}  user    The username we're getting data for
 * @param   {boolean}  isWatchlist  Whether to fetch the history or the watchlist, defaults to the history
 * @returns {Promise<Array<LetterboxdHistoryEntityType>>}    Promise that resolves to mapped Letterboxd data
 */
const fetchMovies = async (
    user: string,
    isWatchlist: boolean = false,
): Promise<Array<LetterboxdHistoryEntityType>> => {
    let url = `https://api.trakt.tv/users/${user}/watched/movies`;
    if (isWatchlist) {
        url = `https://api.trakt.tv/users/${user}/watchlist/movies`;
    }
    try {
        const res = await fetch(url, options);
        const movieData: TraktMovieHistoryType = await res.json();
        if (isWatchlist) {
            return mapper(movieData, isWatchlist);
        }
        const merged = await mergeWatchedWithRatings(user, movieData);
        return mapper(merged, isWatchlist);
    } catch (err) {
        const message = err.message || 'Unknown error';
        console.error(message, err);
        return [];
    }
};

export default fetchMovies;
