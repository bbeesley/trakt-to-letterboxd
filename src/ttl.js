#!/usr/bin/env node
import yargs from 'yargs';
import { traktHistoryToCsv } from './main';

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
        describe: 'The name of the file you want to export your history to',
    })
    .option('watchListFileName', {
        alias: 'w',
        describe: 'The name of the file you want to export your watchlist to',
    })
    .demandOption(['userName'], 'Please provide at least a username')
    .help();

traktHistoryToCsv(argv)
    .then(() => console.log('Complete!'))
    .catch((err) => console.error('We hit a problem', err, err.message));
