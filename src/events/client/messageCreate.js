const { OSCAR_EMOJI_ID } = require("../../../constants");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.content.toLowerCase().includes("oscar")) {
      message.react(OSCAR_EMOJI_ID);
    }
  },
};
