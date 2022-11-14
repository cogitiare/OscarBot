const {
  ALL_CHANNEL_ID,
  MAIN_CALL_CHANNEL,
  BOT_GUILD_ID,
} = require("../../../constants");
const fs = require("fs");
const { Buffer } = require("buffer");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    console.log(
      `Members in VC: ${newState.member.voice.channel?.members.size}`
    );
    // On call start
    if (
      oldState.channel === null &&
      newState.channel !== null &&
      newState.member.voice.channel?.members.size === 1 &&
      newState.channelId === MAIN_CALL_CHANNEL
    ) {
      // write call start time to client variable
      const callStart = new Date();
      client.callStart = callStart;

      client.channels.cache
        .get(ALL_CHANNEL_ID)
        .send(`@everyone ${newState.member.user.username} has started a call`);
    } else if (
      newState.channel === null &&
      oldState.channelId === MAIN_CALL_CHANNEL
    ) {
      setTimeout(() => {
        let voiceChannel = client.guilds.cache
          .get(BOT_GUILD_ID)
          .channels.cache.get(MAIN_CALL_CHANNEL);

        if (voiceChannel.members.size === 0) {
          if (!client.callStart) return;
          const callEnd = new Date();
          const length = callEnd - client.callStart;

          client.channels.cache
            .get(ALL_CHANNEL_ID)
            .send(`Call ended - ${msToTime(length)}`);

          client.callStart = null;
        }
      }, 2000);
    }
  },
};

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}
