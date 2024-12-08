import { EmbedBuilder } from "discord.js";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const makeEmbed = ({
  src = "Brak",
  price = "Brak",
  title = "Brak",
  productId = "Brak",
  href = "Brak",
}) => {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setFooter({ text: `ID: ${productId}` })
    .setTimestamp()
    .addFields({ name: "Cena", value: price });

  if (isValidUrl(src)) {
    embed.setThumbnail(src);
  }

  if (isValidUrl(href)) {
    embed.setURL(href).addFields({ name: "Url", value: href });
  }

  return embed;
};

export default makeEmbed;
