const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
});

client.on('message', message => {
   if (message.content === 'ping') {
      message.reply('pong.');
   }
   else if (message.content.endsWith(".")) {
      message.delete(1000);
   }
   else if (message.content.toLowerCase().includes("leek")) {
      message.channel.send('fingerslip?');
   }
   else if (message.content.toLowerCase().includes("vex is bad")) {
      message.channel.send('that\'s why I quit');
   }
   else if ((Math.floor((Math.random() * 50) + 1)) == 42) {
      message.channel.send('Hello everyone!')
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
