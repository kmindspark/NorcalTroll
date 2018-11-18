const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
});

client.on('message', message => {
   if (message.content.contains("winning worlds")) {
      client.message.send("8k WINNING WORLDS!")
   }
   if (message.content.startsWith("!predict")) {

      client.message.send("")
   }
   if (message.content.endsWith(".")) {
      message.delete(2000);
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
