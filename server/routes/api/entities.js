const crud = require("./crud");

async function handler(data, callback) {
  const conn = await crud.loadCollection("entities");

  const crudData = await crud.handler(conn, data);

  if (data.headers == "delete") {
    const providers = await crud.loadCollection("providers");
    let update = await providers.find({}).toArray();

    update = update.filter((item) => item.payers.includes(data.body.id));
    update.forEach(async (el) => {
      const udata = await crud.handler(providers, {
        headers: "update",
        body: {
          id: el._id,
          set: {
            payers: el.payers.filter((item) => item != data.body.id),
          },
        },
      });
    });
  }

  if (["create", "update", "delete"].includes(data.headers)) update(this);

  return callback(crudData);
}

async function update(socket) {
  const conn = await crud.loadCollection("entities");

  const entities = await crud.ReadAll(conn);

  socket.broadcast.emit("entity:updated", { entities });
}

module.exports = handler;
