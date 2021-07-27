const Post = require("./routes/api/posts");
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const cors = require("cors");

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:8080", "http://192.168.0.57:8080"],
    methods: ["GET", "POST", "DELETE"],
  },
});

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.send("Active");
});

io.on("connection", (socket) => {
  console.log(`User with id ${socket.id} has connected`);

  if (io.sockets.connected)
    socket.emit("connections", Object.keys(io.sockets.connected).length);
  else socket.emit("connections", 0);

  socket.on("disconnect", () => {
    console.log(`User with id ${socket.id} has disconnected`);
  });

  socket.on("post", Post);
});

http.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
