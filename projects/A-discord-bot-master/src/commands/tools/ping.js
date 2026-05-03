const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return my ping!"),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = `API Latency: ${
      client.ws.ping
    }\nIm not lagging... I just have ${
      message.createdTimestamp - interaction.createdTimestamp
    } ping haha 😅`;
    await interaction.editReply({
      content: newMessage,
    });
  },
};
