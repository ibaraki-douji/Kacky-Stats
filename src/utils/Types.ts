import { Client as DiscordClient } from "discord.js";

export interface Client extends DiscordClient {
    cache?: Array<{
        kackyID: number,
        tmioName: string,
        tmioUUID: string
    }>
}