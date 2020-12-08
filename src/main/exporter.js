import CsvBuilder from 'csv-builder';
import { format } from 'fecha';

/**
 * Schema for the output csv.
 * Based on https://letterboxd.com/about/importing-data/
 */
const schema = {
    headers: [
        'LetterboxdURI',
        'tmdbID',
        'imdbID',
        'Title',
        'Year',
        'Directors',
        'WatchedDate',
        'Rating',
        'Rating10',
        'Tags',
        'Review',
    ],
    alias: {
        tmdbID: 'movie.ids.tmdb',
        imdbID: 'movie.ids.imdb',
        Title: 'movie.title',
        Year: 'movie.year',
    },
};

/**
 * The instance of CsvBuilder we'll use to export the data.
 * We need to remap the format of the last watched date to YYYY-MM-DD
 * to comply with letterboxd's formatting
 */
export const builder = new CsvBuilder(schema)
    .virtual('WatchedDate', (history) => {
        if (history.last_watched_at) {
            return format(new Date(history.last_watched_at), 'YYYY-MM-DD');
        }

        return '';
    });
