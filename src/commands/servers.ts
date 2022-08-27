import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Client } from "../utils/Types";
import { Utils } from "../utils/Utils";

export default async (interaction: CommandInteraction, client: Client = interaction.client) => {
    const dashboard = await Utils.fetchKackyWebsite("/dashboard");

    const server = interaction.options.get("server")?.value;
    const embed = new EmbedBuilder();


    embed.setTitle("Servers status");

    if (server && server > 0) {

        const tmio = await Utils.fetchTMIOWebsite("/rooms/0?sort=popularity&search=kacky%20-%20server");

        const srv = dashboard.servers.find(e => e.serverNumber == server);
        embed.addFields([{
            name: "Server name",
            value: "Kacky Server #" + srv.serverNumber,
            inline: true
        }, {
            name: "Online players",
            value: tmio.rooms.find(e => e.name.includes(srv.serverNumber)).playercount + " / " + tmio.rooms.find(e => e.name.includes(srv.serverNumber)).playermax,
            inline: true
        }, {
            name: "Time left",
            value: Utils.convertSecondsToTime(srv.timeLeft),
            inline: true
        }, {
            name: "Current Map",
            value: "Kacky Reloaded #" + srv.maps[0].number,
            inline: false
        }, {
            name: "Next maps",
            value: srv.maps.filter(e => e.number != srv.maps[0].number).map(e => "Kacky Reloaded #" + e.number + " | In " + (+(Utils.convertSecondsToTime(srv.timeLeft).split(":")[0]) + (10*(srv.maps.indexOf(e)-1))) + "min").join("\n"),
            inline: false
        }]);
    } else {
        for (let server of dashboard.servers) {
            embed.addFields([{
                name: "Kacky Server #" + server.serverNumber,
                value: "Current Map #" + server.maps[0].number + " | Time left : " + Utils.convertSecondsToTime(server.timeLeft),
                inline: false
            }]);
        }
    }

    interaction.reply({embeds: [embed]})
    
}