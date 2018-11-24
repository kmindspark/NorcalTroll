const Discord = require('discord.js');
var CronJob = require('cron').CronJob;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const client = new Discord.Client();

function httpGet(theUrl) {
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open("GET", theUrl, false); // false for synchronous request
   xmlHttp.send(null);
   return xmlHttp.responseText;
}

function getWinPercent(teamOfInterest) {
   let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Turning%20Point&team=" + teamOfInterest);
   let result = JSON.parse(resp).result;
   let win = 0;
   let tie = 0;
   let loss = 0;
   for (i = 0; i < result.length; i++) {
      var red = false;
      if (result[i].red1 === teamOfInterest || result[i].red2 === teamOfInterest) {
         red = true;
      }
      if (result[i].redscore == result[i].bluescore) {
         tie++;
      }
      else if (result[i].redscore > result[i].bluescore) {
         if (red) {
            win++;
         }
         else {
            loss++;
         }
      }
      else {
         if (red) {
            loss++;
         }
         else {
            win++;
         }
      }
   }
   if (win + loss + tie == 0) {
      return 0
   }
   else {
      return (win / (win + tie + loss));
   }
}

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
   if (curMessageContent === "fitch help" || curMessageContent === "f help") {
      message.channel.send({
         embed: {
            color: 3447003,
            title: "So, you need Fitch's help!",
            description: "**f ping:** Fitch replies with *pong* \n **f predict <question>:** Fitch gives a prediction! \n \
               ** f record <team>:** Fitch tells you the W-L-T record for the specified team."
         }
      });
   }
   else if (curMessageContent === 'f ping') {
      message.reply('Pong!');
   }
   else if (curMessageContent === 'f rank') {
      var teamsToRank = ['315G', '315X', '315Z', '315Y', '315Z', '315R', '5776A', '5776T', '5776X', '86868R', '5327A', '5327C', '5327S', '5327R', '5327X', '139A', '7916A', '21246D'];
      var vals = [];
      let finalString = '';
      for (i = 0; i < teamsToRank.length; i++) {
         vals.push(getWinPercent(teamsToRank[i]));
      }

      let count = 1
      while (teamsToRank.length > 0) {
         let i = vals.indexOf(Math.max(...vals));
         let winPct = vals.splice(i, 1);
         let curTeam = teamsToRank.splice(i, 1);
         finalString = finalString + i + ". " + curTeam[0] + ": " + Math.round(original * 10000) / 100 + "\n"
         count++;
      }

      message.channel.send({
         embed: {
            color: 16711782,
            title: "Norcal Team Rankings",
            description: finalString
         }
      });
   }
   else if (curMessageContent.includes('f record')) {
      let teams = curMessageContent.split(" ");
      if (teams.length != 3 && teams.length != 4) {
         //bad case
      }
      else {
         let teamOfInterest = teams[2].toUpperCase();
         let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Turning%20Point&team=" + teamOfInterest);
         let result = JSON.parse(resp).result;
         let win = 0;
         let tie = 0;
         let loss = 0;
         if (teams.length >= 3) {
            for (i = 0; i < result.length; i++) {
               let comparison = teams.length == 4;
               let validComparison = !comparison;
               var red = false;
               if (result[i].red1 === teamOfInterest || result[i].red2 === teamOfInterest) {
                  red = true;
               }
               if (comparison) {
                  if (red && (result[i].blue1 === teams[3].toUpperCase() || result[i].blue2 === teams[3].toUpperCase())
                     || (!red && (result[i].red1 === teams[3].toUpperCase() || result[i].red2 === teams[3].toUpperCase()))) {
                     validComparison = true;
                  }
               }
               if (validComparison) {
                  if (result[i].redscore == result[i].bluescore) {
                     tie++;
                  }
                  else if (result[i].redscore > result[i].bluescore) {
                     if (red) {
                        win++;
                     }
                     else {
                        loss++;
                     }
                  }
                  else {
                     if (red) {
                        loss++;
                     }
                     else {
                        win++;
                     }
                  }
               }
            }
            var myAppend = "";
            if (teams.length == 4) {
               myAppend = " against " + teams[3].toUpperCase();
            }
            message.channel.send({
               embed: {
                  color: 1302784,
                  title: "Record for " + teamOfInterest + myAppend,
                  description: win + "-" + loss + "-" + tie
               }
            });
         }
      }
   }
   else if (curMessageContent.includes('f predict')) {
      if (myRandom(6)) {
         message.reply("I would say yes <:lewieok:494721325466910720>");
      }
      else if (myRandom(4)) {
         message.reply("As sure as 8k winning worlds! <:lewishappy:494723494727122950>");
      }
      else if (myRandom(2)) {
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
   else if (message.member.displayName.includes("Kau") && myRandom(35)) {
      message.channel.send("Kau Kau! Mooooo! <:MOOOOOO:494724750338162688>");
   }
   else if (message.member.roles.find("name", "315") && myRandom(25)) {
      message.channel.send("315 throwers");
   }
   else if (message.member.roles.find("name", "139") && myRandom(35)) {
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
   else if (myRandom(500)) {
      message.channel.send('Hello everyone!');
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);

