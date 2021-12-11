import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "../../models/player";
import { Room } from "@colyseus/core";
import { Question } from "../../models/question";
import { util } from "../../utils";

export class Category extends Schema{
    @type("string") name: string
    @type("string") number: string
}

export class QuestionSet extends Schema{
    @type([Question]) questions = new ArraySchema<Question>();
}

export class GameRoomState extends Schema {

    @type("string") mySynchronizedProperty: string = "Hello world";

    @type({map: Player})
    players = new MapSchema<Player>();

    @type("number")
    numberOfQuestions: number

    @type(Player)
    currentPlayer: Player

    @type({map: QuestionSet})
    allQuestions = new MapSchema<QuestionSet>();

    @type("string")
    event: string

    @type(["string"])
    categoryList = new ArraySchema<String>();

    @type("number")
    stopAngle: number

    @type("string")
    currentCategory: string

    @type("number")
    currentPointValue: number

    @type("string")
    correctAnswer: string

    @type('boolean')
    playerBuzzed: boolean

    @type('string')
    winnerString: string

    createPlayer(sessionID: string, name: string){
        this.players.set(sessionID, new Player());
        const cPlayer = this.players.get(sessionID);
        cPlayer.name = name;
        cPlayer.score = 0;
        cPlayer.sessionID = sessionID;
        if (this.players.size == 1){
            this.currentPlayer = cPlayer;
        }
    }

    removePlayer(sessionID: string){
        this.players.delete(sessionID);
    }

    async configureQuestions(numQuestions: number){
        this.numberOfQuestions = numQuestions;
        await util.retrieveAllQuestions(this.allQuestions, this.numberOfQuestions);
        this.buildCategoryList();
    }

    buildCategoryList(){
        let categoryKeys = Array.from(this.allQuestions.keys());
        let firstCatToDelete = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
        let secondCatToDelete = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
        while (firstCatToDelete === secondCatToDelete){
            secondCatToDelete = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
        }
        for (let i = 0; i < categoryKeys.length; i++){
            if (i != firstCatToDelete && i!= secondCatToDelete){
                this.categoryList.push(categoryKeys[i]);
            }
        }
    }

    getQuestion(){
        // get the question set for a specific category
        // get the questions for that set
        // pop a random question out of the set
        // if there are no more questions in the set remove the entry with the category from the question set
        // based on current category category, get a random question witihin that category
        let questionSet = this.allQuestions.get(this.currentCategory);
        let questions = questionSet.questions;
        let question = questions.pop();
        this.correctAnswer = question.correct_answer;
        console.log("ANSWER FOR THIS: " + this.correctAnswer);
        let randLocation = Math.floor(Math.random() * 3);
        let currentAnswer = question.incorrect_answers.at(randLocation);
        question.incorrect_answers.setAt(randLocation, this.correctAnswer);
        question.incorrect_answers.push(currentAnswer);
        question.correct_answer = "";
        if (questions.length == 0){
            this.allQuestions.delete(this.currentCategory);
            this.categoryList.forEach(category => {
                if (category == this.currentCategory){
                    let ind = this.categoryList.indexOf(category)
                    this.categoryList.deleteAt(ind);
                }
            })
        }
        this.numberOfQuestions -= 1;
        return question;
    }

    addScore(){
        this.currentPlayer.score += this.currentPointValue;
    }
    
    subtractScore(){
        this.currentPlayer.score -= this.currentPointValue;
    }

    getWinners(){
        let allPlayers = this.players.toJSON;
        let winners = [];
        let winner = new Player();
        winner.score = Number.NEGATIVE_INFINITY;

        // get the winner and send it to the client to display
    }


}
