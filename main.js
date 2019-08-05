
roomNumber = 0;
name = "bob";
lastMessageCount = -1;

function init() {
    //get ready for a complete shitshow ooooooo
    textbar = document.getElementById("textbar");
    chatLog = document.getElementById("chatLog");
    refreshLog = setInterval(function(){
        var uLog = new XMLHttpRequest();
    
        var url = "http://192.168.1.12:6689/getMessage?location=chat&last=" + lastMessageCount + "&room=" + roomNumber;
        uLog.open("POST",url, true);
        uLog.onreadystatechange = function() {
     
            if(uLog.readyState == 4) {
                updateChat(JSON.parse(uLog.responseText));
            }
        }
        uLog.send();
    },1000);

}

function pushMessage() {
    if (textbar.value != "") {
        var sendNew = new XMLHttpRequest();
        //remind me to change this if i ever decide to punch a hoel in security
        var url = "http://192.168.1.12:6689/newMessage?location=chat&name=" + name + "&msg=" + textbar.value + "&room=" + roomNumber;
        textbar.value = "";
        sendNew.open("POST",url, true);
        sendNew.onreadystatechange = function() {
            if (sendNew.readyState == 4) {
                updateChat(JSON.parse(sendNew.responseText));

            }
            
        } 
        sendNew.send();
    }
}


function updateChat(bigJSON) {
    lastMessageCount = parseInt(bigJSON.latest);
    var msgChain = bigJSON.text2Add;
    for (var msg in msgChain) {
        var someSpan = toHTMLMsg(JSON.parse(msgChain[msg]));
        chatLog.appendChild(document.createElement('br'));
        chatLog.appendChild(someSpan);
    }
}


function toHTMLMsg(someJSON) {
    //this json is expected to have two parts: a name and msg 

    var msgWrap = document.createElement('span');
    var n = document.createElement('span');
    n.innerHTML = someJSON.name;

    n.classList.add("namePlate");
    msgWrap.appendChild(n);
    msgWrap.innerHTML += ": " + someJSON.msg;
    return(msgWrap);
}

function sendSomething(e) {
    if (e.which == 13 || e.keyCode == 13 ) {
        if (document.activeElement.id == "textbar") {
            pushMessage();
        }
    }
}

