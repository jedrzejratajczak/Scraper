import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EmbedBuilder } from 'discord.js';

const chunkArray = (array, chunkSize) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const makeEmbed = ({ src = 'Brak', price = 'Brak', title = 'Brak', productId = 'Brak', href = 'Brak' }) => {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setFooter({ text: `ID: ${productId}` })
    .setTimestamp()
    .addFields({ name: 'Cena', value: price });

  if (isValidUrl(src)) {
    embed.setThumbnail(src);
  }

  if (isValidUrl(href)) {
    embed.setURL(href).addFields({ name: 'Url', value: href });
  }

  return embed;
};

const addLog = (content) => {
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

export { chunkArray, makeEmbed, addLog };
