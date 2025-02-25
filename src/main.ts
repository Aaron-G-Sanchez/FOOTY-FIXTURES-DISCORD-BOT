import dotenv from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Collection, GatewayIntentBits } from 'discord.js'

import { CustomClient } from './utils/classes'

dotenv.config()

const { TOKEN } = process.env

const client: CustomClient = new CustomClient({
  intents: [GatewayIntentBits.Guilds]
})
client.commands = new Collection()

// Add commands to the client.
const folderPath = join(__dirname, 'commands')
const commandsFiles = readdirSync(folderPath).filter(
  (file) => file.endsWith('.ts') || file.endsWith('.js')
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

// Add event handling.
const eventPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventPath).filter(
  (file) => file.endsWith('.ts') || file.endsWith('.js')
)
console.log(eventFiles)

for (const file of eventFiles) {
  const filePath = join(eventPath, file)
  const { event } = require(filePath)

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(TOKEN)
