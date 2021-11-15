import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string
    @type("number") score: number
}

export class Question extends Schema{
    @type("string") question: string
    @type("string") a: string
    @type("string") b: string
    @type("string") c: string
    @type("string") d: string
    @type("string") answer: string
}

export class GameState extends Schema {

    @type({ map: Player })
    players = new MapSchema<Player>();

    @type("string")
    currentPlayer: string

    @type("number")
    numberOfQuestions:number

    @type("boolean")
    newSession: boolean = false

    @type("string")
    currentCategory: string

    @type("number")
    currentPoints: number

    @type("string")
    event: string

    @type(Question)
    question: object

    @type("boolean")
    buzz: boolean


    createPlayer(sessionId: string, currentPlayer: boolean){
        this.players.set(sessionId, new Player());
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

    subtractScore(sessionId: string, points: any){
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


export class GameRoom extends Room<GameState> {
    maxClients = 3
    onCreate (options: any) {
        console.log("Game room created!", options);

        this.setState(new GameState());

        this.onMessage("addScore", (client, points) => {
            console.log("Adding score " + points)
            this.state.addScore(client.sessionId, points)
        });

        this.onMessage("subtractScore", (client, points) => {
            console.log("Subtracting Score " + points)
            this.state.subtractScore(client.sessionId, points)
        })

        this.onMessage("updateNumberOfQuestions", (client, num) =>{
            console.log("Updating the number of questions with: " + num)
            this.state.updateNumberOfQuestions(num);
        });

        this.onMessage("newSession", (client, newSession) =>{
            console.log("Starting a new session")
            this.state.updateNewSession(newSession);
        });

        this.onMessage("buzz", (client, sessionId) => {
            this.state.event = sessionId + " + just buzzed in"
            this.state.updateCurrentPlayer(sessionId)
            this.state.updateBuzz(true)
        });

        this.onMessage("buzz off", (client, data) => {
            this.state.updateBuzz(false)
        })

        this.onMessage("spin", (client, data) => {
            console.log(data.player + " just spun the wheel")
            console.log("Categories:" + data.categories)
            var randomCategoryNumber = Math.floor(Math.random()*5)
            this.state.currentCategory = data.categories[randomCategoryNumber]
            this.state.currentPoints = 0
        })

        this.onMessage("notify", (client, message) => {
            this.state.updateEvent(message)
        })

        this.onMessage("setPoints", (client, points) => {
            this.state.updateCurrentPoints(points)
        })

        this.onMessage("setQuestion", (client, question) => {
            this.state.updateQuestion(new Question(question))
        })

  }

  onJoin (client: Client, options: any) {
        console.log(this.state.players.size)
        console.log(client.sessionId, "joined!");
        this.state.event = client.sessionId + " has joined the room!"
        if (this.state.players.size == 0){
            console.log("Setting " + client.sessionId + "as the current player.")
            this.state.createPlayer(client.sessionId, true);
        }else{
            this.state.createPlayer(client.sessionId, false)
        }

        console.log("CURRENT PLAYER: " + this.state.currentPlayer)
        
  }

  onLeave (client: Client, consented: boolean) {
    this.state.removePlayer(client.sessionId)
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
