import "dotenv/config";
import nodeCron from "node-cron";

import { DiscordBot, Memory } from "./objects/index.js";
import { errorHandlerWrapper } from "./utils/index.js";
import scrap, { scrapE, scrapG, scrapVC } from "./scrappers/index.js";

const config = {
  e: {
    channel: process.env.E_CHANNEL,
    cron: "0,5,10,15,20,25,30,35,40,45,50,55 * * * *",
    url: process.env.E_URL,
    scrapper: scrapE,
  },
  g: {
    channel: process.env.G_CHANNEL,
    cron: "2,7,12,17,22,27,32,37,42,47,52,57 * * * *",
    url: process.env.G_URL,
    scrapper: scrapG,
  },
  ge: {
    channel: process.env.GE_CHANNEL,
    cron: "4,9,14,19,24,29,34,39,44,49,54,59 * * * *",
    url: process.env.GE_URL,
    scrapper: scrapG,
  },
  gb: {
    channel: process.env.GB_CHANNEL,
    cron: "4,9,14,19,24,29,34,39,44,49,54,59 * * * *",
    url: process.env.GB_URL,
    scrapper: scrapG,
  },
  vc: {
    channel: process.env.VC_CHANNEL,
    cron: "0 8,20 * * *",
    url: process.env.VC_URL,
    scrapper: scrapVC,
  },
};

const bot = new DiscordBot(config);
const memory = new Memory();

Object.entries(config).forEach(([key, { cron, url, scrapper }]) => {
  nodeCron.schedule(
    cron,
    errorHandlerWrapper(async () => {
      const products = await scrap(url, scrapper);
      const newProducts = await memory.updateProducts(shop, products);
      await bot.sendProducts(key, newProducts);
    })
  );
});