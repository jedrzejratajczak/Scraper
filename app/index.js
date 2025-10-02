import DiscordBot from './objects/DiscordBot.js';
import Browser from './objects/Browser.js';
import Memory from './objects/Memory.js';
import config from './config.js';
import { addLog } from './utils.js';

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

let bot = null;
let memory = null;
let browser = null;

while (true) {
  let lastUrl = null;

  try {
    bot = new DiscordBot(config);
    memory = new Memory();
    browser = new Browser();

    while (true) {
      const configEntries = Object.entries(config).sort(() => Math.random() - 0.5);

      for (const [key, { url, scraper }] of configEntries) {
        lastUrl = url;
        const page = await browser.openPage(url);

        if (!page) {
          continue;
        }

        const products = await scrap(page, scraper);
        await browser.closePage(page);

        const newProducts = await memory.updateProducts(key, products);
        await bot.sendProducts(key, newProducts);
      }

      const totalWaitTimeMs = 15 * 60 * 1000;
      const delayBetweenCycles = Math.floor(totalWaitTimeMs / configEntries.length);
      await new Promise((resolve) => setTimeout(resolve, delayBetweenCycles));
    }
  } catch (error) {
    await browser?.closeBrowser();
    await bot?.destroy();
    await memory?.close();

    addLog(`App stopped. URL: ${lastUrl} | Error: ${error}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
