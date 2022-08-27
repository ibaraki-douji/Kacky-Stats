import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Client } from "../utils/Types";
import { Utils } from "../utils/Utils";

export default async (interaction: CommandInteraction, client: Client = interaction.client) => {

    let id = interaction.options.get("id")?.value;
    const name = interaction.options.get("name")?.value;

    const embed = new EmbedBuilder();

    if (name != undefined) {
        id = 0;
        if (client.cache?.find((player) => player.tmioName.toLowerCase() == (name+"").toLowerCase())) {
            id = client.cache?.find((player) => player.tmioName.toLowerCase() == (name+"").toLowerCase())?.kackyID;
        }
        const mapToTry = [
            "ANo1YRQIWfyMkWQysoakzEACezc", // 206
            "nSiatu0wzb7SPUFqoXIgLHSs4zg", // 166
            "A7xraNdrM4LRRYH_6CKAH5mgtZ8" // 225
        ]

        let mapI = 0;
        let finishI = 0;
        while (id == 0) {
            if (mapI == mapToTry.length) {
                embed.setTitle("No player found with that name");
                embed.setColor("#ff0000");
                await interaction.reply({embeds: [embed]});
                return;
            }
            const tmio = await Utils.fetchTMIOWebsite("/leaderboard/map/" + mapToTry[mapI] + "?offset=" + finishI + "&length=100");
            finishI += 100;

            if (tmio.tops.find(e => e.player.name == name)) {
                const kackyMap = await Utils.fetchKackyReloadedWebsite("maps.php?uid=" + mapToTry[mapI]);
                const map = kackyMap.querySelectorAll("tr").find(e => e.querySelectorAll("td")[1].textContent == Utils.convertSecondsToTime(Math.floor(tmio.tops.find(e => e.player.name == name).time/1000)) + "." + ((tmio.tops.find(e => e.player.name == name).time/1000)+"").split(".")[1].substring(0, 2)) as unknown as HTMLTableRowElement;
                let ID;
                
                try {
                    ID = (map.querySelectorAll("td")[0].querySelector("a") as any).getAttribute("href").split("=")[1].split("&")[0];
                } catch (e) {
                    continue;
                }
                
                id = ID;

                client.cache?.push({
                    kackyID: ID,
                    tmioName: name+"",
                    tmioUUID: tmio.tops.find(e => e.player.name == name).player.id
                });
                break;
            }
            if (finishI > tmio.playercount) {
                mapI++;
                continue;
            }
        }
    } else if (id == undefined) {
        interaction.reply("You need to put one of the ID or NAME to use this command.")
        return;
    }

    const data = await Utils.fetchKackyReloadedJSONWebsite("edition_history.php?pid=" + id + "&edition=3");

    embed.setTitle("Profile of " + (client.cache?.find(e => e.kackyID == +(id+"")) ? client.cache?.find(e => e.kackyID == +(id+""))?.tmioName : data[0].PlayerName).replace(/\$[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]/g, "").replace(/\$[z|l|h|Z|L|H|o|O|i|I]/g, ""));

    const mXr: Array<{name: string, pos: number}> = [];

    for (let day of data) {
        for (let i in day.RecordsMaps.split("<br>")) {
            const pos = +day.RecordsMaps.split("<br>")[i];
            let map = day.FinishedMaps.split(";")[0].split(",")[i].split("#")[1];

            mXr.push({
                name: map,
                pos
            })
        }
    }

    embed.addFields({
        name: "Kacky name",
        value: (data[0].PlayerName as string).replace(/\$[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]/g, "").replace(/\$[z|l|h|Z|L|H|o|O|i|I]/g, ""),
        inline: true
    }, {
        name: "Trackmania name",
        value: (client.cache?.find(e => e.kackyID == +(id+"")) ? client.cache?.find(e => e.kackyID == +(id+""))?.tmioName+"" : "User not in cache list"),
        inline: true
    }, {
        name: "Finished maps " + mXr.length + " / 75",
        value: mXr.sort((a,b) => +a.name - +b.name).map(e => "Kacky Reloaded #" + e.name + " | Postion: " + e.pos).join("\n").substring(0, 1024),
    });

    interaction.reply({embeds: [embed]});

}