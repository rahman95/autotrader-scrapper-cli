import axios from "axios";
import _ from "lodash";
import cheerio from "cheerio";
import mockData from './mockData';

const URL = "https://www.autotrader.co.uk/results-car-search";

const options = {
  radius: "",
  make: "",
  model: "",
  priceFrom: "",
  priceTo: "",
  yearFrom: "",
  yearTo: "",
  minimumMileage: "",
  maximumMileage: "",
  bodyType: "",
  fuelType: "",
  minimumBadgeEngineSize: "",
  maximumBadgeEngineSize: "",
  transmission: "",
  colour:"",
  sellerType: "",
};

async function getOptionValues() {
  // await axios.get(`${URL}`)
  //   .then((res) => {
  //     const fields = _.get(res.data, 'refinements.fields')



  //     // const fields = _.filter(refinements.fields, (option) => {
  //     //   console.log(option);
  //     //   return;
  //     //   return _.has(option, "fields");
  //     // })
    
  //     console.log(fields);
  //   });

  const fields = _.chain(mockData)
    .get('refinements.fields')
    .filter((field) => {
      const key = _.camelCase(field.parameterName);
      
      return _.has(options, key) || _.has(field, 'minField')
    })
    .transform((fields, field) => {
      if (_.has(field, 'minField') && _.has(field, 'maxField')) {
        fields.push(_.get(field, 'minField'))
        fields.push(_.get(field, 'maxField'))
      } else {
        fields.push(field)
      }
    })
    .map((field) => {
      return {
        name: field.parameterName,
        options: htmlToOptions(field.html)
      }
    })
    .value();






  console.log(fields);
}

async function htmlToOptions(htmlString) {
  const $ = cheerio.load(htmlString);
  const keys = $('[data-selected-value]').text()
  const values = $('[data-selected-display-name]').text()

  console.log({keys, values});
}

export {
  getOptionValues
};
