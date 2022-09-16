const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { BOT_CLIENT_ID, BOT_GUILD_ID } = require("../../../constants");

const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`${folder}: ${command.data.name} Command handled`);
      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
    try {
      console.log("Started refresing (/) commands");

      await rest.put(
        Routes.applicationGuildCommands(BOT_CLIENT_ID, BOT_GUILD_ID),
        {
          body: client.commandArray,
        }
      );

      console.log("Loaded (/) commands");
    } catch (error) {
      console.log(error);
    }
  };
};
