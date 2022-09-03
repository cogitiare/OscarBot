module.exports = {
  name: "disconnect",
  async execute(queue, client) {
    client.channels.cache.get(BOT_CHANNEL_ID).send({ content: "Leaving VC" });
  },
};
