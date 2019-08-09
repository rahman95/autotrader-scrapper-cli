import inquirer from "inquirer";
import _ from "lodash";
import { getResults, filterOptions } from "./scrapper";
import config from "./config";

const inputs = [];
let hasMoreQuestions = true;

async function handleInput() {
  // Ask questions which dont need server options
  const questionsWithoutValues = getInitialQuestions();
  let answers = await inquirer.prompt(
    questionsWithoutValues
  );
  recordInput(answers);

  // Ask questions which need options from server
  while (hasMoreQuestions) {
    const results = await getResults(inputs);
    const options = await filterOptions(results);
    const question = getNextQuestion(options);
    if(! question) {
      break;
    }

    const formatted = await formatQuestion(question);
    let answers = await inquirer.prompt(formatted);

    recordInput(answers);
  }

  console.log(inputs);
}

function getInitialQuestions() {
  return _.chain(config.options)
    .filter(option => option.getValues === false)
    .map(option => {
      return {
        name: option.name,
        message: option.question,
        type: option.type
      };
    })
    .value();
}

function recordInput(answer) {
  inputs.push(answer);
}

function getNextQuestion(options) {
  const question =  _.chain(options)
    .reject(option => {
      const keys = _.map(inputs, (input) => {
        return _.head(_.keys(input));
      });

      return keys.includes(_.snakeCase(option.name));
    })
    .head()
    .value();

    console.log(question)

    if(! question) {
      hasMoreQuestions = false;

      return false;
    }

    return question;
}

async function formatQuestion(question) {
  const option = _.find(config.options, (option) => option.name === _.camelCase(question.name));

  return {
    name: _.snakeCase(option.name),
    type: option.type,
    message: option.question,
    choices: question.options
  };
}

export {
  handleInput
}