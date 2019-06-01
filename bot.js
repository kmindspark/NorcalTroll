const Discord = require('discord.js');
var CronJob = require('cron').CronJob;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const client = new Discord.Client();
let cumulativeNames = ""
let curTeam = ""
let memberCount = 0

function addNicknameIfValid(key) {
   let nickname = key.displayName;
   if (nickname.includes(curTeam.toUpperCase())) {
      cumulativeNames += nickname + "\n"
      memberCount += 1;
   }
}

function httpGet(theUrl) {
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open("GET", theUrl, false); // false for synchronous request
   xmlHttp.send(null);
   return xmlHttp.responseText;
}

function getWinPercent(teamOfInterest, message) {
   let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Tower%20Takeover&team=" + teamOfInterest);
   let result = JSON.parse(resp).result;
   let win = 0.0;
   let tie = 0.0;
   let loss = 0.0;
   for (k = 0; k < result.length; k++) {
      var red = false;
      if (result[k].red1 === teamOfInterest || result[k].red2 === teamOfInterest) {
         red = true;
      }
      if (result[k].redscore == result[k].bluescore) {
         tie++;
      }
      else if (result[k].redscore > result[k].bluescore) {
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
      return 0;
   }
   else {
      return ((win + 0.5 * tie) / (win + tie + loss));
   }
}
/*
function getTeamsFromTourney(keyword) {
   let resp = httpGet("https://api.vexdb.io/v1/get_events?program=VRC&season=Tower%20Takeover&country=United%20States&region=California");
   let result = JSON.parse(resp).result;
   let keywords = keyword.split(" ");

   for (i = 0; i < result.length; i++) {
      let curEventName = result[i].name;
      let valid = true;
      for (j = 2; j < keywords.length; j++) {
         valid = valid & (curEventName.includes(keywords[j]));
      }
      if (valid){

         break;
      }
   }
}*/


client.on('ready', () => {
   console.log('I am ready!');
   var channelID = '515786957125844996';
   //client.channels.get('514191866418298883').send('I have been rebooted!')
   /*new CronJob('00 00 21 * * *', function () {
      if (myRandom(10)) {
         client.channels.get(channelID).send('<@&515788603666989057> Bedtime!')
      }
   }, null, true, 'America/Los_Angeles');*/
   new CronJob('00 00 9 * * *', function () {
      if (myRandom(10)) {
         client.channels.get(channelID).send('Good morning everyone!')
      }
   }, null, true, 'America/Los_Angeles');
   new CronJob('00 00 22 * * *', function () {
      if (myRandom(10)) {
         client.channels.get(channelID).send('Good night everyone!')
      }
   }, null, true, 'America/Los_Angeles');
});

function myRandom(odds) {
   return (Math.floor((Math.random() * odds) + 1)) == 1;
};


client.on('messageUpdate', (oldMessage, newMessage) => {
   let curMessageContent = newMessage.content.trim().toLowerCase();
   let curMessageContentPeriod = curMessageContent.replace(/\*/g, '').replace(/\s/g, '').replace(/~/g, '').replace(/`/g, '').replace(/\|/g, '');
   if (curMessageContentPeriod.endsWith(".")) {
      newMessage.delete(2000);
   }
});

client.on('message', message => {
   let curMessageContent = message.content.trim().toLowerCase();
   let curMessageContentPeriod = curMessageContent.replace(/\*/g, '').replace(/\s/g, '').replace(/~/g, '').replace(/`/g, '').replace(/\|/g, '');
   if (message.isMentioned(client.user) && myRandom(5)) {
      message.reply('stop with the mentions');
   }
   if (curMessageContentPeriod.endsWith(".")) {
      message.delete(2000);
   }
   if (curMessageContent === "fitch help" || curMessageContent === "f help") {
      message.channel.send({
         embed: {
            color: 3447003,
            title: "So, you need Fitch's help!",
            description: "**f ping:** Fitch replies with *pong*. \n **f predict <question>:** Fitch gives a prediction! \n \
               ** f record <team> <optional team>:** Fitch tells you the W-L-T record for the specified team, and head to head if another team is specified. \n \
               ** f arecord <team> <alliance>:** Fitch tells you the W-L-T for the specified alliance. \n \
               ** f orecord <team>:** Fitch gives you a record for the whole organization. \n \
               ** f rank:** Fitch gives you a ranking of NorCal teams based on win percentages. \n \
               ** f events:** Fitch gives you a listing of upcoming events in California. \n \ "
         }
      });
   }
   else if (curMessageContent === 'f ping') {
      message.reply('Pong!');
   }
   else if (curMessageContent === 'f events') {
      cumulativeNames = ""
      let resp = httpGet("https://api.vexdb.io/v1/get_events?season=Tower%20Takeover&region=California&status=future");
      let result = JSON.parse(resp).result;

      for (i = 0; i < result.length; i++) {
         if (i != 0) {
            cumulative += "\n"
         }
         let eventName = result[i].name;
         let eventDate = result[i].start;
         eventDate = eventDate.substr(0, eventDate.indexOf('T'));
         eventYear = eventDate.substr(0, eventDate.indexOf("-") + 1);
         eventDate = (eventDate.substr(eventDate.indexOf("-") + 1) + "-" + eventYear).substring(0, (eventDate.substr(eventDate.indexOf("-") + 1) + "-" + eventYear).length - 1);

         cumulative += eventDate + ": " + eventName;
      }

      message.channel.send({
         embed: {
            color: 16711782,
            title: "Upcoming California Events",
            description: cumulative
         }
      });
   }
   else if (curMessageContent.includes('f members')) {
      let server = message.guild;
      curTeam = ""
      cumulativeNames = ""
      memberCount = 0;
      server.fetchMembers().then((guild) => {
         let size = guild.members.size;
         let teams = curMessageContent.split(" ");
         curTeam = teams[2];

         guild.members.map((key) => addNicknameIfValid(key));

         cumulativeNames = cumulativeNames.substr(0, cumulativeNames.length - 1);

         message.channel.send({
            embed: {
               color: 16711782,
               title: "Members of " + teams[2].toUpperCase() + " (" + memberCount + ")",
               description: cumulativeNames
            }
         });
      })
   }
   else if (curMessageContent === 'f rank') {
      // TURNING POINT: var teamsToRank = ['315X', '315G', '315J', '315Z', '315R', '920C', '5776A', '5776E', '5776T', '5776X', '86868R', '5327B', '5327C', '5327S', '5327R', '5327X', '139A', '7916A', '21246D', '8000A', '8000B', '8000C', '8000D', '22095A', '315Y', '139Z', '8000F', '1350X', '1350Z'];
      var teamsToRank = ['315A', '315T', '315R', '315S', '315V', '315W', '315Y', '315K', '5776E', '5776T', '5776X', '5776A', '5776P', '5327A', '5327B', '5327C', '5327E', '5327V', '5327Z', '7916A', '1350X'];
      var vals = [];
      let finalString = '';
      for (i = 0; i < teamsToRank.length; i++) {
         let curPercent = getWinPercent(teamsToRank[i], message);
         vals.push(curPercent);
      }

      let count = 1
      while (teamsToRank.length > 0) {
         let i = vals.indexOf(Math.max(...vals));
         let winPct = vals.splice(i, 1);
         let curTeam = teamsToRank.splice(i, 1);
         finalString = finalString + count + ". " + curTeam[0] + ": " + Math.round(winPct * 10000) / 100 + "\%\n"
         count++;
      }

      message.channel.send({
         embed: {
            color: 16711782,
            title: "Norcal Team Rankings (win percentages)",
            description: finalString
         }
      });
   }
   else if (curMessageContent.includes('f orecord')) {
      let teams = curMessageContent.split(" ");
      if (teams.length != 3 && teams.length != 4) {
         //bad case
      }
      else {
         let teamOfInterest = teams[2].toUpperCase();
         let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Tower%20Takeover&team=" + teamOfInterest);
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
   /*else if (curMessageContent.includes('f orgrecord')) {
      let teams = curMessageContent.split(" ");
      if (teams.length != 3 && teams.length != 4) {
         //bad case
      }
      else {
         let teamOfInterest = teams[2].toUpperCase();
         let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Tower%20Takeover&team=" + teamOfInterest);
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
   }*/
   else if (curMessageContent.includes('f arecord')) {
      let teams = curMessageContent.split(" ");
      if (teams.length != 4) {
         //bad case
      }
      else {
         let teamOfInterest = teams[2].toUpperCase();
         let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Tower%20Takeover&team=" + teamOfInterest);
         let result = JSON.parse(resp).result;
         let win = 0;
         let tie = 0;
         let loss = 0;

         for (i = 0; i < result.length; i++) {
            var red = false;
            var validComparison = false;
            if (result[i].red1 === teamOfInterest || result[i].red2 === teamOfInterest) {
               red = true;
            }

            if (red && (result[i].red1 === teams[3].toUpperCase() || result[i].red2 === teams[3].toUpperCase())
               || (!red && (result[i].blue1 === teams[3].toUpperCase() || result[i].blue2 === teams[3].toUpperCase()))) {
               validComparison = true;
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

         myAppend = " with " + teams[3].toUpperCase();
         message.channel.send({
            embed: {
               color: 1302784,
               title: "Record for " + teamOfInterest + myAppend,
               description: win + "-" + loss + "-" + tie
            }
         });
      }
   }
   else if (curMessageContent.includes('f orecord')) {
      let teams = curMessageContent.split(" ");
      if (teams.length == 3) {
         var teamList = [];
         teamList = [teams[2] + "A", teams[2] + "B", teams[2] + "C", teams[2] + "D", teams[2] + "E", teams[2] + "F", teams[2] + "G", teams[2] + "H", teams[2] + "I", teams[2] + "J", teams[2] + "K", teams[2] + "L", teams[2] + "M", teams[2] + "N", teams[2] + "O", teams[2] + "P", teams[2] + "Q", teams[2] + "R", teams[2] + "S", teams[2] + "T", teams[2] + "U", teams[2] + "V", teams[2] + "W", teams[2] + "X", teams[2] + "Y", teams[2] + "Z"]

         let win = 0;
         let tie = 0;
         let loss = 0;

         for (r = 0; r < teamList.length; r++) {
            let teamOfInterest = teamList[r].toUpperCase();

            let resp = httpGet("https://api.vexdb.io/v1/get_matches?season=Tower%20Takeover&team=" + teamOfInterest);
            let result = JSON.parse(resp).result;

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
         }

         message.channel.send({
            embed: {
               color: 1302784,
               title: "Record for " + teams[2],
               description: win + "-" + loss + "-" + tie
            }
         });
      }
   }
   else if (curMessageContent.includes('f predict')) {
      if (myRandom(6)) {
         message.reply("I would say yes :ok_hand:");
      }
      else if (myRandom(4)) {
         message.reply("As sure as 8k winning worlds! :thinking:");
      }
      else if (myRandom(2)) {
         message.reply("Nope not a chance :x:");
      }
      else {
         message.reply("Idk ask again :confused:");
      }
   }
   else if (curMessageContent.includes('win') && curMessageContent.includes('worlds') && myRandom(5)) {
      if (message.author.id !== client.user.id) {
         message.channel.send('8k IS WINNING WORLDS!');
      }
   }
   else if (curMessageContent.includes("leek")) {
      message.channel.send('fingerslip?');
      setTimeout(function () { message.channel.send('made u look'); }, 2000);
   }
   else if (curMessageContent.includes("vex is bad")) {
      message.channel.send('that\'s why I quit');
   }
   else if (message.member.displayName.includes("5776T") && myRandom(36)) {
      message.channel.send("Yo DVT why didn't u get excellence at DV");
   }
   else if (message.member.displayName.includes("Andrew") && myRandom(35)) {
      message.channel.send("007 thrower");
   }
   else if ((message.member.displayName.includes("NightBlaze") || message.member.displayName.includes("eirc")) && myRandom(50)) {
      message.channel.send("yo 315x shoulda picked Lewie at worlds");
   }
   else if (message.member.displayName.includes("Kau") && myRandom(100)) {
      message.channel.send("Kau Kau! Mooooo! :cow:");
   }
   else if (message.member.roles.find("name", "315") && myRandom(110)) {
      message.channel.send("315 throwers");
   }
   else if (message.member.roles.find("name", "139") && myRandom(110)) {
      message.channel.send("139 is fake Gael Force :rofl:");
   }
   else if (message.member.roles.find("name", "5327") && myRandom(60)) {
      message.channel.send("Notebook tryhards");
   }
   else if (message.member.roles.find("name", "7916") && myRandom(50)) {
      message.channel.send("Ayy it's discount Gael Force");
   }
   else if (message.member.roles.find("name", "86868R") && myRandom(10)) {
      message.channel.send("We get it Dylon you won worlds just like 8k");
   }
   else if (message.member.roles.find("name", "22095") && myRandom(50)) {
      message.channel.send("Look it's steel boi");
   }
   else if (curMessageContent.includes("fitch")) {
      if (myRandom(15)) {
         message.channel.send("Someone said my name?");
      }
      else if (myRandom(15)) {
         message.channel.send("I'm better than Lewie");
      }
      else if (myRandom(15)) {
         message.channel.send("8k was good while I was part of it");
      }
   }
   else if (curMessageContent.includes("lewie") && myRandom(20)) {
      message.channel.send("Hey, that name sounds familiar!")
   }
   else if (curMessageContent === "f" && myRandom(10)) {
      if (message.author.id !== client.user.id) {
         message.channel.send("F")
      }
   }
   else if (curMessageContent === "lol" && myRandom(20)) {
      if (message.author.id !== client.user.id) {
         message.channel.send(":0")
      }
   }
   else if (myRandom(1000)) {
      message.channel.send('Hello everyone! :wave:');
   }
   else if (myRandom(1050)) {
      message.channel.send('Should I rejoin VEX? :thinking:');
      setTimeout(function () { message.channel.send('made u look'); }, 2000);
   }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);