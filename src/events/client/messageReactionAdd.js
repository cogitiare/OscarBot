const {
  OSCAR_EMOJI_ID,
  HOF_CHANNEL_ID,
  ALL_CHANNEL_ID,
  GENERAL_CHANNEL_ID,
  SALUTE_EMOJI_ID,
} = require("../../../constants");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",
  async execute(messageReaction, user, client) {
    if (
      messageReaction.message.channel.id !== ALL_CHANNEL_ID &&
      messageReaction.message.channel.id !== GENERAL_CHANNEL_ID
    )
      return;

    // When a reaction is received, check if the structure is partial
    if (messageReaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await messageReaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    // DO the thing :/
    if (
      messageReaction.emoji.id === OSCAR_EMOJI_ID &&
      messageReaction.count == 3
    ) {
      const author = messageReaction.message.author;
      const messageEmbed = new EmbedBuilder()
        .setURL(messageReaction.message.url)
        .setColor("Gold")
        .setAuthor({ name: author.username, iconURL: author.avatarURL() })
        .setTitle(`<:salute:${SALUTE_EMOJI_ID}>`)
        .setDescription(messageReaction.message.content);

      // get images from message
      let attachments = [];
      let newEmbeds = [];
      if (messageReaction.message.attachments) {
        messageReaction.message.attachments.forEach((attachment) => {
          attachments.push(attachment.url);
        });

        // add each image to embed
        attachments.map((attachment) => {
          newEmbeds.push(
            new EmbedBuilder()
              .setURL(messageReaction.message.url)
              .setImage(attachment)
          );
        });
      }

      client.channels.cache
        .get(HOF_CHANNEL_ID)
        // combine embeds
        .send({ embeds: [messageEmbed, ...newEmbeds] });
    }
  },
};
