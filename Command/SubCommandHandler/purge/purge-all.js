const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  subCommand: "purge.all",
  async execute(interaction) {
    const amount = interaction.options.getInteger("count");
    if (amount > 100) amount = 100;
    const fetch = await interaction.channel.messages.fetch({ limit: amount });
    const deletedMessages = await interaction.channel.bulkDelete(fetch, true);

    const results = {};
    for (const [, deleted] of deletedMessages) {
      const user = `${deleted.author.username}#${deleted.author.discriminator}`;
      if (!results[user]) results[user] = 0;
      results[user]++;
    }

    const userMessageMap = Object.entries(results);

    const finalResult = `${deletedMessages.size} message${
      deletedMessages.size > 1 ? "s" : ""
    } were removed!\n\n${userMessageMap
      .map(([user, messages]) => `**${user}** : ${messages}`)
      .join("\n")}`;

    const msg = await interaction
      .reply({ content: `${finalResult}`, fetchReply: true })
      .catch((error) =>
        interaction.reply({
          content:
            "No messages deleted, make sure the messages aren't over two weeks old.",
        })
      );
    await msg.delete(5000);
  },
};
