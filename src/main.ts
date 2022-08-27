import { Client as DiscordClient, CommandInteraction, InteractionType } from "discord.js";
import { writeFileSync } from "fs";
import { Client } from "./utils/Types";
import { Utils } from "./utils/Utils";

const client: Client = new DiscordClient({
    intents: [
        "GuildMembers"
    ]
});

client.cache = [];

client.on("ready", () => {
    Utils.initCommands(client);
    console.log("Ready, " + client.user.tag + " !");
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        console.log(interaction.user.tag + " used /" + interaction.commandName + interaction.options.data.map(e => " " + e.name + "=" + e.value).join(""));
        delete require.cache[require.resolve("./commands/" + interaction.commandName)];
        try {
            await require("./commands/" + interaction.commandName).default(interaction);
        } catch (e) {
            console.log("Error : " + e);
            console.log(e.stacktrace);
        }
    }
})

client.login("MTAxMjMzNzA1NDMxNjc2OTMyMA.GVucoH.KyTBJEfQ8LUA3iFofIU_M2uVCX6GgeEA1A7oCI");

console.log = (element: any) => {

    const date = new Date();
    const time = ((date.getDate()+"").length == 1 ? "0" : "") + date.getDate() + "/" + ((date.getMonth()+1+"").length == 1 ? "0" : "") + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + ((date.getHours()+"").length == 1 ? "0" : "") + date.getHours() + ":" + ((date.getMinutes()+"").length == 1 ? "0" : "") + date.getMinutes() + ":" + ((date.getSeconds()+"").length == 1 ? "0" : "") + date.getSeconds();

    process.stdout.write("[" + time + "] " + element + "\n");

}