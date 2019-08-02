import axios from "axios";
import cheerio from "cheerio";
import _ from "lodash";

const URL = "https://www.autotrader.co.uk/results-car-search";

const options = [
  "radius",
  "make",
  "model",
  "priceFrom",
  "priceTo",
  "yearFrom",
  "yearTo",
  "minimumMileage",
  "maximumMileage",
  "bodyType",
  "fuelType",
  "minimumBadgeEngineSize",
  "maximumBadgeEngineSize",
  "transmission",
  "colour",
  "sellerType"
];

async function getOptionValues() {
  const data = await axios.get(`${URL}`)
    .then((res) => res.data);

  return await Promise.all(
    _.chain(data)
      .get("refinements.fields")
      .filter(field => {
        const key = _.camelCase(field.parameterName);

        return _.has(options, key) || _.has(field, "minField");
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
          key: _.get(value.attribs, "data-selected-value"),
          value: _.get(value.attribs, "data-selected-display-name")
        };
      })
      .get();
  }

  if ($("option").get().length) {
    return $("option")
      .map((key, value) => {
        return {
          key: _.get(value.attribs, "value"),
          value: $(value).text()
        };
      })
      .get();
  }

  if ($("input").get().length) {
    return $("input")
      .map((key, value) => {
        return {
          key: _.get(value.attribs, "name"),
          value: _.get(value.attribs, "value")
        };
      })
      .get();
  }

  return [];
}

export {
  getOptionValues
};
