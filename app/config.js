import scrapA from './scrapers/scrapA.js';
import scrapE from './scrapers/scrapE.js';
import scrapG from './scrapers/scrapG.js';
import scrapH from './scrapers/scrapH.js';
import scrapT from './scrapers/scrapT.js';
import scrapVC from './scrapers/scrapVC.js';

const config = {
  e: {
    channel: process.env.E_CHANNEL,
    url: process.env.E_URL,
    scraper: scrapE,
  },
  g: {
    channel: process.env.G_CHANNEL,
    url: process.env.G_URL,
    scraper: scrapG,
  },
  h: {
    channel: process.env.H_CHANNEL,
    url: process.env.H_URL,
    scraper: scrapH,
  },
  t: {
    channel: process.env.T_CHANNEL,
    url: process.env.T_URL,
    scraper: scrapT,
  },
  ge: {
    channel: process.env.GE_CHANNEL,
    url: process.env.GE_URL,
    scraper: scrapG,
  },
  gb: {
    channel: process.env.GB_CHANNEL,
    url: process.env.GB_URL,
    scraper: scrapG,
  },
  a: {
    channel: process.env.A_CHANNEL,
    url: process.env.A_URL,
    scraper: scrapA,
  },
  vc: {
    channel: process.env.VC_CHANNEL,
    url: process.env.VC_URL,
    scraper: scrapVC,
  },
};

export default config;
