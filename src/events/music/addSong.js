const { BOT_CHANNEL_ID } = require("../../../constants");

module.exports = {
  name: "addSong",
  async execute(queue, song, client) {
    client.channels.cache
      .get(BOT_CHANNEL_ID)
      .send(`${song.user} Added ${song.name} to the queue`);
  },
};
