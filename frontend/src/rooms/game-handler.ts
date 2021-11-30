import { Room, Client } from "colyseus";
import { Question } from "../models/question";
import { GameState } from "../models/gamestate";

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
