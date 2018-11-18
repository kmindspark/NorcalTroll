const Discord = require('discord.js');
const client = new Discord.Client();

function sleep(milliseconds) {
   var start = new Date().getTime();
   for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
         break;
      }
   }
}

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
      sleep(1000);
      message.channel.send('3');
      sleep(1000);
      message.channel.send('2');
      sleep(1000);
      message.channel.send('1');
      sleep(1000);
      message.channel.send('made u look');
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
