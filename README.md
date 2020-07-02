# Graphical user interface
This is a web-based HTML&JavaScript GUI frontend for interacting with the agents. It offers the user an intuitive interface for making decisions in the dialogue. Can be used in addition to, or instead of, the Unity GUI overlay.
This project listens to ActiveMQ topics for any user-actions and generates the appropriate buttons.
Has been tested in Firefox.

## Installation
Clone this repo. Edit the config.js to subscribe to the correct ActiveMQ topics.

## Running
Run the whole Agents United system.
Open the index.html in a browser. When the user has available moves the interface will show buttons accordingly.