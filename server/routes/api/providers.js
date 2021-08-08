const mongodb = require("mongodb");
const crud = require("./crud");

async function handler(data, callback) {
  const conn = await crud.loadCollection("providers");

  const crudData = await crud.handler(conn, data);

  if (["create", "update", "delete"].includes(data.headers)) update(this);

  return callback(crudData);
}

async function update(socket) {
  const conn = await crud.loadCollection("providers");

  const providers = await crud.ReadAll(conn);

  socket.broadcast.emit("provider:updated", { providers });
}

module.exports = handler;
