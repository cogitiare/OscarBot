const { BOT_CHANNEL_ID } = require("../../../constants");

module.exports = {
  name: "playSong",
  async execute(queue, song, client) {
    client.channels.cache
      .get(BOT_CHANNEL_ID)
      .send(`Playing song ${song.name} - ${song.formattedDuration}`);
  },
};
