// @flow
import { format } from 'fecha';
import type {
    TraktMovieHistoryType,
    TraktMovieHistEntityType,
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
 * @param   {TraktMovieHistEntityType}  movie   A trackt movie history entity
 * @return  {LetterboxdHistoryEntityType}       A letterboxd movie history entity
 */
const mapTraktToLetterboxd = (movie: TraktMovieHistEntityType): LetterboxdHistoryEntityType =>
    Object.assign({}, defaults, {
        tmdbID: movie.movie.ids.tmdb,
        imdbID: movie.movie.ids.imdb,
        Title: movie.movie.title,
        Year: movie.movie.year,
        WatchedDate: format(new Date(movie.last_watched_at), 'YYYY-MM-DD'),
    });


/**
 * Maps an array of trakt history entries to an array of letterboxd history entities
 * @param   {Array<TraktMovieHistEntityType>}   movieList   Trakt History
 * @return  {Array<LetterboxdHistoryEntityType>}            letterboxd history
 */
const mapper = (movieList: TraktMovieHistoryType): Array<LetterboxdHistoryEntityType> =>
    movieList.map(mapTraktToLetterboxd);

export default mapper;
