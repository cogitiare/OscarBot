const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds it to the current queue")
    .addStringOption((option) =>
      option
        .setName("songlink")
        .setDescription("The link to the same or name to search Youtube for")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply(
        "You must be in a voice channel to use this command"
      );
    } else {
      interaction
        .reply({ content: "...", fetchReply: true })
        .then((message) => message.delete())
        .catch(console.error);

      const searchInput = interaction.options.get("songlink").value;

      try {
        client.DisTube.play(voiceChannel, searchInput, {
          interaction,
          textChannel: interaction.textChannel,
          member: interaction.member,
        });
      } catch (e) {}
    }
  },
};
