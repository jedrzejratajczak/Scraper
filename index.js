import "dotenv/config";
import nodeCron from "node-cron";

import { Browser, DiscordBot, Memory } from "./objects/index.js";
import { errorHandlerWrapper } from "./utils/index.js";
import scrap from "./scrapers/index.js";
import config from "./config.js";

const bot = new DiscordBot(config);
const memory = new Memory();
const browser = new Browser();

Object.entries(config).forEach(([key, { cron, url, scraper }]) => {
  nodeCron.schedule(cron, async () => {
    const page = await browser.openPage(url);

    errorHandlerWrapper(
      async () => {
        const products = await scrap(page, scraper);
        await browser.closePage(page);
        const newProducts = await memory.updateProducts(key, products);
        await bot.sendProducts(key, newProducts);
      },
      async () => await browser.closePage(page)
    );
  });
});
