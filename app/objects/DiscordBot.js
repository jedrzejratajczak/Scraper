import { Client, EmbedBuilder, Events, GatewayIntentBits, Partials } from 'discord.js';
import { chunkArray, makeEmbed } from '../utils.js';

class DiscordBot {
  constructor(config) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
      partials: [Partials.Message, Partials.Reaction],
    });
    this.client.login(process.env.DISCORD_TOKEN);
    this.channels = {};
    this.roles = {};
    this.emojis = {};
    this.emojiToRole = {};

    this.client.once(Events.ClientReady, (readyClient) => {
      Object.entries(config).forEach(([key, { channel, role, emoji }]) => {
        this.channels[key] = this.client.channels.cache.get(channel);
        this.roles[key] = role;
        this.emojis[key] = emoji;
        this.emojiToRole[emoji] = role;
      });

      this.setupRolesMessage();
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    this.client.on(Events.GuildMemberAdd, (member) => this.sendJoinLeave(member, true));
    this.client.on(Events.GuildMemberRemove, (member) => this.sendJoinLeave(member, false));
    this.client.on(Events.MessageReactionAdd, (reaction, user) => this.handleReaction(reaction, user, true));
    this.client.on(Events.MessageReactionRemove, (reaction, user) => this.handleReaction(reaction, user, false));
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
    const role = this.roles[key];

    if (!channel || products.length === 0) return;

    const embeds = products.map((product) => makeEmbed(product));
    const embedChunks = chunkArray(embeds, 5);

    await Promise.all(
      embedChunks.map((chunk, index) => {
        const payload = {
          embeds: chunk,
          content: index === 0 && role ? `<@&${role}>` : undefined,
        };
        return channel.send(payload);
      })
    );
  }

  async setupRolesMessage() {
    const channel = this.client.channels.cache.get(process.env.ROLES_CHANNEL);

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle(process.env.ROLES_TITLE)
      .setDescription(process.env.ROLES_DESCRIPTION);

    const message = await channel.messages.fetch(process.env.ROLES_MESSAGE_ID);
    await message.edit({ embeds: [embed] });

    const message2 = await channel.messages.fetch(process.env.ROLES_MESSAGE_ID_2);
    await message2.edit({ content: '.' });

    const allEmojis = Object.values(this.emojis).filter((e) => e);

    const existingReactions1 = message.reactions.cache.map((r) => r.emoji.id || r.emoji.name);
    const existingReactions2 = message2.reactions.cache.map((r) => r.emoji.id || r.emoji.name);

    for (const emojiKey of existingReactions1) {
      if (!allEmojis.includes(emojiKey)) {
        const reaction = message.reactions.cache.find((r) => (r.emoji.id || r.emoji.name) === emojiKey);
        await reaction.remove();
      }
    }

    for (const emojiKey of existingReactions2) {
      if (!allEmojis.includes(emojiKey)) {
        const reaction = message2.reactions.cache.find((r) => (r.emoji.id || r.emoji.name) === emojiKey);
        await reaction.remove();
      }
    }

    const currentReactions1 = message.reactions.cache.map((r) => r.emoji.id || r.emoji.name);
    const currentReactions2 = message2.reactions.cache.map((r) => r.emoji.id || r.emoji.name);
    const allCurrentReactions = [...currentReactions1, ...currentReactions2];

    for (const emojiId of allEmojis) {
      if (allCurrentReactions.includes(emojiId)) continue;

      if (currentReactions1.length < 20) {
        await message.react(emojiId);
        currentReactions1.push(emojiId);
      } else {
        await message2.react(emojiId);
        currentReactions2.push(emojiId);
      }
    }
  }

  async handleReaction(reaction, user, added) {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const messageId = process.env.ROLES_MESSAGE_ID;
    const messageId2 = process.env.ROLES_MESSAGE_ID_2;
    if (reaction.message.id !== messageId && reaction.message.id !== messageId2) return;

    const emojiKey = reaction.emoji.id || reaction.emoji.name;
    const roleId = this.emojiToRole[emojiKey];
    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);

    if (added) {
      await member.roles.add(roleId);
    } else {
      await member.roles.remove(roleId);
    }
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
