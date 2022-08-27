import { CommandInteraction, EmbedBuilder } from "discord.js";
import { HTMLElement } from "node-html-parser";
import { Client } from "../utils/Types";
import { Utils } from "../utils/Utils";

export default async (interaction: CommandInteraction, client: Client = interaction.client) => {
    const leaderboard = await Utils.fetchKackyReloadedWebsite("ranking.php?edition=3");

    const embed = new EmbedBuilder();

    embed.setTitle("Leaderboard");

    leaderboard.querySelector("body")?.removeChild((leaderboard.querySelector("body") as unknown as HTMLElement).firstChild);
    leaderboard.querySelector("body")?.removeChild((leaderboard.querySelector("body") as unknown as HTMLElement).firstChild);
    leaderboard.querySelector("body")?.removeChild((leaderboard.querySelector("body") as unknown as HTMLElement).firstChild);
    leaderboard.querySelector("body")?.removeChild((leaderboard.querySelector("body") as unknown as HTMLElement).firstChild);
    leaderboard.querySelector("body")?.removeChild((leaderboard.querySelector("body") as unknown as HTMLElement).firstChild);

    let datas = leaderboard.querySelectorAll("tr");

    let txt = [];

    let i = 0;
    for (let player of datas) {
        const pdata = {
            pos: +player.querySelectorAll("td")[0].textContent,
            name: player.querySelectorAll("td")[1].textContent,
            finished: +player.querySelectorAll("td")[2].textContent,
            averge: +player.querySelectorAll("td")[3].textContent,
            avergeFinished: +player.querySelectorAll("td")[4].textContent
        }

        txt.push(pdata.pos + ". " + pdata.name + " | " + pdata.finished);
        i++;
        if (10 <= i) break;
    }

    embed.addFields({
        name: txt.join("\n"),
        value: "Page: 1 / " + Math.ceil(datas.length / 10)
    })

    embed.setDescription("Total players : " + datas.length);

    interaction.reply({embeds: [embed]});
}