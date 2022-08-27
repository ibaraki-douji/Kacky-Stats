import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Client } from "../utils/Types";
import { Utils } from "../utils/Utils";

export default async (interaction: CommandInteraction, client: Client = interaction.client) => {
    const map = interaction.options.get("map")?.value;
    const locate = interaction.options.get("locate")?.value;
    const info = interaction.options.get("info")?.value;

    const embed = new EmbedBuilder();

    if (map != undefined) {

        const maps = await Utils.fetchKackyReloadedWebsite('records.php?edition=3');
        const daMap: HTMLElement = maps.querySelectorAll("tr").find(e => e.querySelector('td')?.textContent.includes(map+"")) as any;
        const tmID = daMap.querySelector('a.hover-preview')?.getAttribute("data-uid") + "";
        const tmio = await Utils.fetchTMIOWebsite("/map/" + tmID);
        const kackyMap = await Utils.fetchKackyReloadedWebsite("maps.php?uid=" + tmID);

        embed.setTitle(daMap.querySelector('td')?.textContent + "")

        embed.addFields({
            name: "Author Name",
            value: tmio.authorplayer.name,
            inline: true
        }, {
            name: "Author Time",
            value: Utils.convertSecondsToTime(tmio.authorScore),
            inline: true
        }, {
            name: "Finishers : " + kackyMap.querySelectorAll("tr").length,
            value: kackyMap.querySelectorAll("tr").slice(0, 10).map(e => e.querySelectorAll("td")[1].textContent + " | " + e.querySelectorAll("td")[0].textContent).join("\n"),
            inline: false
        });

        embed.setThumbnail(tmio.thumbnailUrl);
    } else if (locate != undefined) {
        const dashboard = await Utils.fetchKackyWebsite("/dashboard");

        let res: Array<{server: number, maps: number, time: number}> = [];

        for (let server of dashboard.servers) {
            let current = server.maps[0].number;
            let diff = 0;
            while (current != locate) {
                diff++;
                current++;
                if (current > 225) current = 151;
            }

            res.push({
                server: server.serverNumber,
                maps: diff,
                time: server.timeLeft + (600 * (diff-1))
            });
        }

        res = res.sort((a, b) => a.time - b.time);

        embed.setTitle("Locate map #" + locate);

        embed.addFields({
            name: "||``||",
            value: res.map(e => "Server #" + e.server + " | " + (e.maps == 0 ? "Live Right Now" : "In " + e.maps + " maps | In " + Utils.convertSecondsToTime(e.time))).join("\n")
        })

    } else if (info != undefined) {
        const maps = (await Utils.fetchKackyReloadedWebsite('records.php?edition=3')).querySelectorAll("tr");

        if (info == "unfinished") {
            embed.setTitle("Unfinished kacky maps");

            embed.setDescription(
                maps
                .filter(e => +e.querySelectorAll("td")[4].textContent == 0)
                .sort((a,b) => +a.querySelectorAll("td")[0].textContent.split("#")[1] - +b.querySelectorAll("td")[0].textContent.split("#")[1])
                .map(e => e.querySelectorAll("td")[0].textContent)
                .join("\n") + "\n" + "Total " + maps.filter(e => +e.querySelectorAll("td")[4].textContent == 0).length);

        } else if (info == "mostfinished") {
            embed.setTitle("Most finished kacky maps");

            embed.setDescription(
                maps
                .sort((a,b) => +b.querySelectorAll("td")[4].textContent - +a.querySelectorAll("td")[4].textContent)
                .map(e => e.querySelectorAll("td")[0].textContent + " | " + e.querySelectorAll("td")[4].textContent + " finish")
                .splice(0, 10)
                .join("\n"));
        }

    } else {
        const maps = (await Utils.fetchKackyReloadedWebsite('records.php?edition=3')).querySelectorAll("tr");

        embed.setTitle("Kacky maps");

        embed.setDescription(maps.sort((a,b) => +a.querySelectorAll("td")[0].textContent.split("#")[1] - +b.querySelectorAll("td")[0].textContent.split("#")[1]).map(e => {
            return "#" + e.querySelectorAll("td")[0].textContent.split("#")[1] + " | " +
                e.querySelectorAll("td")[4].textContent + " finish | WR: " +
                e.querySelectorAll("td")[3].textContent
        }).join("\n"));
    }

    interaction.reply({embeds: [embed]})
}