const express = require('express');
// const task_management_routes = require('./src/task_management/routes');

const app = express();
const port = 5000; // ##### PORT CHANGED FROM 3000 to 5000
const http = require("http");
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require("cors");



const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
        credentials: true
    },
});


// Will allow us to get json from our endpoints 
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World!!!!");
});

io.on("connection", (socket) => {
    console.log("a user is connected");
});

// app.use('/api/v1/tm', task_management_routes);

app.listen(port, () => console.log(`app listening on port ${port}`));