const mongodb = require("mongodb");
const crud = require("./crud");

async function handler(data, callback) {
  const conn = await crud.loadCollection("posts");

  const crudData = await crud.handler(conn, data);

  if (["create", "update", "delete"].includes(data.headers)) updatedPosts(this);

  return callback(crudData);
}

async function updatedPosts(socket) {
  const conn = await crud.loadCollection("posts");

  const posts = await crud.ReadAll(conn);

  socket.broadcast.emit("post:updated", { posts });
}

module.exports = handler;
