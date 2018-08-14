//make connection
var socket = io();
    
//handle send button click
document.getElementById("sendBtn").addEventListener('click', function() {
    sendMessage();
});
    
//handle enter in input box
document.getElementById("inputBox").addEventListener('keypress', function(e) {
    if (e.keyCode==13){
        sendMessage();
    }       
});
    
//append messages from server
socket.on('message', function(msg) {
    var newMessage = document.createElement("li");
    var newMsgHandle = document.createElement("span");
    newMsgHandle.className = "username";
    var newMsgContent = document.createElement("span");
    //create spans with info
    newMsgHandle.textContent = msg.handle;
    newMsgContent.textContent = msg.content;
    //add spans to li
    newMessage.appendChild(newMsgHandle);
    newMessage.appendChild(newMsgContent);
    
    
    document.getElementById("messages").appendChild(newMessage);
});
    
//send message to server
function sendMessage() {
    var d = new Date();
    var cMonth = d.getMonth() + 1;
    var cDay = d.getDate();
    var cYear = d.getFullYear();
    var cHour = d.getHours();
    var cMinute = d.getMinutes();
    if(cMinute <10) {cMinute= "0" + cMinute};
    var cSecond = d.getSeconds();
    if(cSecond <10) {cSecond= "0" + cSecond};
    var timestamp = cMonth + "/" + cDay + "/"  + cYear + ' ' + cHour + ":" + cMinute + ":" + cSecond;
    
    //get value of input box
    var message = {}
    message.handle = document.getElementById("handle").value;
    message.handle += " @ " + timestamp + ": ";
    message.content = document.getElementById("inputBox").value;

    //check if input was blank
    if(!message) {
        return false;
    }
    
    //send message to server
    socket.emit('message', message);
    document.getElementById("inputBox").value = "";
    document.getElementById("inputBox").focus();
    return false;
};
      