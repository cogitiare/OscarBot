const { ALL_CHANNEL_ID } = require("../../../constants");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    console.log(`old state ${oldState.channel}\nnew state ${newState.channel}`);
    if (oldState.channel === null && newState.channel !== null) {
      client.channels.cache
        .get(ALL_CHANNEL_ID)
        .send(`@ everyone ${newState.member.user.username} has started a call`);
    }
  },
};
