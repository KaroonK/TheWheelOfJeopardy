import { Room, Client } from "colyseus";
import { GameRoomState } from "./schema/GameRoomState";
import { Player } from "../models/player";
import { util } from "../utils";
export class GameRoom extends Room<GameRoomState> {
    maxClients = 3
    async onCreate (options: any) {
        this.setState(new GameRoomState());

        // retrieve the questions
        await this.state.configureQuestions(options['numberOfQuestions']);

        this.onMessage("start-game", (client) => {
            this.broadcast("play");
        });

    }

    // on join, take the session id, name, and create a player
    onJoin (client: Client, options: any) {
        if (options.hasOwnProperty('numberOfQuestions')){ 
            this.state.numberOfQuestions = options['numberOfQuestions']
        }

        this.state.createPlayer(client.sessionId, options['name'])

        this.onMessage('set_player_as_current', (client, data) => {
            this.state.currentPlayer = this.state.players.get(client.sessionId);
            this.state.event = this.state.currentPlayer.name + " has buzzed in.";
        });

        this.onMessage("spin-stop-angle", (client, data) =>{
            this.state.stopAngle = data['stopAngle'];
            this.broadcast("spin-wheel", (this.state.stopAngle));
        })

        this.onMessage("update-category", (client, data) => {
            this.state.currentCategory = data['category'];
        })

        this.onMessage("update-point-value", (client, data) =>{
            this.state.currentPointValue = data['value'];
            this.state.event = "Current question is worth: " + this.state.currentPointValue + " points.";
            // retrieve question
            let nextQuestion = this.state.getQuestion().toJSON();
            this.broadcast("next-question", {'question': nextQuestion});
        });

        this.onMessage("correctly-answered", (client, data) => {
            this.state.addScore();
            this.state.event = this.state.currentPlayer.name +" correctly answered the question. The correct answer was " + data['answer'];
            setTimeout(() => {this.broadcast("update-score");}, 1000);
            setTimeout(() =>{this.broadcast("respin");},3000)
        })

        this.onMessage("no-buzz-in", (client, data)=> {
            this.state.event = "Event: No player buzzed in. The correct answer is " + this.state.correctAnswer+ ".";
            setTimeout(() =>{
                if(this.state.numberOfQuestions != 0){
                    this.broadcast("respin");
                }
            },2000)

        })

        this.onMessage("incorrectly-answered", (client, data) => {
            this.state.subtractScore();
            this.state.event = this.state.currentPlayer.name +" did not correctly answer the question. The correct answer was " + data['answer'];
            setTimeout(() => {this.broadcast("update-score");}, 1000);
            setTimeout(() =>{this.broadcast("respin");},5000)
        })

        this.onMessage("buzzed", (client) => {
            this.state.currentPlayer = this.state.players.get(client.sessionId);
            this.state.playerBuzzed = true;
            console.log("BUZZED");
            this.broadcast("buzzed");
        })

        console.log(client.sessionId, "joined!");

    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}

//
