import "dotenv/config";

import Browser from "./objects/Browser.js";
import scrap from "./scrapers/index.js";
import config from "./config.js";

const browser = new Browser();

const chosenConfig = config.a;

const page = await browser.openPage(chosenConfig.url);
const products = await scrap(page, chosenConfig.scraper);

console.log(products);

await browser.closeBrowser();
