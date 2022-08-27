import { ApplicationCommandOptionType } from "discord.js";
import { get } from "https";
import { Client } from "./Types";
import { parse, HTMLElement } from "node-html-parser"

export class Utils {

    public static async initCommands(client: Client) {
        client.application.commands.create({
            name: "leaderboard",
            description: "Show the current leaderboard of the kacky"
        });

        client.application.commands.create({
            name: "servers",
            description: "Show the status of the servers",
            options: [
                {
                    name: "server",
                    description: "Select a specific server",
                    required: false,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 1,
                    max_value: 7
                }
            ]
        });

        client.application.commands.create({
            name: "maps",
            description: "Show the maps",
            options: [
                {
                    name: "map",
                    description: "choose the number of the map",
                    required: false,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 151,
                    max_value: 225
                },
                {
                    name: "locate",
                    description: "Find the first server to play the map",
                    required: false,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 151,
                    max_value: 225
                },
                {
                    name: "info",
                    description: "See some cool things about the maps like unfinished maps",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: "Unfinished",
                            value: "unfinished"
                        },
                        {
                            name: "Most finished",
                            value: "mostfinished"
                        }
                    ],

                }
            ]
        });

        client.application.commands.create({
            name: "player",
            description: "Display infos about that kacky player",
            options: [
                {
                    name: "id",
                    description: "get info from his PID ()",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false
                },
                {
                    name: "name",
                    description: "get info from his trackmania name (not kacky)",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        });
    }

    public static async fetchKackyReloadedWebsite(endpoint: string) {
        return new Promise<HTMLElement>(resolve => {
            get("https://kackyreloaded.com/event/editions/" + endpoint + "&raw=1", (res) => {
                let data = Buffer.from([]);

                res.on("data", (c) => {
                    data = Buffer.concat([data, c]);
                })

                res.on("close", () => resolve(parse(data.toString("utf-8"))));
            });
        })
    }

    public static async fetchKackyReloadedJSONWebsite(endpoint: string) {
        return new Promise<any>(resolve => {
            get("https://kackyreloaded.com/event/editions/" + endpoint + "&_=" + Date.now(), (res) => {
                let data = Buffer.from([]);

                res.on("data", (c) => {
                    data = Buffer.concat([data, c]);
                })

                res.on("close", () => resolve(JSON.parse(data.toString("utf-8"))));
            });
        })
    }

    public static async fetchKackyWebsite(endpoint: string) {
        return new Promise<any>(resolve => {
            get("https://api.kacky.info" + endpoint, (res) => {
                let data = Buffer.from([]);

                res.on("data", (c) => {
                    data = Buffer.concat([data, c]);
                })

                res.on("close", () => resolve(JSON.parse(data.toString("utf-8"))));
            });
        })
    }

    public static async fetchTMIOWebsite(endpoint: string) {
        return new Promise<any>(resolve => {
            get({
                host: "trackmania.io",
                path: "/api" + endpoint,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63"
                }
            }, (res) => {
                let data = Buffer.from([]);

                res.on("data", (c) => {
                    data = Buffer.concat([data, c]);
                })

                res.on("close", () => resolve(JSON.parse(data.toString("utf-8"))));
            });
        })
    }

    public static convertSecondsToTime(time: number) {

        let s = 0;
        let m = 0;
        let h = 0;

        while (time > 59) {
            time -= 60;
            m++;
            if (m > 59) {
                m -= 60;
                h++;
            }
        }

        s = time;

        return (h == 0 ? "" : (h > 9 ? h : "0" + h) + ":") + (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s)

    }

}