import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import {Person, Result, Chatacter} from "./_models/models";


const app = express();

const MONGODB_URL = "mongodb+srv://root:root@clustercloudcomputing.izeky.mongodb.net/starwars?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

const connection = mongoose.connection;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

connection.once("open", () => {
    // tslint:disable-next-line:no-console
    console.log("MongoDB database connection established successfully");
  });

connection.on('error', err => {
    // tslint:disable-next-line:no-console
    console.error('connection error:', err)
})



async function getPeople(name:string) {
  return axios.get<Result>(`https://swapi.dev/api/people/?search=${name}`);
}

async function getPlanet(url:string) {
  return axios.get(`${url}`);
}

async function saveCharacter(character: Person) {

  const find = await Chatacter.findOne({name: character.name})
  // tslint:disable-next-line:no-console
  console.log(find)
  if (!find) {
    const characterNew = new Chatacter({name: character.name, homeworld: character.homeworld, gender: character.gender});
      // tslint:disable-next-line:no-console
    console.log(character);
    characterNew.save((err) => {
      // tslint:disable-next-line:no-console
      if(err) return console.log(err);
    });
  }
}



app.get("/autocomlete", async (req,res) => {
  const name:string = (req.query as any).name;
    try {
      const apiData = await getPeople(name);
      res.send(apiData.data);
    }catch (err) {
        // tslint:disable-next-line:no-console
      console.error(err);
    }

})


app.get("/search-people", async (req, res) => {
    try {
      const apiData = await getPeople((req.query as any).name);
      const result = apiData.data.results;
      if (apiData.data.count === 0) {
        res.status(200).json([]);
      } else {
        let planetUrl;
        result.forEach((element) => {
          planetUrl = element.homeworld;
        });
        const planetData = await getPlanet(planetUrl)

        const responseBody:Person = {
          homeworld: planetData.data.name,
          name: result[0].name,
          gender: result[0].gender,
        }
        await saveCharacter(responseBody);
        res.status(200).json([responseBody]);
    }
    }catch (err) {
        // tslint:disable-next-line:no-console
      console.error(err);
    }
});

app.get("/dbupload", async (req,res) => {
    try {
      const characters = await Chatacter.find();
      res.send(characters)
    }catch (err) {
        // tslint:disable-next-line:no-console
      console.error(err);
    }

})

exports.app = app;

if (process.env.NODE_ENV !== "test") {
  const PORT = 4000;
  app.listen(PORT, () => {
      // tslint:disable-next-line:no-console
    console.log(`Listening on port ${PORT}`);
  });
}
