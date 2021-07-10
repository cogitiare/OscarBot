const { Client, VoiceChannel } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client();
var count;
require("dotenv").config();

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.BOT_TOKEN);

  client.user.setPresence({
    status: "online",  //You can show online, idle....
    activity: {
        name: "eating dryer lint",  //The message shown
        type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
    }
});
  
  //Testing message listeners
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }

    if(msg.content.toLowerCase().includes("oscar")){
      const reactionEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'oscar');
      msg.react(reactionEmoji);
    }
  });

 
  // MAKE A COUNTER TO + WHEN CALL JOIN - ON CALL LEAVE AND KEEP COUNT
  client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember;
    let oldUserChannel = oldMember;

    const channelID = '818322488298700832'; //General channel
    const message = '@everyone Someone has started a call'
    const channel = newMember.guild.channels.cache.get(channelID);


    if(count==null){
      count = 0;
    }
    //user joins
    if((newUserChannel.channel !== null) && (oldUserChannel.channel === null) && (count == 0)){
      count++;
      console.log(count + " person in voice chat.");
      channel.send(message);
    }
    else if(newUserChannel.channel !== null && oldUserChannel.channel === null){
      count++;      
      console.log(count + " people in voice chat.");
      //channel.send(message);
    }
    else if(newUserChannel.channel === null && oldUserChannel.channel !== null){
      count--;      
      console.log(count + " people in voice chat.");
      //channel.send(count);
    }

 },);

})();

