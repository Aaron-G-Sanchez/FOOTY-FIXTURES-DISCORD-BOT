import dotenv from 'dotenv'
import { Collection, Events, GatewayIntentBits } from 'discord.js'

import { CustomClient } from './utils/classes'

dotenv.config()

const { TOKEN } = process.env

const client: CustomClient = new CustomClient({
  intents: [GatewayIntentBits.Guilds]
})
client.commands = new Collection()

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.login(TOKEN)
