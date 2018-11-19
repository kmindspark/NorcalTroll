const Discord = require('discord.js');
var cron = require('node-cron');

const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
   client.channels.get('514191866418298883').send('I have been rebooted!')
   cron.schedule("05 * * * * *", function () {
      client.channels.get('514191866418298883').send('@9pm bedtime Bedtime!')
      console.log("running a task every minute");
   });

   /*var job = new cron.CronJob('22 40 * * *', function () {
      client.channels.get('489645726914314270').send('@9pm bedtime Bedtime!')
   }, null, true);*/
});

function myRandom(odds) {
   return (Math.floor((Math.random() * odds) + 1)) == 1;
};

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
            description: "**fitch ping:** Fitch replies with *pong*"
         }
      });
   }
   else if (curMessageContent === 'fitch ping') {
      message.reply('fitch pong');
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
   else if (message.member.displayName.includes("5776T") && myRandom(10)) {
      message.channel.send("Yo DVT why didn't u get excellence at DV")
   }
   else if (message.member.displayName.includes("Andrew | 315") && myRandom(10)) {
      message.channel.send("007 thrower")
   }
   else if ((message.member.displayName.includes("NightBlaze") || message.member.displayName.includes("eirc")) && myRandom(15)) {
      message.channel.send("yo 315x shoulda picked Lewie at worlds")
   }
   else if (message.member.displayName.includes("Kau") && myRandom(15)) {
      message.channel.send("Kau Kau! Mooooo!")
   }
   else if (myRandom(100)) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

