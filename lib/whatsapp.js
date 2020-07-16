/*
Copyright (c) 2020 by Zeno Rocha (https://codepen.io/zenorocha/pen/eZxYOK)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var conversation = document.querySelector('.conversation-container');

var uiButtons = document.getElementById("buttons");

var displayUserMoves = function(moves){
    uiButtons.innerHTML = "";

    for(let move of moves){
        let button = document.createElement("button");
        button.innerHTML = move.opener;
        button.classList.add("button", "blue", "alt");
        button.addEventListener ("click", function() {
            selectMove(move);
            uiButtons.innerHTML = "";
          });
        uiButtons.appendChild(button);
    }
};

var displayMoveStatus = function(status, actorIdentifier, move){
    if(status === "MOVE_REALIZATION"){
        //maybe do something like "... is talking"??
    } else if(status === "MOVE_COMPLETED"){
        if(actorIdentifier === "User"){
            postUserMessage(move.opener);
        } else {
            postAgentMessage(move.actorName, move.opener);
        }
    }
};

function postUserMessage(text) {
	if (text) {
		let message = buildUserMessage(text);
		conversation.appendChild(message);
		animateMessage(message);
	}

	conversation.scrollTop = conversation.scrollHeight;
}


function buildUserMessage(text) {
	let element = document.createElement('div');

	element.classList.add('message', 'sent');

	element.innerHTML = text +
		'<span class="metadata">' +
			'<span class="time">' + getFormattedTime() + '</span>' +
			'<span class="tick tick-animation">' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
			'</span>' +
		'</span>';

	return element;
}

function animateMessage(message) {
	setTimeout(function() {
		let tick = message.querySelector('.tick');
		tick.classList.remove('tick-animation');
	}, 500);
}

function postAgentMessage(agentName, text) {
    let message = buildAgentMessage(agentName, text);
    conversation.appendChild(message);

	conversation.scrollTop = conversation.scrollHeight;
}

function buildAgentMessage(agentName, text) {
    let element = document.createElement('div');

	element.classList.add('message', 'received');

	element.innerHTML = '<div class="agent-name ' + agentName + '">' + agentName + "</div>" + text +
		'<span class="metadata">' +
			'<span class="time">' + getFormattedTime() + '</span>' +
		'</span>';

	return element;
}

