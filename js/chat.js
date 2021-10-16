var input = document.getElementById("input-message");
input.value = ""
control = true

function getIdAndName() {
    let cookies = document.cookie.split(';');
    let list = []
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=")
        if (cookie[0] == "chatId") {
            list[0] = cookie[1]
        } else if (cookie[0] == " name") {
            list[1] = cookie[1]
        }
    }
    return list;
}

var data = getIdAndName()
var id = data[0]
var userName = data[1]

var ws;

function init() {

    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket('ws://localhost:9001');

    ws.onopen = () => {
        console.log('Connection opened!');
        ws.send(JSON.stringify({"message": '', "userName": userName, "chatId": id}))
    }

    ws.onmessage = ({ data }) => {
        let json = JSON.parse(data)
        addMessage(json.userName, json.message, 2);
    }

    ws.onclose = function() {
        ws = null;
    }
}

init();

input.addEventListener("keyup", (event) => {
        
    if (event.key === "Enter") {
        event.preventDefault();
        let msg = input.value
        addMessage(userName, msg, 1)

        let to_send = {"message": msg, "userName": userName, "chatId": id}

        if (!ws) {
            console.log("No WebSocket connection :(")
            return
        }
    
        ws.send(JSON.stringify(to_send));
        
        input.value = ""
    }
})

function addMessage(actor, message, user) {
    var element = document.createElement("div")

    element.style.backgroundColor = "white"
    element.innerHTML = message
    element.style.color = 'black'
    element.style.maxWidth = "50%"
    element.style.width = "max-content"
    element.style.padding = "5px"
    element.style.margin = "5px"
    element.style.borderRadius = "5px"
    element.style.fontSize = "18px"
    element.style.clear = "both"
    element.style.wordWrap = "break-word"

    var n = document.createElement("div")
    n.style.backgroundColor = "white"
    n.innerHTML = actor
    n.style.color = 'black'
    n.style.width = "max-content"
    n.style.padding = "5px"
    n.style.borderRadius = "5px"
    n.style.fontSize = "14px"
    n.style.backgroundColor = "white"

    if (user == 1) {
        element.style.float = "left"
        n.style.backgroundColor = "MediumSlateBlue"
    } else {
        element.style.float = "right"
        element.style.backgroundColor = "MediumSlateBlue"
    }

    element.insertBefore(n, element.firstChild);
    var messages = document.getElementsByClassName("messages")[0]
    messages.appendChild(element)
    messages.scrollTop = messages.scrollHeight;
}