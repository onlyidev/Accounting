const crud = require("./crud");

async function handler(data, callback) {
  const conn = await crud.loadCollection("templates");

  const crudData = await crud.handler(conn, data);

  if (["create", "update", "delete"].includes(data.headers)) update(this);

  return callback(crudData);
}

async function update(socket) {
  const conn = await crud.loadCollection("templates");

  const entities = await crud.ReadAll(conn);

  socket.broadcast.emit("entity:updated", { entities });
}

module.exports = handler;
