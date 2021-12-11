import { Schema, type, ArraySchema } from '@colyseus/schema'
export class Question extends Schema{
    @type("string") question: string
    @type("string") correct_answer: string
    @type(["string"]) incorrect_answers = new ArraySchema<string>();
}