    //This file has a collection of functions that register to the ActiveMQ topics for the incoming movesets and move status update events.
    //Implementing GUI styles can further process/display these incoming events. 
    //For now we assume there is just one respective function for each of the events:
    //displayUserMoves() is called when a set of possible user moves is available
    //displayMoveStatus() is called when any move is being executed (either by an agent or the user)

    //TODO: if necessary we can extend this to register multiple listeners/callbacks for these two events.

var client = Stomp.client(serverURL);

var moveSetCache = [];

function send(data){
    console.log("Sending data to topic " + oTopic + ": ", data);
    let sendSuccess = client.send(oTopic, {}, data);
    console.log(sendSuccess);
    return sendSuccess;
}

function subscribe(callback){
    console.log("Subscribing to topic " + iTopic);
    let subscribeSuccess = client.subscribe(iTopic, callback, {});
    console.log(subscribeSuccess);
    return subscribeSuccess;
}

var gotData = function(data){
    let msg = JSON.parse(data.body);
    console.log("got data: " , msg);
    if(msg.cmd === "status"){
        processStatusUpdate(msg);
    } else if(msg.cmd === "move_status"){
        processMoveStatusUpdate(msg);
    }
}

function processStatusUpdate(msg){
    //cache this moveset so we can show subtitles and the transcript later on
    moveSetCache = msg.moveSets;

    //we should update the UI if there are user moves
    for(let moveSet of msg.moveSets){
        if(moveSet.actorIdentifier === "User"){
            console.log("Available user moves: ", moveSet.moves);
            displayUserMoves(moveSet.moves);
        }
    }
}

function processMoveStatusUpdate(msg){
    //retrieve move details from the movecache based on the actorIdentifier and moveId
    let moveSet = moveSetCache.find(({ actorIdentifier }) => actorIdentifier === msg.actorIdentifier);
    let move = moveSet.moves.find(({ moveID }) => moveID === msg.moveId);

    if(move == null) {
        console.error("Unable to find move in cache: ", msg);
        return;
    }

    console.log("Found move in cache: ", move);

    displayMoveStatus(msg.status, msg.actorIdentifier, move);
}

function selectMove(move){
    let data = {
        "cmd" : "move_selected",
        "uiId" : "",
        "moveID" : move.moveID,
        "actorIdentifier" : move.actorIdentifier,
        "skipPlanner" : false,
        "userInput" : "",
        "target" : move.target 
    };
    console.log("User selects move " + move.moveID);
    send(JSON.stringify(data));
}

function init(){
    client.connect(username, password, function(frame) {
        client.debug("connected");
        subscribe(gotData);
    });
}

init();
