import  { Question } from "./models/question";
import { ArraySchema, MapSchema } from "@colyseus/schema";
import { QuestionSet } from "./rooms/schema/GameRoomState";

const axios = require('axios');

export class util {
    static async retrieveAllQuestions(stateQuestionSet:MapSchema, numberOfQuestions: number){
        // number of questions has to be greater than 8
        const eachCategoryNumber = Math.ceil(numberOfQuestions/6);
        // Retrieve general knowledge questions
        const gkQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=9&type=multiple')).data['results'];
        this.filterQuestions('General Knowledge', gkQuestions, stateQuestionSet);

        // Retrieve television questions
        const tvQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=14&type=multiple')).data['results'];
        this.filterQuestions('Television', tvQuestions, stateQuestionSet);

        // Retrieve video games questions
        const vgQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=15&type=multiple')).data['results'];
        this.filterQuestions('Video Games', vgQuestions, stateQuestionSet);


        // Retrieve Computers questions
        const compQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=18&type=multiple')).data['results'];
        this.filterQuestions('Computers', compQuestions, stateQuestionSet);

        
        // Retrieve Mathematics questions
        const mathQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=19&type=multiple')).data['results'];
        this.filterQuestions('Mathematics', mathQuestions, stateQuestionSet);


        // Retrieve History questions
        const historyQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=23&type=multiple')).data['results'];
        this.filterQuestions('History', historyQuestions, stateQuestionSet);

        // Retrieve Animals questions
        const animalsQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=27&type=multiple')).data['results'];
        this.filterQuestions('Animals', animalsQuestions, stateQuestionSet);

        // Retrieve Vehicles questions
        const vehiclesQuestions = (await axios.get('https://opentdb.com/api.php?amount='+eachCategoryNumber+'&category=28&type=multiple')).data['results'];
        this.filterQuestions('Vehicles', vehiclesQuestions, stateQuestionSet);

    }

    static filterQuestions(category: string, resQuestions: any, stateQuestionSet: MapSchema){
        const filteredQuestions:any = [];
        resQuestions.forEach((eachQuestion:any) =>{
            const q = new Question();
            q.question = eachQuestion['question'];
            q.correct_answer = eachQuestion['correct_answer'];
            q.incorrect_answers = eachQuestion['incorrect_answers'];
            filteredQuestions.push(q)
        })
        const qSet = new QuestionSet()
        qSet.questions = filteredQuestions
        stateQuestionSet.set(category, qSet);
    }
}
