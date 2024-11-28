import { Client, GatewayIntentBits } from "discord.js";
import { chunkArray, makeEmbed } from "../utils/index.js";

class DiscordBot {
  constructor(config) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.channels = {};

    Object.entries(config).forEach(([key, { channel }]) => {
      this.channels[key] = this.client.channels.cache.get(channel);
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  async sendProducts(key, products) {
    const embeds = products.map((product) => makeEmbed(product));
    const embedChunks = chunkArray(embeds, 10);
    const channel = this.channels[key];

    await Promise.all(
      embedChunks.map((chunk) => channel.send({ embeds: chunk }))
    );
  }
}

export default DiscordBot;
