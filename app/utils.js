import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EmbedBuilder } from 'discord.js';

function chunkArray (array, chunkSize) {
  const chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
};

function isValidUrl (url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function makeEmbed({ src = 'Brak', price = 'Brak', title = 'Brak', productId = 'Brak', href = 'Brak' }) {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setFooter({ text: `ID: ${productId}` })
    .setTimestamp()
    .addFields({ name: 'Cena', value: price });

  if (isValidUrl(src)) embed.setThumbnail(src);
  if (isValidUrl(href)) embed.setURL(href);

  return embed;
};

function addLog(content) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(dirname, '../logs.txt');
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${content}\n------\n`;

  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, logEntry);
  } else {
    fs.writeFileSync(filePath, logEntry);
  }
};

async function fetcher({ urls, headers, selectors }) {
  const cheerio = await import('cheerio');
  const allProducts = [];

  for (const url of urls) {
    const response = await fetch(url, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = $(selectors.list);

    items.each((_, element) => {
      const item = $(element);
      const product = {
        src: selectors.src(item),
        price: selectors.price(item),
        title: selectors.title(item),
        href: selectors.href(item),
        productId: selectors.productId(item)
      };

      if (product.productId) {
        allProducts.push(product);
      }
    });
  }

  return allProducts;
}

export { chunkArray, makeEmbed, addLog, fetcher };
