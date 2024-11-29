import { scrapA, scrapE, scrapG, scrapVC } from "./scrapers/index.js";

const config = {
  e: {
    channel: process.env.E_CHANNEL,
    cron: "0,5,10,15,20,25,30,35,40,45,50,55 * * * *",
    url: process.env.E_URL,
    scraper: scrapE,
  },
  g: {
    channel: process.env.G_CHANNEL,
    cron: "2,7,12,17,22,27,32,37,42,47,52,57 * * * *",
    url: process.env.G_URL,
    scraper: scrapG,
  },
  ge: {
    channel: process.env.GE_CHANNEL,
    cron: "4,9,14,19,24,29,34,39,44,49,54,59 * * * *",
    url: process.env.GE_URL,
    scraper: scrapG,
  },
  gb: {
    channel: process.env.GB_CHANNEL,
    cron: "20 4,9,14,19,24,29,34,39,44,49,54,59 * * * *",
    url: process.env.GB_URL,
    scraper: scrapG,
  },
  a: {
    channel: process.env.A_CHANNEL,
    cron: "40 4,9,14,19,24,29,34,39,44,49,54,59 * * * *",
    url: process.env.A_URL,
    scraper: scrapA,
  },
  vc: {
    channel: process.env.VC_CHANNEL,
    cron: "0 8,20 * * *",
    url: process.env.VC_URL,
    scraper: scrapVC,
  },
};

export default config;
