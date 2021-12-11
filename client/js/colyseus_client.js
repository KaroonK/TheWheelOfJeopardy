function create_room(name, numQuestions){
    var client = new Colyseus.Client("ws://localhost:2567")
    clientSession = client.create("Game_Handler", {name: name, numberOfQuestions: parseInt(numQuestions)}).then(room => {
        all_listeners(room);
        start_game('create', room);
    }).catch(e => {
        console.error("create error", e);
    })
}

function join_room(name, roomID){
    var client = new Colyseus.Client("ws://localhost:2567")
    clientSession = client.joinById(roomID, {name: name}).then(room => {
        all_listeners(room);
        start_game('join', room)
    }).catch(e => {
        alert("Could not find the room: " + roomID +". Please check the id.");
        console.log("join error", e);
    })
}

function start_game(type, room){
    wait_for_players_screen(type, room);
    update_screen(room);

}

// listeners
function all_listeners(room){
    // listener for when new player is added
    room.state.players.onAdd = function(player, sessionId){
        update_screen(room);
        if (room.state.players.size == 3){
            remove_spinner_add_start_button(room, room.sessionId);
        }

    }

    room.state.currentPlayer.onChange = function (newPlayer, oldPlayer){
        update_players(room)
    }

    room.state.players.onRemove = function(player, key){
        update_players(room)
    }

    room.onMessage("play", (message) => {
        update_number_of_questions(room);
        spin_wheel(room);
    })

    room.onMessage("next-question", (question) => {
        next_question(question);
    })

    room.state.listen("currentPlayer", (newPlayer, oldPlayer)=>{
        update_players(room)
        // only set the options to true if the current point value is set
    });

    room.state.listen("numberOfQuestions", (newValue, oldValue) => {
        update_number_of_questions(room);
        if (newValue == 0){
            show_winner();
        }
    })

    room.state.listen("event", (newEvent, oldEvent) => {
        update_event(newEvent);
    })

    room.onMessage("buzzed", () => {
        console.log("BUZZED");
        enable_current_player_options(room)
    })

    room.onMessage("respin", () => {
        spin_wheel(room);
    });

    room.onMessage("update-score", () => {
        console.log("THIS SHOULD UPDATE EVERYONe's scores");
        update_players(room);
    })
}

function update_screen(room){
    update_players(room);
    // update_current_player(room);

}

function remove_menu(){
    let menuContainerNode = document.getElementById('menu_container');
    menuContainerNode.parentElement.removeChild(menuContainerNode);
}