import { Events, MessageFlags } from 'discord.js'

import { InteractionEvent } from '../utils/interfaces'
import { CustomClient } from '../utils/classes'

export const event: InteractionEvent = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = (interaction.client as CustomClient).commands.get(
      interaction.commandName
    )

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(err)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command',
          flags: MessageFlags.Ephemeral
        })
      } else {
        await interaction.reply({
          content: 'There was an error while exectuing this command!',
          flags: MessageFlags.Ephemeral
        })
      }
    }
  }
}
