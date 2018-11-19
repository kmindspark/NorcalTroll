const Discord = require('discord.js');
var cron = require('node-cron');
const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
});

client.on('message', message => {
   let curMessageContent = message.content.toLowerCase();
   if (curMessageContent.endsWith(".")) {
      message.delete(1000);
   }
   else if (curMessageContent === "fitch help") {
      message.channel.send({
         embed: {
            color: 3447003,
            title: "So, you need Fitch's help!",
            description: "**ping:** Fitch replies with **pong** \n \
            **Message containing \"winning worlds\"**: Fitch pulls a classic"
         }
      });
   }
   else if (curMessageContent === 'ping') {
      message.reply('pong');
   }
   else if (curMessageContent.includes('win') && curMessageContent.includes('worlds')) {
      if (message.author.id !== client.user.id) {
         message.channel.send('8k IS WINNING WORLDS!');
      }
   }
   else if (curMessageContent.includes("leek")) {
      message.channel.send('fingerslip?');
      setTimeout(function () { message.channel.send('made u look'); }, 1000);
   }
   else if (curMessageContent.includes("vex is bad")) {
      message.channel.send('that\'s why I quit');
   }
   else if ((Math.floor((Math.random() * 30) + 1)) == 25) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);