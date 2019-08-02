import _ from "lodash";
import config from "./config";

function getApiUrl() {
  return _.get(config, "apiUrl");
}

function buildApiUrl(inputs) {
  return _.map(inputs, (label, value) => {
    const key = _.snakeCase(label);

    return {
      [key]: value
    }
  });
}

function getOptionsArray() {
  return _.chain(config.options)
    .filter(option => option.getValues)
    .map(option => option.name)
    .value();
}

export { getApiUrl, buildApiUrl, getOptionsArray };