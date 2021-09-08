const { Client, VoiceChannel, Collection, Intents  } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');

const client = new Client({presence: {status: 'online', activities: [{name: "eating dryer lint", type: "PLAYING"}]}, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const { Player } = require('discord-music-player');
const player = new Player(client, {
    // options here
})
client.player = player;

const fs = require('fs');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

var count;
require("dotenv").config();

  client.events = new Map();
  client.prefix = config.prefix;
  
  registerEvents(client, '../events');
  client.login(process.env.BOT_TOKEN);
  
  // Message/command listeners
  client.on('message', async (msg) => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }

    if(msg.content.toLowerCase().includes("oscar")){
      const reactionEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'oscar');
      msg.react(reactionEmoji);
    }

    // Get arguments from command
    const args = msg.content.slice(client.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let guildQueue = client.player.getQueue(msg.guild.id);

    // Play song command
    if(command === "play"){

      const voiceChannel = msg.member.voice.channel;

      // If no arguments are supplied
      if(!args.length) return msg.channel.send("You gotta give me more arguments in the command");

      // If user isn't in VC
      if(!voiceChannel) return msg.channel.send("Don't use this command when you're not in VC mister");

      // Create a queue to load the song from and play it. Once nothing is left, leave
      let queue = client.player.createQueue(msg.guild.id);
      await queue.join(msg.member.voice.channel);
      let song = await queue.play(args.join(' ')).catch(_ => {
          if(!guildQueue)
              queue.stop();
      });
    }

    // Leave channel command
    if(command === "leave" && guildQueue){
      guildQueue.stop();
    } 
    if(command === 'skip') {
      guildQueue.skip();
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
      // channel.send(message);
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
 });
  client.player
    .on('songAdd', (queue, song) => {
      // Send message to bot command channel
      client.channels.cache.get('818325157512609873').send(`Added ${song}`);
      console.log(song.name);
    })
    .on('clientDisconnect', (queue) => {
      // Send message to bot command channel
      client.channels.cache.get('818325157512609873').send('Leaving VC');
    })
    .on('error', (error, queue) => {
      client.channels.cache.get('818325157512609873').send(`Error: ${error}`);
    })
    .on('queueEnd', (queue) => { 
      client.channels.cache.get('818325157512609873').send('Leaving VC');
    })
    .on('songChanged', (queue, newSong, oldSong) => {
      client.channels.cache.get('818325157512609873').send(`${newSong} is now playing.`);
    });

