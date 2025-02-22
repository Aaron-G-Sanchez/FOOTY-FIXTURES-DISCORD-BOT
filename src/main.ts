import dotenv from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js'

import { CustomClient } from './utils/classes'

dotenv.config()

const { TOKEN } = process.env

const client: CustomClient = new CustomClient({
  intents: [GatewayIntentBits.Guilds]
})
client.commands = new Collection()

const folderPath = join(__dirname, 'commands')
const commandsFiles = readdirSync(folderPath).filter((file) =>
  file.endsWith('.ts')
)

for (const file of commandsFiles) {
  const filePath = join(folderPath, file)
  const { command } = require(filePath)

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    // TODO: Add more specific warning logging.
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    )
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.login(TOKEN)

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  console.log(interaction)

  const command = (interaction.client as CustomClient).commands.get(
    interaction.commandName
  )

  if (!command) {
    console.log(`No command matching ${interaction.commandName} was found.`)
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
})
