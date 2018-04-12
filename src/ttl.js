#!/usr/bin/env node
import yargs from 'yargs';
import { traktHistoryToCsv } from './main';

const { argv } = yargs
    .option('userName', {
        alias: 'u',
        describe: 'Trakt user whose movies you want to export',
    })
    .option('fileName', {
        alias: 'f',
        describe: 'The name of the file you want to export to',
    })
    .demandOption(
        ['userName', 'fileName'],
        'Please provide both userName and fileName arguments',
    )
    .help();

traktHistoryToCsv(argv)
    .then(() => console.log('Complete!'))
    .catch((err) => console.error('We hit a problem', err, err.message));
