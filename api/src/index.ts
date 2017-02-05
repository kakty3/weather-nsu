import {Server} from "hapi";
import {MongoClient, Db, FindOneOptions} from "mongodb";
import * as mongoUriBuilder from "mongo-uri-builder";

import config from "../config";
const mongoUri = mongoUriBuilder(config.db);

interface TemperatureDocument {
  date: Date,
  degree: number,
}

async function loadTemperature(): Promise<TemperatureDocument> {
  const db = await MongoClient.connect(mongoUri);
  const options: FindOneOptions = {
    sort: {$natural:-1},
    fields: {_id: 0}
  }
  const doc: TemperatureDocument =
    await db.collection('temperature').findOne({}, options);
  console.log(doc);
  return doc;
}

const server = new Server();
server.connection({
  port: 3000,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/now',
  handler: async (request, reply) => {
    const temperatureDoc  = await loadTemperature();
    reply(temperatureDoc);
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
