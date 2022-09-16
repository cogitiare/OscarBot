const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Kicks OscarBot out of the voice call"),
  async execute(interaction, client) {
    interaction
      .reply({ content: "...", fetchReply: true })
      .then((message) => message.delete())
      .catch(console.error);

    client.DisTube.voices.leave(interaction);
  },
};
