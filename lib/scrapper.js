import axios from "axios";
import cheerio from "cheerio";
import _ from "lodash";
import { getApiUrl, getOptionsArray } from "./util"

async function getOptionValues() {
  const data = await axios.get(`${getApiUrl()}`)
    .then((res) => res.data);

  return await filterOptions(data);
}

async function filterOptions(options) {
  return await Promise.all(
    _.chain(options)
      .get("refinements.fields")
      .filter(field => {
        const key = _.camelCase(field.parameterName);

        return _.has(getOptionsArray(), key) || _.has(field, "minField");
      })
      .transform((fields, field) => {
        if (_.has(field, "minField") && _.has(field, "maxField")) {
          fields.push(_.get(field, "minField"));
          fields.push(_.get(field, "maxField"));
        } else {
          fields.push(field);
        }
      })
      .map(async field => {
        const options = await htmlToOptions(field.html);

        return {
          name: field.parameterName,
          options
        };
      })
      .value()
  );
}

async function htmlToOptions(htmlString) {
  const $ = cheerio.load(htmlString);

  if ($("button").get().length) {
    return $("button")
      .map((key, value) => {
        return {
          value: _.get(value.attribs, "data-selected-value"),
          name: _.get(value.attribs, "data-selected-display-name")
        };
      })
      .get();
  }

  if ($("option").get().length) {
    return $("option")
      .map((key, value) => {
        return {
          value: _.get(value.attribs, "value"),
          name: $(value).text()
        };
      })
      .get();
  }

  if ($("input").get().length) {
    return $("input")
      .map((key, value) => {
        return {
          value: _.get(value.attribs, "value"),
          name: _.get(value.attribs, "name")
        };
      })
      .get();
  }

  return [];
}

async function getResults(input) {
  return await axios
    .get(`${getApiUrl()}`, {
      params: input
    })
    .then(res => res.data);
}

export { getOptionValues, filterOptions, getResults };
