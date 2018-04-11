// @flow
import type {
    TraktMovieHistoryType,
    TraktMovieHistEntityType,
    LetterboxdHistoryEntityType,
}
    from './types';

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

const mapTraktToLetterboxd = (movie: TraktMovieHistEntityType): LetterboxdHistoryEntityType =>
    Object.assign({}, defaults, {
        LetterboxdURI: null,
        tmdbID: movie.movie.ids.tmdb,
        imdbID: movie.movie.ids.imdb,
        Title: movie.movie.title,
        Year: movie.movie.year,
        Directors: null,
        WatchedDate: movie.last_watched_at,
    });

const mapper = (movieList: TraktMovieHistoryType): Array<LetterboxdHistoryEntityType> =>
    movieList.map(mapTraktToLetterboxd);

export default mapper;
