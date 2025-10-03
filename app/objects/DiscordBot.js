import { Client, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import { chunkArray, makeEmbed } from '../utils.js';

class DiscordBot {
  constructor(config) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
    this.client.login(process.env.DISCORD_TOKEN);
    this.channels = {};

    this.client.once(Events.ClientReady, (readyClient) => {
      Object.entries(config).forEach(([key, { channel }]) => {
        this.channels[key] = this.client.channels.cache.get(channel);
      });

      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    this.client.on(Events.GuildMemberAdd, (member) => this.sendJoinLeave(member, true));
    this.client.on(Events.GuildMemberRemove, (member) => this.sendJoinLeave(member, false));
  }

  getAccountAge(createdAt) {
    const now = Date.now();
    const diff = now - createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const d = days % 30;
    return `${years}y ${months}m ${d}d`;
  }

  async sendJoinLeave(member, joined) {
    const channel = this.client.channels.cache.get(process.env.LOGS_CHANNEL);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(joined ? 'Green' : 'Red')
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
      .setDescription(joined ? '✅ Joined' : '❌ Left')
      .addFields({ name: 'Account Age', value: this.getAccountAge(member.user.createdAt) })
      .setTimestamp();

    channel.send({ embeds: [embed] });
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
