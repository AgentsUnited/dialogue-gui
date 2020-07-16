
var uiMessages = document.getElementById("messages");
var uiReplies = document.getElementById("replies");

var displayUserMoves = function(moves){
    uiReplies.innerHTML = "";

    for(let move of moves){
        let button = document.createElement("button");
        button.innerHTML = move.opener;
        button.classList.add("button", "blue", "alt");
        button.addEventListener ("click", function() {
            selectMove(move);
            uiReplies.innerHTML = "";
          });
          uiReplies.appendChild(button);
    }
};

var displayMoveStatus = function(status, actorIdentifier, move){
    if(status === "MOVE_REALIZATION"){
        //maybe do something like "... is talking"??
    } else if(status === "MOVE_COMPLETED"){
        postMessage(move.actorName, move.opener);
    }
};

function postMessage(name, message){
    if(name === "Bob"){
        name = "You";
    }

    uiMessages.innerHTML += '<div class="message"><span class="agent-name ' + name + '">' + name + '</span><span class="message">: ' + message + '</span></div>';
    uiMessages.scrollTop = uiMessages.scrollHeight;
}