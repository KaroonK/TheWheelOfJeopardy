import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./player";
import { Question } from "./question";

export class GameState extends Schema {

    @type("boolean")
    buzz: boolean

    @type("string")
    currentCategory: string

    @type("string")
    currentPlayer: string

    @type("number")
    currentPoints: number

    @type("string")
    event: string

    @type("boolean")
    newSession: boolean = false

    @type("number")
    numberOfQuestions: number

    @type({map: Player})
    players = new MapSchema<Player>();

    @type(Question)
    question: object

    createPlayer(sessionId: string, currentPlayer: boolean){
        this.players.set(sessionId, new Player())
        this.players.get(sessionId).name = sessionId
        this.players.get(sessionId).score = 0
        if (currentPlayer == true){
            this.currentPlayer = sessionId
        }
    }

    removePlayer(sessionId: string){
        this.players.delete(sessionId)
    }

    addScore(sessionId: string, points: any){
        this.players.get(sessionId).score += points
    }

    subtractScore (sessionId: string, points: any){
        this.players.get(sessionId).score -= points
    }

    updateNumberOfQuestions(num: number){
        this.numberOfQuestions = num
    }

    updateNewSession(newSession: boolean){
        this.newSession = newSession
    }

    updateCurrentPlayer(sessionId: string){
        this.currentPlayer = sessionId
    }

    updateCurrentCategory(currentCategory: string){
        this.currentCategory = currentCategory
    }

    updateCurrentPoints(currentPoints: number){
        this.currentPoints = currentPoints
    }

    updateEvent(message: string){
        this.event = message
    }

    updateQuestion(question: Question){
        this.question = question
    }

    updateBuzz(buzz: boolean){
        this.buzz = buzz
    }
}