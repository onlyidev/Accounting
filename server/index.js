const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const cors = require("cors");

const app = express();
const fs = require("fs");

const privatekey = fs.readFileSync("./cert/key.pem");
const cert = fs.readFileSync("./cert/cert.pem");

var creds = {
  key: privatekey,
  cert: cert,
  passphrase: "toor",
};

const https = require("https").createServer(creds, app);

const io = require("socket.io")(https, {
  cors: {
    origins: [
      "http://localhost:8080",
      "http://192.168.0.57:8080",
      "https://localhost:8080",
      "https://192.168.0.57:8080",
      "https://192.168.0.101:8080",
    ],
    methods: ["GET", "POST", "DELETE"],
  },
});

//Database
const Post = require("./routes/api/posts");
const Provider = require("./routes/api/providers");
const Entity = require("./routes/api/entities");
const Fill = require("./routes/api/fill");
//End database

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
  socket.on("provider", Provider);
  socket.on("entity", Entity);
  socket.on("fill", Fill);

  socket.on("scan:decode", (data) => {
    io.to(data.client).emit("scan", data.fill);
  });

  socket.on("scan:picture", (data, clb) => {
    io.to(data.client).emit("picture", data);
    return clb(data);
  });
});

// http.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

https.listen(port, () => {
  console.log("Server started");
});
