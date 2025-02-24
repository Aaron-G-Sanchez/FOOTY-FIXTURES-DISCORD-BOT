import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { CustomClient } from './classes'

export interface Command {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export interface ReadyEvent {
  name: string
  once: boolean
  execute: (client: CustomClient) => void
}

export interface InteractionEvent {
  name: string
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
