const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { results } = require("../../../Systems/PurgeFunction");

module.exports = {
  subCommand: "purge.bot",
  async execute(interaction) {
    let amount = interaction.options.getInteger("count");
    if (amount > 100) amount = 100;
    const fetch = await interaction.channel.messages.fetch({ limit: amount });

    let filtered;
    let deletedMessages;
    filtered = fetch.filter((m) => m.author.bot);
    deletedMessages = await interaction.channel.bulkDelete(filtered, true);
    results(deletedMessages, interaction);
  },
};
