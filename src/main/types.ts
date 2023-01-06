/* eslint-disable @typescript-eslint/ban-types */
export type TraktMovieIdsType = {
  trakt: number;
  slug: string;
  imdb: string;
  tmdb: number;
};
export type TraktMovieEntityType = {
  title: string;
  year: number;
  ids: TraktMovieIdsType;
};
export type TraktMovieHistEntityType = {
  plays: number;
  last_watched_at: string;
  movie: TraktMovieEntityType;
};
export type TraktRatingEntityType = {
  rated_at: string;
  rating: number;
  movie: TraktMovieEntityType;
};
export type TraktRatingMergedHistoryEntityType = TraktMovieHistEntityType & {
  rating?: number;
};
export type TraktRatingMergedHistoryType = TraktRatingMergedHistoryEntityType[];
export type TraktRatingsType = TraktRatingEntityType[];
export type TraktMovieHistoryType = TraktMovieHistEntityType[];
export type LetterboxdHistoryEntityType = {
  LetterboxdURI: string | null;
  tmdbID: number | null;
  imdbID: string | null;
  Title: string;
  Year: number;
  Directors: string | null;
  WatchedDate: string | null;
  Rating: number | null;
  Rating10: number | undefined;
  Tags: string | null;
  Review: string | null;
};
