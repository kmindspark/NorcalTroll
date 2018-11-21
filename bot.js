const Discord = require('discord.js');
var CronJob = require('cron').CronJob;

const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
   var channelID = '489645726914314270';
   //client.channels.get('514191866418298883').send('I have been rebooted!')
   new CronJob('00 00 21 * * *', function () {
      client.channels.get(channelID).send('<@514310684134080512> Bedtime!')
   }, null, true, 'America/Los_Angeles');
   new CronJob('00 00 9 * * *', function () {
      if (myRandom(3)) {
         client.channels.get(channelID).send('Good morning everyone!')
      }
   }, null, true, 'America/Los_Angeles');
   new CronJob('00 00 22 * * *', function () {
      if (myRandom(3)) {
         client.channels.get(channelID).send('Good night everyone!')
      }
   }, null, true, 'America/Los_Angeles');
});

function myRandom(odds) {
   return (Math.floor((Math.random() * odds) + 1)) == 1;
};

client.on('message', message => {
   let curMessageContent = message.content.toLowerCase();
   if (message.isMentioned(client.user) && myRandom(5)) {
      message.reply('stop with the mentions');
   }
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
      message.reply('Pong!');
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
   else if (message.member.roles.find("name", "315") && myRandom(25)) {
      message.channel.send("315 throwers");
   }
   else if (message.member.roles.find("name", "139") && myRandom(20)) {
      message.channel.send("139 is fake Gael Force");
   }
   else if (message.member.roles.find("name", "5327") && myRandom(20)) {
      message.channel.send("Notebook tryhards");
   }
   else if (curMessageContent.includes("fitch")) {
      if (myRandom(5)) {
         message.channel.send("Someone said my name?")
      }
      else if (myRandom(5)) {
         message.channel.send("I'm better than Lewie")
      }
      else if (myRandom(5)) {
         message.channel.send("8k was good while I was part of it")
      }
   }
   else if (myRandom(100)) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

