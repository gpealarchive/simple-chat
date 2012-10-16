var socketIOInitialized = false;
var simplechatUrl = 'http://localhost:1337';
var socket;

function drawChat() {
  var body = document.body;
  // create chatbox css
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML =  '#chatbox { position: absolute; bottom: 0px; right: 0px; height: 300px; width: 200px; background: red; }';
  css.innerHTML += '#chatbox-textarea { position: absolute; width: 180px; margin-left: 3px; margin-bottom: 2px; height: 30px; bottom: 0px;}';
  css.innerHTML += '#chatbox-conversation { background: gray; height: 246px; width: 195px; margin-left: 3px; margin-top: 3px; }';
  css.innerHTML += "#chatbox textarea { resize: none; }"
  body.appendChild(css);  
  //create chatbox
  var chatBox = document.createElement('div');
  chatBox.id = 'chatbox';
  chatBox.innerHTML =  '<div id="chatbox-conversation">';
  chatBox.innerHTML += '</div>';
  chatBox.innerHTML += '<textarea id="chatbox-textarea" rows=3 cols=5></textarea>';
  body.appendChild(chatBox);
}

function onTextareaKeyPressed() {
  var key = window.event.keyCode;
  if (key === 13) {
    var chatboxTextarea = document.getElementById('chatbox-textarea');
    sendMessage(chatboxTextarea.value);
    chatboxTextarea.value = '';
    return false;
  }
}

function sendMessage(text) {
  if (!socketIOInitialized)
    return false;
  socket.emit('message', {name: 'Gabe: ', message: text});
}

function messageReceived(data) {
  var chatboxConversation = document.getElementById('chatbox-conversation');
  var message = document.createElement('div');
  message.innerHTML = data.name + ': ' + data.message;
  chatboxConversation.appendChild(message);
}

function loadSocketIO(callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = simplechatUrl + '/socket.io/socket.io.js';
   var loadedCallback = function() {
    socket = io.connect(simplechatUrl);
    socket.on('message', messageReceived);
    socketIOInitialized = true;
   };

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = loadedCallback;
   script.onload = loadedCallback;

   // fire the loading
   head.appendChild(script);
}


function onLoad() {
  loadSocketIO();
  drawChat();
  document.getElementById('chatbox-textarea').onkeypress = onTextareaKeyPressed;
}

window.onload = onLoad;