import chalk from 'chalk';
import { getOptionValues } from './lib/scrapper';

async function run() {
    const options = await getOptionValues();

    console.log(options);
}

run();
