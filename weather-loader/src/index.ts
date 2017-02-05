import * as fetch from "isomorphic-fetch";
import {MongoClient, Db} from "mongodb";
import * as yargs from "yargs";
import * as mongoUriBuilder from "mongo-uri-builder";

import config from "../config";


async function getHTMLString(url): Promise<string> {
  return await fetch(url).then(response => response.text());
}

async function loadTemperature() {
  const htmlString = await getHTMLString(config.weatherSourceUrl);
  const match = config.weatherRegex.exec(htmlString);
  const degree = match !== null
                 ? parseFloat(match[1])
                 : null;
  return degree;
}

interface TemperatureDocument {
  date: Date,
  degree: number,
}

async function loadWeatherWorker(db: Db) {
  const date = new Date();
  const degree = await loadTemperature();
  const document: TemperatureDocument = {
    date,
    degree
  }
  const result = await db.collection('temperature').insertOne(document);
  console.log({
    operation: 'Insert',
    id: result.insertedId
  });
}

function main(db: Db) {
  loadWeatherWorker(db);
  setInterval(
    loadWeatherWorker,
    config.updateInterval,
    db
  );
}

const mongoUri = mongoUriBuilder(config.db);
MongoClient.connect(mongoUri).then(db => {
  main(db);
})
