const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "purge a specific amount of messages from a target or channel."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Remove all Messages.")
        .addIntegerOption((options) =>
          options
            .setName("count")
            .setDescription("input count")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Removes all messages from the user given.")
        .addIntegerOption((options) =>
          options
            .setName("count")
            .setDescription("input count")
            .setRequired(true)
        )
        .addUserOption((options) =>
          options.setName("user").setDescription("input user").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot")
        .setDescription("Removes a bot user's messages.")
        .addIntegerOption((options) =>
          options
            .setName("count")
            .setDescription("input count")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    let amount = interaction.options.getInteger("count");
    const subCommand = interaction.options.getSubcommand();
    const users = interaction.options.getUser("user");
    const Messages = await interaction.channel.messages.fetch();

    switch (subCommand) {
      case "all":
        {
          if (amount > 100) amount = 100;
          const fetch = await interaction.channel.messages.fetch({
            limit: amount,
          });
          const deletedMessages = await interaction.channel.bulkDelete(
            fetch,
            true
          );

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
        }

        break;

      case "bot": {
        const Messages = await interaction.channel.messages.fetch();
        if (amount > 100) amount = 100;
        let ii = 0;
        const filtered = [];
        (await Messages).filter((m) => {
          if (m.author.bot && amount > ii) {
            filtered.push(m);
            ii++;
          }
        });
        const deletedMessages = await interaction.channel.bulkDelete(
          filtered,
          true
        );
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
      }
      case "user":
        {
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
        }
        break;
    }
  },
};
