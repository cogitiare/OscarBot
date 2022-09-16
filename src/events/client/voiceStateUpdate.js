const { ALL_CHANNEL_ID, MAIN_CALL_CHANNEL } = require("../../../constants");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    console.log(
      `Members in VC: ${newState.member.voice.channel?.members.size}`
    );
    if (
      oldState.channel === null &&
      newState.channel !== null &&
      newState.member.voice.channel?.members.size === 1 &&
      newState.channelId === MAIN_CALL_CHANNEL
    ) {
      client.channels.cache
        .get(ALL_CHANNEL_ID)
        .send(`@everyone ${newState.member.user.username} has started a call`);
    }
  },
};
