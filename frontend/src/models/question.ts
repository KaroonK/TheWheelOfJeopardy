import { Schema, type } from "@colyseus/schema";

export class Question extends Schema {
    @type("string")
    question: string

    @type("string")
    a: string

    @type("string")
    b: string

    @type("string")
    c: string

    @type("string")
    d: string

    @type("string")
    answer: string

}