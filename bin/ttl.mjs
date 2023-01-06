import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'; // eslint-disable-line n/file-extension-in-import

import betterLogging from 'better-logging';
import { traktHistoryToCsv } from '../dist/esm/index.js';

betterLogging(console);

/**
 * Nicely formatted command line arguments using yargs
 * @type {Object}   argv            All arguments
 * @type {string}   argv.fileName   Filename to write to
 * @type {string}   argv.userName   Username to get history for
 */
// eslint-disable-next-line n/prefer-global/process
const argv = yargs(hideBin(process.argv))
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
  .help()
  .parse();
try {
  await traktHistoryToCsv(argv);
  console.log('Complete!');
} catch (error) {
  console.error('We hit a problem', error, error.message);
}
