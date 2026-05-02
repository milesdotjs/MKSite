require("dotenv").config();
const { youtubeEnv, guildEnv, discChannelEnv, youtubePicEnv, youtubeAccEnv } =
  process.env;
const { EmbedBuilder } = require("discord.js");
const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
console.log(youtubeEnv);
module.exports = (client) => {
  client.checkVideo = async () => {
    const data = await parser
      .parseURL(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeEnv}` //here place https://www.youtube.com/feeds/videos.xml?channel_id= with your channel id
      )
      .catch(console.error);

    const rawData = fs.readFileSync(`${__dirname}/../../json/video.json`);
    const jsonData = JSON.parse(rawData);

    if (jsonData.id !== data.items[0].id) {
      //this means theres a new video or video not sent
      fs.writeFileSync(
        `${__dirname}/../../json/video.json`,
        JSON.stringify({ id: data.items[0].id })
      );

      const guild = await client.guilds
        .fetch(guildEnv) // discord server id
        .catch(console.error);
      const channel = await guild.channels
        .fetch(discChannelEnv) //channel id to post video notifications
        .catch(console.error);

      const { title, link, id, author } = data.items[0];
      const embed = new EmbedBuilder({
        title: title,
        url: link,
        timestamp: Date.now(),
        image: {
          url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`,
        },
        author: {
          name: author,
          iconURL: youtubePicEnv, //url for your channel icon
          url: youtubeAccEnv, //url link to your youtue channel
        },
        footer: {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        },
      });
      await channel
        .send({
          embeds: [embed],
          content: `OMG this might be the best video yet...!!`,
        })
        .catch(console.error);
    }
  };
};
