const mongodb = require("mongodb");
const crud = require("./crud");

async function handler(data, callback) {
  const conn = await loadCollection("posts");

  const crudData = await crud.handler(conn, data);

  if (["create", "update", "delete"].includes(data.headers)) updatedPosts(this);

  return callback(crudData);
}

async function updatedPosts(socket) {
  const conn = await loadCollection("posts");

  const posts = await crud.ReadAll(conn);

  socket.broadcast.emit("post:updated", { posts });
}

async function loadCollection(string) {
  const client = await mongodb.MongoClient.connect(
    "mongodb://acc:toor@db:27017/accounting",
    {
      useNewUrlParser: true,
    }
  );

  return client.db("accounting").collection(string);
}

module.exports = handler;
