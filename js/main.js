
var client = Stomp.client(serverURL);

var uiTranscript = document.getElementById("transcript");
var uiSubtitles = document.getElementById("subtitles");
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
        uiSubtitles.innerHTML = move.actorName + ": " + move.opener;
    } else if(msg.status === "MOVE_COMPLETED"){
        uiTranscript.innerHTML += move.actorName + ": " + move.opener + "<br />";
        uiTranscript.scrollTop = uiTranscript.scrollHeight;
    }
}

function generateUIButtons(moves){
    for(let move of moves){
        let button = document.createElement("button");
        button.innerHTML = move.moveID + " ::: " + move.opener;
        button.className = "button";
        button.addEventListener ("click", function() {
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
          });
        uiButtons.appendChild(button);
    }
}

function init(){
    client.connect(username, password, function(frame) {
        client.debug("connected");
        subscribe(gotData);
    });
}

init();