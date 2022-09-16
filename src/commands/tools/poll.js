const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("creates a poll with up to 4 options")
    .addStringOption((option) =>
      option
        .setName("pollquestion")
        .setDescription("Question to poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option1")
        .setDescription("First poll option")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option2")
        .setDescription("Second poll option")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option3")
        .setDescription("Third poll option")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option4")
        .setDescription("Fourth poll option")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const OPT_EMOJI_A = "1️⃣";
    const OPT_EMOJI_B = "2️⃣";
    const OPT_EMOJI_C = "3️⃣";
    const OPT_EMOJI_D = "4️⃣";

    const pollQuestion = interaction.options.get("pollquestion")?.value;
    const optA = interaction.options.get("option1").value;
    const optB = interaction.options.get("option2").value;
    const optC = interaction.options.get("option3")?.value;
    const optD = interaction.options.get("option4")?.value;

    if (!optA || !optB) return;

    const newMessage = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: interaction.member.user.username,
      })
      .setTitle(pollQuestion)
      .addFields(
        { name: `${OPT_EMOJI_A}`, value: `${optA}` },
        { name: `${OPT_EMOJI_B}`, value: `${optB}` }
      );

    if (optC) {
      newMessage.addFields({ name: `${OPT_EMOJI_C}`, value: `${optC}` });
    }
    if (optD) {
      newMessage.addFields({ name: `${OPT_EMOJI_D}`, value: `${optD}` });
    }

    const msg = await interaction.reply({
      embeds: [newMessage],
      fetchReply: true,
    });

    msg.react(OPT_EMOJI_A);
    msg.react(OPT_EMOJI_B);

    if (optC) msg.react(OPT_EMOJI_C);

    if (optD) msg.react(OPT_EMOJI_D);
  },
};
