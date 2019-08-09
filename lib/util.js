import _ from "lodash";
import config from "./config";

function getApiUrl() {
  return _.get(config, "apiUrl");
}

function getOptionsArray() {
  return _.chain(config.options)
    .filter(option => option.getValues)
    .map(option => option.name)
    .value();
}

export { getApiUrl, getOptionsArray };