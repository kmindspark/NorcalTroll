const Discord = require('discord.js');
var CronJob = require('cron').CronJob;

const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
   var channelID = '489645726914314270';
   //client.channels.get('514191866418298883').send('I have been rebooted!')
   new CronJob('00 00 21 * * *', function () {
      client.channels.get(channelID).send('<@&496874773771714570> Bedtime!')
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


client.on('messageUpdate', (oldMessage, newMessage) => {
   let curMessageContent = newMessage.content.trim().toLowerCase();
   let curMessageContentPeriod = curMessageContent.replace(/\*/g, '').replace(/\s/g, '').replace(/~/g, '').replace(/`/g, '');
   if (curMessageContentPeriod.endsWith(".")) {
      newMessage.delete(1000);
   }
   if (newMessage.member.displayName.includes("Ayush")) {
      if (newMessage.content.includes('?') || newMessage.content.includes('.') || newMessage.content.includes('!') || newMessage.content.includes(',')) {
         newMessage.delete(1000);
      }
   }
});

client.on('message', message => {
   let curMessageContent = message.content.trim().toLowerCase();
   let curMessageContentPeriod = curMessageContent.replace(/\*/g, '').replace(/\s/g, '').replace(/~/g, '').replace(/`/g, '');
   if (message.isMentioned(client.user) && myRandom(5)) {
      message.reply('stop with the mentions');
   }
   if (curMessageContentPeriod.endsWith(".")) {
      message.delete(1000);
   }
   if (message.member.displayName.includes("Ayush")) {
      if (message.content.includes('?') || message.content.includes('.') || message.content.includes('!') || message.content.includes(',')) {
         message.delete(1000);
      }
   }
   else if (curMessageContent === "fitch help") {
      message.channel.send({
         embed: {
            color: 3447003,
            title: "So, you need Fitch's help!",
            description: "**fitch ping:** Fitch replies with *pong* \n **fitch predict <question>:** Fitch gives a prediction!"
         }
      });
   }
   else if (curMessageContent === 'fitch ping') {
      message.reply('Pong!');
   }
   else if (curMessageContent.includes('fitch predict')) {
      if (myRandom(7)) {
         message.reply("I would say yes <:lewieok:494721325466910720>");
      }
      else if (myRandom(5)) {
         message.reply("As sure as 8k winning worlds! <:lewishappy:494723494727122950>");
      }
      else if (myRandom(3)) {
         message.reply("Nope not a chance <:sleep:494723089180000266>");
      }
      else {
         message.reply("Idk ask again");
      }
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
      message.channel.send("Yo DVT why didn't u get excellence at DV");
   }
   else if (message.member.displayName.includes("Andrew | 315") && myRandom(20)) {
      message.channel.send("007 thrower");
   }
   else if ((message.member.displayName.includes("NightBlaze") || message.member.displayName.includes("eirc")) && myRandom(15)) {
      message.channel.send("yo 315x shoulda picked Lewie at worlds");
   }
   else if (message.member.displayName.includes("Kau") && myRandom(25)) {
      message.channel.send("Kau Kau! Mooooo! <:MOOOOOO:494724750338162688>");
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
         message.channel.send("Someone said my name?");
      }
      else if (myRandom(5)) {
         message.channel.send("I'm better than Lewie");
      }
      else if (myRandom(5)) {
         message.channel.send("8k was good while I was part of it");
      }
   }
   else if (myRandom(100)) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

