import scrapA from './scrapers/scrapA.js';
import scrapE from './scrapers/scrapE.js';
import scrapG from './scrapers/scrapG.js';
import scrapH from './scrapers/scrapH.js';
import scrapT from './scrapers/scrapT.js';
import scrapVC from './scrapers/scrapVC.js';
import scrapP from './scrapers/scrapP.js';

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
  a: {
    channel: process.env.A_CHANNEL,
    url: process.env.A_URL,
    scraper: scrapA,
  },
  p: {
    channel: process.env.P_CHANNEL,
    url: process.env.P_URL,
    scraper: scrapP,
  },

  vc: {
    channel: process.env.VC_CHANNEL,
    url: process.env.VC_URL,
    scraper: scrapVC,
    role: process.env.VC_ROLE,
  },
  vc1: {
    channel: process.env.VC1_CHANNEL,
    url: process.env.VC1_URL,
    scraper: scrapVC,
    role: process.env.VC1_ROLE,
  },
  vc2: {
    channel: process.env.VC2_CHANNEL,
    url: process.env.VC2_URL,
    scraper: scrapVC,
    role: process.env.VC2_ROLE,
  },
  vc3: {
    channel: process.env.VC3_CHANNEL,
    url: process.env.VC3_URL,
    scraper: scrapVC,
    role: process.env.VC3_ROLE,
  },
  vc4: {
    channel: process.env.VC4_CHANNEL,
    url: process.env.VC4_URL,
    scraper: scrapVC,
    role: process.env.VC4_ROLE,
  },
  vc5: {
    channel: process.env.VC5_CHANNEL,
    url: process.env.VC5_URL,
    scraper: scrapVC,
    role: process.env.VC5_ROLE,
  },
  vc6: {
    channel: process.env.VC6_CHANNEL,
    url: process.env.VC6_URL,
    scraper: scrapVC,
    role: process.env.VC6_ROLE,
  },
  vc7: {
    channel: process.env.VC7_CHANNEL,
    url: process.env.VC7_URL,
    scraper: scrapVC,
    role: process.env.VC7_ROLE,
  },
  vc8: {
    channel: process.env.VC8_CHANNEL,
    url: process.env.VC8_URL,
    scraper: scrapVC,
    role: process.env.VC8_ROLE,
  },
  vc9: {
    channel: process.env.VC9_CHANNEL,
    url: process.env.VC9_URL,
    scraper: scrapVC,
    role: process.env.VC9_ROLE,
  },
  vc10: {
    channel: process.env.VC10_CHANNEL,
    url: process.env.VC10_URL,
    scraper: scrapVC,
    role: process.env.VC10_ROLE,
  },
  vc11: {
    channel: process.env.VC11_CHANNEL,
    url: process.env.VC11_URL,
    scraper: scrapVC,
    role: process.env.VC11_ROLE,
  },
  vc12: {
    channel: process.env.VC12_CHANNEL,
    url: process.env.VC12_URL,
    scraper: scrapVC,
    role: process.env.VC12_ROLE,
  },
  vc13: {
    channel: process.env.VC13_CHANNEL,
    url: process.env.VC13_URL,
    scraper: scrapVC,
    role: process.env.VC13_ROLE,
  },
  vc14: {
    channel: process.env.VC14_CHANNEL,
    url: process.env.VC14_URL,
    scraper: scrapVC,
    role: process.env.VC14_ROLE,
  },
  vc15: {
    channel: process.env.VC15_CHANNEL,
    url: process.env.VC15_URL,
    scraper: scrapVC,
    role: process.env.VC15_ROLE,
  },
  vc16: {
    channel: process.env.VC16_CHANNEL,
    url: process.env.VC16_URL,
    scraper: scrapVC,
    role: process.env.VC16_ROLE,
  },
  vc17: {
    channel: process.env.VC17_CHANNEL,
    url: process.env.VC17_URL,
    scraper: scrapVC,
    role: process.env.VC17_ROLE,
  },
  vc18: {
    channel: process.env.VC18_CHANNEL,
    url: process.env.VC18_URL,
    scraper: scrapVC,
    role: process.env.VC18_ROLE,
  },
  vc19: {
    channel: process.env.VC19_CHANNEL,
    url: process.env.VC19_URL,
    scraper: scrapVC,
    role: process.env.VC19_ROLE,
  },
  vc20: {
    channel: process.env.VC20_CHANNEL,
    url: process.env.VC20_URL,
    scraper: scrapVC,
    role: process.env.VC20_ROLE,
  },
  vc21: {
    channel: process.env.VC21_CHANNEL,
    url: process.env.VC21_URL,
    scraper: scrapVC,
    role: process.env.VC21_ROLE,
  },
  vc22: {
    channel: process.env.VC22_CHANNEL,
    url: process.env.VC22_URL,
    scraper: scrapVC,
    role: process.env.VC22_ROLE,
  },
  vc23: {
    channel: process.env.VC23_CHANNEL,
    url: process.env.VC23_URL,
    scraper: scrapVC,
    role: process.env.VC23_ROLE,
  },
  vc24: {
    channel: process.env.VC24_CHANNEL,
    url: process.env.VC24_URL,
    scraper: scrapVC,
    role: process.env.VC24_ROLE,
  },
  vc25: {
    channel: process.env.VC25_CHANNEL,
    url: process.env.VC25_URL,
    scraper: scrapVC,
    role: process.env.VC25_ROLE,
  },
};

export default config;
