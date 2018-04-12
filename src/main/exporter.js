import CsvBuilder from 'csv-builder';
import { format } from 'fecha';

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

const builder = new CsvBuilder(schema)
    .virtual('WatchedDate', (history) => format(new Date(history.last_watched_at), 'YYYY-MM-DD'));

export default builder;
