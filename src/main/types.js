export type TraktMovieIdsType = {
  trakt: number,
  slug: string,
  imdb: string,
  tmdb: number,
};
export type TraktMovieEntityType = {
  title: string,
  year: number,
  ids: TraktMovieIdsType,
};
export type TraktMovieHistEntityType = {
  plays: number,
  last_watched_at: string,
  movie: TraktMovieEntityType,
};
export type TraktRatingEntityType = {
  rated_at: string,
  rating: number,
  movie: TraktMovieEntityType,
};

export type TraktRatingMergedHistoryEntityType = TraktMovieHistEntityType & {
  rating?: number,
};
export type TraktRatingMergedHistoryType = Array<TraktRatingMergedHistoryEntityType>;
export type TraktRatingsType = Array<TraktRatingEntityType>;
export type TraktMovieHistoryType = Array<TraktMovieHistEntityType>;
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
