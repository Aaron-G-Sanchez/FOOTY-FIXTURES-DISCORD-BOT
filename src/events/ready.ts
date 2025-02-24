import { Events } from 'discord.js'

import { CustomClient } from '../utils/classes'
import { ReadyEvent } from '../utils/interfaces'

export const event: ReadyEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: CustomClient) {
    // TODO: Add check to verify a user exists.
    console.log(`Ready! Logged in as ${client.user!.tag}`)
  }
}
