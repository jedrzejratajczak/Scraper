import {
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
} from 'discord.js';
import { chunkArray, makeEmbed } from '../utils';

class DiscordBot {
  constructor(config) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
      partials: [Partials.Message, Partials.Reaction],
    });
    this.client.login(process.env.DISCORD_TOKEN);
    this.config = config;

    this.client.once(Events.ClientReady, (readyClient) => {
      Object.values(this.config).forEach((data) => {
        data.channelUrl = this.client.channels.cache.get(data.channel);
      });

      this.setupRolesMessage();
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    this.client.on(Events.GuildMemberAdd, (member) => this.sendJoinLeave(member, true));
    this.client.on(Events.GuildMemberRemove, (member) => this.sendJoinLeave(member, false));
    this.client.on(Events.InteractionCreate, (interaction) => this.handleInteraction(interaction));
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

    if (joined) {
      await member.roles.add(process.env.VC_ROLE);
    }
  }

  async sendError(key, error) {
    try {
      const channel = this.client.channels.cache.get(process.env.LOGS_CHANNEL);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('⚠️ App Error')
        .addFields(
          { name: 'Key', value: key || 'Unknown' },
          { name: 'Error', value: error.toString().substring(0, 1024) }
        )
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch {}
  }

  async sendProducts(key, products) {
    const { channelUrl, role } = this.config[key];

    if (!channelUrl || products.length === 0) return;

    const embeds = products.map((product) => makeEmbed(product));
    const embedChunks = chunkArray(embeds, 5);

    await Promise.all(
      embedChunks.map((chunk, index) => {
        const payload = {
          embeds: chunk,
          content: index === 0 && role ? `<@&${role}>` : undefined,
        };
        return channelUrl.send(payload);
      })
    );
  }

  getRoleOptions(interaction, member) {
    const uniqueRoles = new Map();

    Object.values(this.config)
      .filter(({ role, channel }) => role && channel)
      .forEach(({ role: roleId, emoji }) => {
        if (!uniqueRoles.has(roleId)) {
          const role = interaction.guild.roles.cache.get(roleId);
          if (role) {
            const hasRole = member.roles.cache.has(roleId);
            uniqueRoles.set(roleId, { role, emoji, hasRole });
          }
        }
      });

    return Array.from(uniqueRoles.values()).map(({ role, emoji, hasRole }) => {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(role.name)
        .setValue(role.id)
        .setDescription(`Włącz powiadomienia dla ${role.name}`)
        .setDefault(hasRole);

      if (emoji) option.setEmoji(emoji);

      return option;
    });
  }

  createRoleSelectComponents(roleOptions) {
    const chunks = [];
    for (let i = 0; i < roleOptions.length; i += 25) {
      chunks.push(roleOptions.slice(i, i + 25));
    }

    return chunks.map((chunk, index) => {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`role_select_${index}`)
        .setPlaceholder(`Wybierz powiadomienia (${index + 1}/${chunks.length})`)
        .setMinValues(0)
        .setMaxValues(chunk.length)
        .addOptions(chunk);

      return new ActionRowBuilder().addComponents(selectMenu);
    });
  }

  getRoleSelectionMessage(roleOptions, interaction) {
    const currentRoles = roleOptions
      .filter((opt) => opt.data.default)
      .map((opt) => interaction.guild.roles.cache.get(opt.data.value)?.name || opt.data.value);

    return currentRoles.length > 0
      ? `**Obecne powiadomienia:** ${currentRoles.join(", ")}\n\nWybierz powiadomienia, które chcesz otrzymywać (odznacz, aby usunąć):`
      : "Wybierz powiadomienia, które chcesz otrzymywać:";
  }

  async setupRolesMessage() {
    const channel = this.client.channels.cache.get(process.env.ROLES_CHANNEL);

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle("Wybierz swoje role i odbieraj tylko te powiadomienia, które Cię interesują!")
      .setDescription("Na Discordzie nie ma spamu - to Ty decydujesz, o czym chcesz być informowany.\nPo kliknięciu \"Kliknij tutaj i wybierz powiadomienia\" pojawią się dwa okna z możliwością wyboru.\nMożna wybrać dowolną liczbę kategorii.\nJedno ma limit 25 kategorii, dlatego wybieramy w 2 oknach");

    const button = new ButtonBuilder()
      .setCustomId("setup_roles")
      .setLabel("Kliknij tutaj i wybierz powiadomienia")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    const message = await channel.messages.fetch(process.env.ROLES_MESSAGE_ID);
    await message.edit({ embeds: [embed], components: [row] });
  }

  async handleInteraction(interaction) {
    const member = interaction.member;

    if (interaction.isButton() && interaction.customId === "setup_roles") {
      const roleOptions = this.getRoleOptions(interaction, member);
      const rows = this.createRoleSelectComponents(roleOptions);
      const contentMessage = this.getRoleSelectionMessage(roleOptions, interaction);

      await interaction.reply({
        content: contentMessage,
        components: rows.slice(0, 5),
        flags: MessageFlags.Ephemeral,
      });

      setTimeout(async () => {
        try { await interaction.deleteReply() } catch {}
      }, 300000);
    } else if (
      interaction.isStringSelectMenu() &&
      interaction.customId.startsWith("role_select")
    ) {
      await interaction.deferUpdate();

      const selectedRoleIds = interaction.values;

      const dropdownIndex = parseInt(interaction.customId.split("_")[2]);

      const allRoleOptions = this.getRoleOptions(interaction, member);
      const roleChunks = [];
      for (let i = 0; i < allRoleOptions.length; i += 25) {
        roleChunks.push(allRoleOptions.slice(i, i + 25));
      }

      const currentDropdownRoleIds = roleChunks[dropdownIndex].map(opt => opt.data.value);

      const rolesToRemove = currentDropdownRoleIds.filter((roleId) => !selectedRoleIds.includes(roleId));

      for (const roleId of selectedRoleIds) {
        if (!member.roles.cache.has(roleId)) await member.roles.add(roleId);
      }

      for (const roleId of rolesToRemove) {
        if (member.roles.cache.has(roleId)) await member.roles.remove(roleId);
      }

      const roleOptions = this.getRoleOptions(interaction, member);
      const rows = this.createRoleSelectComponents(roleOptions);
      const contentMessage = this.getRoleSelectionMessage(roleOptions, interaction);

      await interaction.editReply({ content: contentMessage, components: rows.slice(0, 5) });
    }
  }

  async destroy() {
    try { if (this.client) this.client.destroy() } catch {}
  }
}

export default DiscordBot;
