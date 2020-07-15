
var client = Stomp.client(serverURL);

var uiButtons = document.getElementById("buttons");

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
    uiButtons.innerHTML = "";

    //cache this moveset so we can show subtitles and the transcript later on
    moveSetCache = msg.moveSets;

    //we should show buttons if there are user moves
    for(let moveSet of msg.moveSets){
        if(moveSet.actorIdentifier === "User"){
            console.log("User actions: ", moveSet.moves);
            generateUIButtons(moveSet.moves);
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
    if(msg.status === "MOVE_REALIZATION"){
        //maybe do something like "... is talking"??
    } else if(msg.status === "MOVE_COMPLETED"){
        if(move.actorName === "Bob"){
            postUserMessage(move.opener);
        } else {
            postAgentMessage(move.actorName, move.opener);
        }
    }
}

function generateUIButtons(moves){
    for(let move of moves){
        let button = document.createElement("button");
        button.innerHTML = move.opener;
        button.classList.add("button", "blue", "alt");
        button.addEventListener ("click", function() {
            buttonPressed(move);
          });
        uiButtons.appendChild(button);
    }
}

function buttonPressed(move){
    let data = {
        "cmd" : "move_selected",
        "uiId" : "",
        "moveID" : move.moveID,
        "actorIdentifier" : move.actorIdentifier,
        "skipPlanner" : false,
        "userInput" : "",
        "target" : move.target 
    };
    console.log("User pressed button " + move.moveID);
    send(JSON.stringify(data));
    uiButtons.innerHTML = "";
}

function init(){
    client.connect(username, password, function(frame) {
        client.debug("connected");
        subscribe(gotData);
    });
}

init();
