import { io } from "socket.io-client";

const socketClient = io("ws://localhost:8001", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh5ZW9uc2tpIiwicGVybWlzc2lvbiI6IkdFTkVSQUwiLCJzdWIiOjIsImlhdCI6MTYzMDY3MDEwOCwiZXhwIjoxNjMxMzkwMTA4fQ.bXjcX4oQ1YEyCun4MB-ZIBRORdMhuAQihJzhliRTY10"
  },
});

socketClient.on("joined", (message) => {
  console.log(message);
});

socketClient.on('exception', (message) => {
  console.log(message);
});


socketClient.emit('join', {
  chatIndex: 100,
})

socketClient.emit('leave', {
  chatIndex: 100,
})

socketClient.emit('onMessage', {
  chatIndex: 100,
  message: 'Hello world'
})
