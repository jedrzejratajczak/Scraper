import DiscordBot from "./objects/DiscordBot.js";
import Browser from "./objects/Browser.js";
import Memory from "./objects/Memory.js";
import scrap from "./scrapers/index.js";
import config from "./config.js";

const chosenConfig = "a";

const bot = new DiscordBot(config);
const browser = new Browser();
const memory = new Memory();

const page = await browser.openPage(config[chosenConfig].url);
const products = await scrap(page, config[chosenConfig].scraper);
await browser.closeBrowser();

const newProducts = await memory.updateProducts(chosenConfig, products);
// await bot.sendProducts(chosenConfig, newProducts);

console.log(newProducts);
