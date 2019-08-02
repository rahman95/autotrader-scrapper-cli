import inquirer from "inquirer";
import _ from "lodash";
import config from "./config";

async function handleInput(options) {
  const questions = await formatQuestions(options)

  return await inquirer.prompt(questions);
}

async function formatQuestions(options) {
  return _.chain(config.options)
    .map(option => {
      const field = _.find(options, function(field) {
        const key = _.camelCase(field.name);

        return key === option.name;
      });

      if (field === undefined) {
        return false;
      }

      return {
        name: _.snakeCase(option.name),
        type: option.type,
        message: option.question,
        choices: field.options
      };
    })
    .filter(option => option)
    .value();
}

export {
  handleInput
}