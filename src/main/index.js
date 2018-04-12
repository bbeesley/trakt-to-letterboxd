// @flow
import fs from 'fs';
import getData from './fetcher';
import builder from './exporter';

export type PropsType = {
    userName: string,
    fileName: string,
};

export const traktHistoryToCsv = async ({ userName, fileName }: PropsType) => {
    try {
        const movieList = await getData(userName);
        const outFile = (fileName.endsWith('.csv')) ? fileName : `${fileName}.csv`;
        const stream = fs.createWriteStream(outFile);
        builder.createReadStream(movieList).pipe(stream);
    } catch (err) {
        console.error('Bang!', err.message, err);
    }
};
