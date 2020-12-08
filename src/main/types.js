export type TraktMovieIdsType = {
    "trakt": number,
    "slug": string,
    "imdb": string,
    "tmdb": number,
};
export type TraktMovieEntityType = {
    "title": string,
    "year": number,
    "ids": TraktMovieIdsType,
};
export type TraktMovieHistEntityType = {
    "plays": number,
    "last_watched_at": string,
    "movie": TraktMovieEntityType,
};
export type TraktMovieWatchlistEntityType = {
    "rank": number,
    "listed_at": string,
    "movie": TraktMovieEntityType,
};
export type TraktMovieHistoryType = Array<TraktMovieHistEntityType>;
export type TraktWatchlistType = Array<TraktMovieWatchlistEntityType>;
export type LetterboxdHistoryEntityType = {
    LetterboxdURI: ?string,
    tmdbID: ?number,
    imdbID: ?string,
    Title: string,
    Year: number,
    Directors: ?string,
    WatchedDate: ?string,
    Rating: ?number,
    Rating10: ?number,
    Tags: ?string,
    Review: ?string,
};
