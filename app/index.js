import DiscordBot from './objects/DiscordBot';
import Memory from './objects/Memory';
import config from './config';
import { addLog } from './utils';

let bot = null;
let memory = null;

while (true) {
  let lastKey = null;

  try {
    bot = new DiscordBot(config);
    memory = new Memory();

    while (true) {
      const configEntries = Object.entries(config).sort(() => Math.random() - 0.5);

      for (const [key, { url, getProducts }] of configEntries) {
        lastKey = key;

        const products = await getProducts(url);
        addLog(`${key}: ${products.length}`);

        const newProducts = await memory.updateProducts(key, products);
        await bot.sendProducts(key, newProducts);
      }

      // 2 minutes delay between cycles
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
    }
  } catch (error) {
    await bot?.destroy();
    await memory?.close();

    addLog(`App stopped. Key: ${lastKey} | Error: ${error}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
