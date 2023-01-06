import CsvBuilder from 'csv-builder';

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
};

/**
 * The instance of CsvBuilder we'll use to export the data.
 * We need to remap the format of the last watched date to YYYY-MM-DD
 * to comply with letterboxd's formatting
 */
const builder = new CsvBuilder(schema);
export default builder;
