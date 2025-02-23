import dotenv from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { REST, Routes } from 'discord.js'
import { Command } from '../utils/interfaces'

dotenv.config()

// TODO: Add checks to ensure env variables are parsed correctly.
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commands: Command[] = []

const folderPath = join(__dirname, '..', 'commands')
const commandFiles = readdirSync(folderPath).filter((file) =>
  file.endsWith('.ts')
)

for (const file of commandFiles) {
  const filePath = join(folderPath, file)
  const { command } = require(filePath)

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON())
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "Execute" property.`
    )
  }
}

const rest = new REST().setToken(TOKEN!)

const deployCommands = async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} applicaiton (/) commands...`
    )

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), {
      body: commands
    })

    console.log(
      `Succesfully reloaded ${commands.length} application (/) commands.`
    )
  } catch (err) {
    console.error(err)
  }
}

await deployCommands()
