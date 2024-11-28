import "dotenv/config";
import nodeCron from "node-cron";

import { DiscordBot, Memory } from "./objects/index.js";
import { errorHandlerWrapper } from "./utils/index.js";
import scrap, { scrapA, scrapE, scrapG, scrapVC } from "./scrappers/index.js";

const config = {
  e: {
    channel: process.env.E_CHANNEL,
    cron: "0/5 * * * *",
    url: process.env.E_URL,
    scrapper: scrapE,
  },
  g: {
    channel: process.env.G_CHANNEL,
    cron: "2/5 * * * *",
    url: process.env.G_URL,
    scrapper: scrapG,
  },
  ge: {
    channel: process.env.GE_CHANNEL,
    cron: "0 4/5 * * * *",
    url: process.env.GE_URL,
    scrapper: scrapG,
  },
  gb: {
    channel: process.env.GB_CHANNEL,
    cron: "20 4/5 * * * *",
    url: process.env.GB_URL,
    scrapper: scrapG,
  },
  a: {
    channel: process.env.A_CHANNEL,
    cron: "40 4/5 * * * *",
    url: process.env.A_URL,
    scrapper: scrapA,
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
      const newProducts = await memory.updateProducts(key, products);
      await bot.sendProducts(key, newProducts);
    })
  );
});
