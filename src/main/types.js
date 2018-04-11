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
export type TraktMovieHistoryType = Array<TraktMovieHistEntityType>;
