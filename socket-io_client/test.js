import { io } from "socket.io-client";

const socketClient = io("ws://localhost:8001", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1eWFuZyIsInBlcm1pc3Npb24iOiJHRU5FUkFMIiwic3ViIjoxLCJpYXQiOjE2MzA2NTA3NTIsImV4cCI6MTYzMTM3MDc1Mn0.Ywuz7eS69hoPAnrOOLlp_G1DpreNaU6cqDgP-dR5Tkw",
  },
});

socketClient.on("joined", (message) => {
  console.log(message);
});

function sendMsg(message) {
  socketClient.emit("join", message);
  console.log(`msg sended: ${message}`);
}

function sendAll() {
  sendMsg("Hello Server");
  sendMsg("test1");
  sendMsg("test2");
}

sendAll();
