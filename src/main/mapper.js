// @flow
import { format } from 'fecha';
import type {
    TraktRatingMergedHistoryType,
    TraktRatingMergedHistoryEntityType,
    LetterboxdHistoryEntityType,
} from './types';

/**
 * Default values for letterboxd object shape
 */
const defaults = {
    LetterboxdURI: null,
    tmdbID: null,
    imdbID: null,
    Title: '',
    Year: null,
    Directors: null,
    WatchedDate: null,
    Rating: null,
    Rating10: null,
    Tags: null,
    Review: null,
};

/**
 * Maps a trakt history entry to a letterboxd history entry
 * @param   {TraktRatingMergedHistoryEntityType}  movie   A trackt movie history entity
 * @param   {boolean}  isWatchlist  Whether to map the history or the watchlist, defaults to the history
 * @return  {LetterboxdHistoryEntityType}       A letterboxd movie history entity
 */
const mapTraktToLetterboxd = (
    movie: TraktRatingMergedHistoryEntityType,
    isWatchlist?: boolean,
): LetterboxdHistoryEntityType => ({
    ...defaults,
    tmdbID: movie.movie.ids.tmdb,
    imdbID: movie.movie.ids.imdb,
    Title: movie.movie.title,
    Year: movie.movie.year,
    Rating10: movie.rating,
    WatchedDate: isWatchlist
        ? undefined
        : format(new Date(movie.last_watched_at), 'YYYY-MM-DD'),
});

/**
 * Maps an array of trakt history entries to an array of letterboxd history entities
 * @param   {Array<TraktRatingMergedHistoryEntityType>}   movieList   Trakt History
 * @param   {boolean}  isWatchlist  Whether to map the history or the watchlist, defaults to the history
 * @return  {Array<LetterboxdHistoryEntityType>}            letterboxd history
 */
const mapper = (
    movieList: TraktRatingMergedHistoryType,
    isWatchlist: boolean = false,
): Array<LetterboxdHistoryEntityType> => movieList.map((val: TraktRatingMergedHistoryEntityType) => mapTraktToLetterboxd(val, isWatchlist));

export default mapper;
