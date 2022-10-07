const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { results } = require("../../../Systems/purge-function");

module.exports = {
  subCommand: "purge.user",
  async execute(interaction) {
    let amount = interaction.options.getInteger("count");
    if (amount > 100) amount = 100;
    const fetch = await interaction.channel.messages.fetch({ limit: amount });
    const user = interaction.options.getUser("user");

    let filtered;
    let deletedMessages;
    filtered = fetch.filter((m) => m.author.id === user.id);
    deletedMessages = await interaction.channel.bulkDelete(filtered, true);
    results(deletedMessages, interaction);
  },
};
