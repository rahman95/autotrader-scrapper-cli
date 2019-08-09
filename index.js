import { getOptionValues, getResults } from "./lib/scrapper";
import { handleInput } from "./lib/cli"

async function run() {
    // const options = await getOptionValues();
    const input = await handleInput();
    // const results = await getResults(input);

    // console.log({input, results});
}

run();


// TODO:
// 1. Ask first question
// 2. Get count and furhter questions
// 3. go to next question
// 4. get count and further count