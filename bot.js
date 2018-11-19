const Discord = require('discord.js');
var cron = require('node-cron');
const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
});

client.on('message', message => {
   if (message.content === 'ping') {
      message.reply('pong');
   }
   if (message.content.toLowerCase().includes('winning worlds')) {
      if (message.author.id !== client.user.id) {
         message.channel.send('8k IS WINNING WORLDS!');
      }
   }
   if (message.content.endsWith(".")) {
      message.delete(1000);
   }
   if (message.content.toLowerCase().includes("leek")) {
      message.channel.send('fingerslip?');
      setTimeout(function () { message.channel.send('made u look'); }, 1000);
   }
   if (message.content.toLowerCase().includes("vex is bad")) {
      message.channel.send('that\'s why I quit');
   }
   if ((Math.floor((Math.random() * 30) + 1)) == 25) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);