let currentWheel = undefined;
let room = undefined;
function wait_for_players_screen(type, room){
    // flip the appropriate container
    this.room = room;
    var menuContainerNode = document.getElementsByClassName("flip-card-inner");
    if (type == 'create'){ menuContainerNode[0].style = "transform: rotateY(-180deg);"}
    if (type == 'join') { menuContainerNode[0].style = "transform: rotateY(180deg);"}
    remove_menu();
    
    questionContainerNode = document.getElementById("question-container");
    questionContainerNode.classList.add("waitingForPlayers");
    roomIDNode = document.createElement('div');
    roomIDNode.classList.add("roomID");
    roomIDNode.id = "roomID";
    roomIDNode.innerHTML = "Room ID: <br/>" + room.id;
    
    // create spinner with text
    spinnerContainerNode = document.createElement('div');
    spinnerContainerNode.classList.add("spinnerContainerNode");
    spinnerContainerNode.id = "spinnerContainerNode";
    spinnerNode = document.createElement('div');
    spinnerNode.classList.add("spinner");
    spinnerNode.id = "spinner";
    spinnerContainerNode.innerHTML = "Waiting for players"
    spinnerContainerNode.appendChild(spinnerNode);

    questionContainerNode.appendChild(roomIDNode);
    questionContainerNode.appendChild(spinnerContainerNode);

    // hide the emblem
    // document.getElementById("circle").style.opacity = 0;
    
}

function update_players(room){
    console.log("IN UPDATE PLAYERS");
    this.room = room;
    players = room.state.players;
    scoreboardNode = document.getElementById("scoreboard");
    // clear existing players
    while(scoreboardNode.firstChild){
        scoreboardNode.removeChild(scoreboardNode.firstChild);
    }   
    scoreboardNode.innerHTML = "<h3>Players:<br/></h3>"

    players.forEach((player) => {
        pNode = document.createElement("p");
        pNode.id = player.name+"ScoreElement";
        console.log("THIS SHOULD UPDATE " + player.name + " : " + player.score);
        pNode.innerHTML = player.name + " : " + player.score;
        if (room.state.currentPlayer == player){
            pNode.classList.add("currentPlayer");
        }
        scoreboardNode.appendChild(pNode);

    })
}

function update_current_player(room){
    this.room = room;
    // get the current element with the class currentPlayer
    // remove from current element
    // update new player node with class
    currentPlayer = document.getElementsByClassName("currentPlayer");
    if (currentPlayer.length !== 0){  currentPlayer.classList.remove("currentPlayer"); }

    newCurrentPlayer = room.state.currentPlayer;
    newCurrentPlayerNode = document.getElementById(newCurrentPlayer.name+"ScoreElement");
    newCurrentPlayerNode.innerHTML = newCurrentPlayer.name + " : " + newCurrentPlayer.score;
}

// if current player then replace the screen with the start button
// if not current player, replace text with waiting for host to start the game. 
function remove_spinner_add_start_button(room, sessionId){
    spinnerContainerNode = document.getElementById("spinnerContainerNode");
    spinnerContainerNode.innerHTML = "";
    console.log(sessionId);
    console.log('Current player: ' + room.state.currentPlayer.sessionID);
    if (room.state.currentPlayer.sessionID == sessionId){
        console.log("IN HOST");
        // update text 
        startButtonNode = document.createElement("button");
        startButtonNode.setAttribute('class', 'startButton');
        startButtonNode.setAttribute('id', 'startButton');
        spinnerContainerNode.appendChild(startButtonNode);
        startButtonNode.textContent = "Start Game"
        startButtonNode.onclick = function(){
            room.send("start-game");
        }
    }else{
        // update text
        spinnerContainerNode.innerHTML = "Waiting for host to start the game. "
    }
}

function spin_wheel(room){
    this.room = room;
    room.state.playerBuzzed = false;
    // move room information to top right of the page
    // remove all elements except room information from question-container
    // show spinner (allow current player to spin)
    // the spinner should be synced to all players
    questionContainerNode = document.getElementById("question-container");
    questionContainerNode.innerHTML = "";

    // show the modal
    wheelModal = document.getElementById('wheel');
    wheelModal.style.display = 'block';
    instructionDiv = document.getElementById('instructionDiv');
    if (instructionDiv == undefined){
        instructionDiv = document.createElement('div');
        instructionDiv.classList.add("instructionDiv");
        instructionDiv.id = "instructionDiv";
        document.getElementById('w3-modal-content').appendChild(instructionDiv);
    }
    if (room.sessionId == room.state.currentPlayer.sessionID){
        instructionDiv.innerHTML = "Please spin the wheel for a category, and select a point value for the next question."
    }else{
        instructionDiv.innerHTML = room.state.currentPlayer.name + " is spinning the wheel and selecting point value.";
    }

    // create and show the wheel
    let categories = room.state.categoryList.toArray();
    console.log(categories);
    let currentWheel = wheel(categories);

    // add event listener to spin button
    spinButton = document.getElementById("spinButton");
    if (room.sessionId != room.state.currentPlayer.sessionID){
        spinButton.disabled = true;
        document.getElementById("numberOfPoints").style.opacity = '0';
    }else{
        spinButton.disabled = false;
        document.getElementById("numberOfPoints").style.opacity = '1';
    }
    spinButton.onclick = function(){
        fix_spin_results(room);
    }
    room.onMessage("spin-wheel", (message) =>{
        currentWheel.animation.stopAngle = message;
        startSpin(currentWheel);
    })
    console.log(room);
}

function fix_spin_results(room){
    this.room = room;
    let stopAngle = Math.random() * 1000
    console.log("Sending stop angle from client: " + stopAngle)
    room.send("spin-stop-angle", {'stopAngle': stopAngle});

}

function update_number_of_questions(room){
    this.room = room;
    footerNode = document.getElementById('footer');
    footerNode.style.opacity = 1;
    numberOfQuestionsNode = document.getElementById('numberOfQuestions');
    numberOfQuestionsNode.innerHTML = "Number of Questions: " + room.state.numberOfQuestions;
}

function update_category(categoryName){
    currentCategoryNode = document.getElementById("currentCategory");
    currentCategoryNode.innerHTML ="Current Category: " + categoryName;
    // only the current player updates remote category
    if (this.room.sessionId == this.room.state.currentPlayer.sessionID){
        this.room.send("update-category", {'category': categoryName});
    }
}

function update_number_of_points(pointValue){
    this.room.send("update-point-value", {'value':  parseInt(pointValue)});
}

function update_event(event){
    eventNode = document.getElementById("eventNode");
    if (eventNode == undefined){
        questionContainerNode = document.getElementById("question-container");
        eventNode = document.createElement("div");
        eventNode.id = "eventNode";
    }
    eventNode.textContent = "Event: " + event;

}

function next_question(message){
    // hide spinner modal
    // show questions
    // show answers (disabled)
    // show buzzer (disabled)
    // enable buzzer after 3 seconds
    // if someone buzzes in, send action to server
        // server broadcasts to everyone but the client 
        // the broadcast disables all buttons
        // and shows who buzzed in and is attempting to solve
    
    // update the screen 
        // show if they got it right or wrong
        // update score on the scoreboard
    document.getElementById('wheel').style.display = 'none';
    questionContainerNode = document.getElementById("question-container");
    questionContainerNode.innerHTML = "";
    questionNode = document.createElement('div');
    questionNode.classList.add('question');
    messageQuestion = message['question']
    questionNode.innerHTML = messageQuestion['question'];
    questionContainerNode.appendChild(questionNode)

    messageQuestion['incorrect_answers'].forEach (choice => {
        choiceNode = document.createElement('button');
        choiceNode.classList.add('choice');
        choiceNode.name = "choice"
        choiceNode.disabled = true;
        choiceNode.innerHTML = choice;
        questionContainerNode.appendChild(choiceNode);
    });

    buzzerNode = document.createElement('button');
    buzzerNode.disabled = true;
    buzzerNode.textContent = "Buzz!";
    buzzerNode.id = "buzzer";
    buzzerNode.classList.add('buzzer');
    self = this;

    buzzerNode.onclick = function(){
        self.room.send("set_player_as_current");
        setTimeout(() => {
            self.room.send("buzzed")
        }, 1000);
    }
    questionContainerNode.appendChild(buzzerNode);
    setTimeout(() => {
        buzzerNode.disabled = false;
        start_timer();
    }, 3000);

    eventNode = document.createElement('div');
    eventNode.id ="eventNode";
    questionContainerNode.appendChild(eventNode);



}

function enable_current_player_options(room){
    buzzerNode = document.getElementById('buzzer');
    buzzerNode.disabled = true;
    if (this.room.sessionId == room.state.currentPlayer.sessionID){
        console.log("IN THE RIGHT PLAYER");
        questionContainerNode = document.getElementById('question-container');
        questionContainerNode.childNodes.forEach(n => {
            if (n.name == "choice"){ 
                n.disabled = false;
                n.onclick = function(){check_if_correct(room, n.textContent);}
            }
        });
    }
}

function check_if_correct(room, answer){
    // create a div and get the correct answer from remote state
    // to check if the contents match, as the characters may have been escaped
    answerDiv = document.createElement('div');
    answerDiv.innerHTML = room.state.correctAnswer;
    if (answer == answerDiv.textContent){
        room.send("correctly-answered", {'answer': answerDiv.textContent});
            
    }else{
        room.send("incorrectly-answered", {'answer': answerDiv.textContent});
    }
    
    // logic to check for the correct answer
}

function start_timer(){
    var timeleft = 10;
    var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
            clearInterval(downloadTimer);
            document.getElementById("countdown").innerHTML = "Finished";
        } else {
            document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
        }
        timeleft -= 1;
    }, 1000);
    setTimeout(() => { 
        if (this.room.state.playerBuzzed == false ){this.room.send("no-buzz-in")}
    }, 16000);
}

function end_game(){
    w3ContainerNode = document.getElementById('w3-container');
    w3ContainerNode.innerHTML = "";

    thanksNode = document.createElement('div');
    thanks.classList.add('thanks');

    winnerNode = document.createElement('div');
    winnerNode.classList.add('winner');
    winnerNode.innerHTML = "Winner: " + this.room.state.
    w3ContainerNode.appendChild(thanksNode);

}

function show_winner(){
    let winners = this.room.state.getWinners();
    console.log(winners);
}