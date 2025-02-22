import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export const command = {
  data: new SlashCommandBuilder()
    .setName('Ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!')
  }
}
