import { Client, Collection } from 'discord.js'

import { Command } from './interfaces'

export class CustomClient extends Client {
  commands!: Collection<string, Command>
}
