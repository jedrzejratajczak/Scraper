// import DiscordBot from "./objects/DiscordBot.js";
import Browser from '../objects/Browser.js';
import Memory from '../objects/Memory.js';
import config from '../config.js';

const scrap = async (page, scraper) => {
  const { acceptCookies, fetchProducts, goToNextPage } = scraper;

  await acceptCookies(page);

  const products = [];
  let nextPageAvailable;

  do {
    const pageProducts = await fetchProducts(page);
    products.push(...pageProducts);

    nextPageAvailable = await goToNextPage(page);
  } while (nextPageAvailable);

  return products;
};

const chosenConfig = 'p';

// const bot = new DiscordBot(config);
const browser = new Browser();
// const memory = new Memory();

const page = await browser.openPage(config[chosenConfig].url);
const products = await scrap(page, config[chosenConfig].scraper);
console.log(products);
await browser.closeBrowser();

// const newProducts = await memory.updateProducts(chosenConfig, products);
// await bot.sendProducts(chosenConfig, newProducts);

// console.log(newProducts);
