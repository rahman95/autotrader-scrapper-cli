import { getOptionValues, getResults } from "./lib/scrapper";
import { handleInput } from "./lib/cli"

async function run() {
    const options = await getOptionValues();
    const input = await handleInput(options);
    const results = await getResults(input);

    console.log({input, results});
}

run();