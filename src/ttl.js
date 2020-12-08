#!/usr/bin/env node
import yargs from 'yargs';
import { traktHistoryToCsv, traktWatchlistToCsv } from './main';

/**
 * Nicely formatted command line arguments using yargs
 * @type {Object}   argv            All arguments
 * @type {string}   argv.fileName   Filename to write to
 * @type {string}   argv.userName   Username to get history for
 */
const { argv } = yargs
    .option('userName', {
        alias: 'u',
        describe: 'Trakt user whose movies you want to export',
    })
    .option('fileName', {
        alias: 'f',
        describe: 'The name of the file you want to export to',
    })
    .option('watchlist', {
        alias: 'w',
        describe: 'Export the watchlist instead',
        boolean: true,
    })
    .demandOption(
        ['userName', 'fileName'],
        'Please provide both userName and fileName arguments',
    )
    .help();

if (argv.w) {
    console.log('Downloading watchlist');

    traktWatchlistToCsv(argv)
        .then(() => console.log('Complete!'))
        .catch((err) => console.error('We hit a problem', err, err.message));
} else {
    console.log('Downloading watched history');

    traktHistoryToCsv(argv)
        .then(() => console.log('Complete!'))
        .catch((err) => console.error('We hit a problem', err, err.message));
}
