const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 9001;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

let chats = {} 

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {

    let json = data.toString()
    json = JSON.parse(json)
    let chatId = json.chatId
    let msg = json.message
    let userName = json.userName

    if (msg != "") {
        if (!chats.hasOwnProperty(chatId)) {
            chats[chatId] = new Set()
        }
        chats[chatId].add(ws)
        let toSend = {"userName": userName, "message": msg}
        wss.clients.forEach(function each(client) {
          if (client != ws && chats[chatId].has(client) && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(toSend));
          }
        })
    } else {
        if (!chats.hasOwnProperty(chatId)) {
            chats[chatId] = new Set()
        }
        chats[chatId].add(ws)
    }
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})