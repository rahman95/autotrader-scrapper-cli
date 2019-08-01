import axios from "axios";
import cheerio from "cheerio";

const URL = "https://www.autotrader.co.uk/";

const options = {
  zip: "",
  makeCodeList: "",
  modelCodeList: "",
  startYear: "",
  endYear: "",
  searchRadius: "",
  sellerTypes: "",
  maxPrice: "",
  sortBy: "",
  numRecords: "",
  firstRecord: ""
};

const headers = {
  "Cache-Control": "no-cache",
	"Postman-Token": "c4df7277-e7dd-41d3-b110-c5d9f66203c6",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9",
  "authority": "www.autotrader.com",
  "referer": getFullUrl(),
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
  "accept": "*/*",
}