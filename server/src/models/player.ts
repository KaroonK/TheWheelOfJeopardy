import { Schema, type } from "@colyseus/schema";

export class Player extends Schema{
    @type("string")
    name: string

    @type("number")
    score: number

    @type("string")
    sessionID: string;
}