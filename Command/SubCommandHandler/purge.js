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
            .setMinValue(1)
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
            .setMinValue(1)
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
            .setMinValue(1)
            .setRequired(true)
        )
    ),
};
