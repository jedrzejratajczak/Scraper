import { EmbedBuilder } from "discord.js";

const makeEmbed = ({
  src = "Brak",
  price = "Brak",
  title = "Brak",
  productId = "Brak",
  href = "Brak",
}) =>
  new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setURL(href)
    .setThumbnail(src)
    .setFooter({ text: `ID: ${productId}` })
    .setTimestamp()
    .addFields({ name: "Cena", value: price }, { name: "Url", value: href });

export default makeEmbed;
