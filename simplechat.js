var socketIOInitialized = false;
var simplechatAsyncUrl = 'http://localhost:1337';
var simplechatWebServerUrl = 'http://localhost:3000';
var socket;
//scripts to be dynamically loaded
var pendingScripts = 0;
// space between different chat windows
var windowSpacing = 350;
// the 1 is for the buddy list/signin
var numWindows = 1;

function onLoad() {
  loadScript( simplechatAsyncUrl + '/socket.io/socket.io.js', function() {
    socket = io.connect(simplechatAsyncUrl);
    socket.on('message', messageReceived);
    socketIOInitialized = true;
  });
  loadScript('https://login.persona.org/include.js');
  loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js');
  // once the scripts are loaded, loadedScripts is automatically loaded
}
window.onload = onLoad;

function loadScript(url, callback)
{
  // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;
   // increase the pending scripts
   pendingScripts++;
   var callbackWrapper = function() {
    callback();
    pendingScripts--;
    if (pendingScripts === 0) {
      loadedScripts();
    }
   }
   // then bind the event to the callback function 
   // there are several events for cross browser compatibility.
   // Only one event should be fired
   // used for non-gecko and non-Opera
   script.onreadystatechange = callbackWrapper;
   // used for gecko and Opera
   script.onload = callbackWrapper;

   // fire the loading
   head.appendChild(script);
}

function loadedScripts() {
  drawChat();
  document.getElementById('chatbox-textarea').onkeypress = onTextareaKeyPressed;
}


function drawChat() {
  var body = document.body;
  // create chatbox css
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML =  '#chatbox { position: absolute; bottom: 0px; right: ' + (++numWindows * windowSpacing) + 'px; height: 300px; width: 200px; background: red; }';
  css.innerHTML += '#chatbox-textarea { position: absolute; width: 180px; margin-left: 3px; margin-bottom: 2px; height: 30px; bottom: 0px;}';
  css.innerHTML += '#chatbox-conversation { background: gray; height: 246px; width: 195px; margin-left: 3px; margin-top: 3px; overflow:scroll; }';
  css.innerHTML +=  '.wordwrap {  white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; }';
  css.innerHTML += "#chatbox textarea { resize: none; }"
  body.appendChild(css);  
  //create chatbox
  var chatBox = document.createElement('div');
  chatBox.id = 'chatbox';
  chatBox.innerHTML =  '<div id="chatbox-conversation" class="wordwrap">';
  chatBox.innerHTML += '</div>';
  chatBox.innerHTML += '<textarea id="chatbox-textarea" rows=3 cols=5></textarea>';
  body.appendChild(chatBox);
}

function isLoggedIn() {
  var loggedIn = false;
  var req = $.ajax({
    url: simplechatWebServerUrl + '/status',
    type: 'POST',
    statusCode: {
      200: function() { loggedIn = true; }
    },
    complete: function() { return loggedIn; }
  });
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
  socket.emit('message', {name: 'Gabe', message: text});
}

function messageReceived(data) {
  var chatboxConversation = document.getElementById('chatbox-conversation');
  var message = document.createElement('div');
  message.innerHTML = data.name + ': ' + data.message;
  chatboxConversation.appendChild(message);
}
