module.exports = {
  name: "error",
  async execute(channel, error) {
    if (channel) channel.send({ content: `An error occurred: ${error}` });
  },
};
