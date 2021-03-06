const mongodb = require("mongodb");

class crud {
  static async Create(conn, data) {
    const result = await conn.insertOne({
      ...data,
      createdAt: new Date(),
    });

    const item = await conn.find({ _id: result.insertedId }).toArray();

    return item;
  }

  static async Read(conn, id) {
    const item = await conn.find({ _id: mongodb.ObjectId(id) }).toArray();
    return item;
  }

  static async ReadAll(conn) {
    const items = await conn.find({}).toArray();

    return items;
  }

  static async Update(conn, data) {
    const result = await conn.updateOne(
      { _id: mongodb.ObjectId(data.id) },
      {
        $set: data.set,
      },
      { upsert: false }
    );
    return result;
  }

  static async Delete(conn, id) {
    await conn.deleteOne({ _id: new mongodb.ObjectId(id) });
    return id;
  }

  static async Find(conn, data) {
    const item = await conn.find(data).toArray();
    return item;
  }

  static async handler(conn, data) {
    let result;
    switch (data.headers) {
      case "create":
        result = await this.Create(conn, data.body);
        break;
      case "read":
        result = await this.Read(conn, data.body.id);
        break;
      case "update":
        result = await this.Update(conn, data.body);
        break;
      case "delete":
        result = await this.Delete(conn, data.body.id);
        break;
      case "readall":
        result = await this.ReadAll(conn);
        break;
      case "find":
        result = await this.Find(conn, data.body);
      default:
        break;
    }
    return result;
  }

  static async loadCollection(string) {
    const client = await mongodb.MongoClient.connect(
      "mongodb://acc:toor@db:27017/accounting",
      {
        useNewUrlParser: true,
      }
    );

    return client.db("accounting").collection(string);
  }
}

module.exports = crud;
