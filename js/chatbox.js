
var uiMessages = document.getElementById("messages");

var uiFullReplies = document.getElementById("full-replies");

var uiShortReplies = document.getElementById("short-replies");
var uiReplyOptions = document.getElementById("reply-options");
var uiReplyTextfield = document.getElementById("reply-textfield");

var selectedMove = null;

function toggleStyle(){
    if(uiFullReplies.style.display !== "none"){
        uiFullReplies.style.display = "none";
        uiShortReplies.style.display = "block";
    } else {
        uiFullReplies.style.display = "block";
        uiShortReplies.style.display = "none";
    }
}

var displayUserMoves = function(moves){
    generateFullReplies(moves);
    generateShortReplies(moves);
};

function generateFullReplies(moves){
    uiFullReplies.innerHTML = "";

    for(let move of moves){
        let button = document.createElement("button");
        button.innerHTML = move.opener;
        button.classList.add("button", "blue", "alt");
        button.addEventListener ("click", function() {
            selectMove(move);
            uiFullReplies.innerHTML = "";
        });
        uiFullReplies.appendChild(button);
    }
}

function generateShortReplies(moves){
    uiReplyOptions.style.visibility = "hidden";
    uiReplyOptions.innerHTML = "";
    uiReplyTextfield.innerHTML = "Your reply";
    uiReplyTextfield.className = "no-reply-selected";
    selectedMove = null;

    for(let move of moves){
        let option = document.createElement("div");
        option.innerHTML = move.moveID;
        option.classList.add("option");
        option.addEventListener ("click", function() {
            uiReplyOptions.style.visibility = "hidden";
            uiReplyTextfield.className = "reply-selected";
            uiReplyTextfield.innerHTML = move.opener;
            selectedMove = move;
        });
        uiReplyOptions.appendChild(option);
    }
}

function showShortReplies(){
    uiReplyOptions.style.visibility = "visible";
}

function sendSelectedMove(){
    if(selectedMove){
        selectMove(selectedMove);
        selectedMove = null;
        uiReplyTextfield.className = "no-reply-selected";
        uiReplyTextfield.innerHTML = "";
        uiReplyOptions.innerHTML = "";
    }
}

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