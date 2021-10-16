var chatId = document.getElementById("info-chat");
var usName = document.getElementById("info-name");
var start = document.getElementById("start");

chatId.value = ""
usName.value = ""

start.addEventListener("click", (event) => {
    let id = chatId.value
    let us_name = usName.value
    document.cookie = `chatId=${id}`
    document.cookie = `name=${us_name}`
})