import { Client, Events, GatewayIntentBits } from 'discord.js';
import { chunkArray, makeEmbed } from '../utils.js';

class DiscordBot {
  constructor(config) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.login(process.env.DISCORD_TOKEN);
    this.channels = {};

    this.client.once(Events.ClientReady, (readyClient) => {
      Object.entries(config).forEach(([key, { channel }]) => {
        this.channels[key] = this.client.channels.cache.get(channel);
      });

      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });
  }

  async sendProducts(key, products) {
    const channel = this.channels[key];
    if (!channel || products.length === 0) return;

    const embeds = products.map((product) => makeEmbed(product));
    const embedChunks = chunkArray(embeds, 5);

    await Promise.all(embedChunks.map((chunk) => channel.send({ embeds: chunk })));
  }

  async destroy() {
    try {
      if (this.client) {
        this.client.destroy();
      }
    } catch {}
  }
}

export default DiscordBot;
