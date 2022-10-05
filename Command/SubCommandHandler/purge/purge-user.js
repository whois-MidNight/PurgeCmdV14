const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  MembershipScreeningFieldType,
} = require("discord.js");

module.exports = {
  subCommand: "purge.user",
  async execute(interaction) {
    const users = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("count");
    const Messages = await interaction.channel.messages.fetch();
    if (amount > 100) amount = 100;
    let i = 0;
    const filtered = [];
    (await Messages).filter((m) => {
      if (m.author.id === users.id && amount > 1) {
        filtered.push(m);
        i++;
      }
    });
    const deletedMessages = await interaction.channel.bulkDelete(
      filtered,
      true
    );
    const results = {};
    for (const [, deleted] of deletedMessages) {
      const user = `${users.username}#${users.discriminator}`;
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
