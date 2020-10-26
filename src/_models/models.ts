import mongoose from "mongoose";

export interface Person {
    name: string;
    gender: string;
    homeworld: string;
}

export interface Result {
    count: number;
    results: Person[];
}



const Schema = mongoose.Schema;

const character = new Schema(
  {
    name: {
      type: String
    },
    homeworld: {
      type: String
    },
    gender: {
        type: String
    }
  },
  { collection: "starwars" }
);

const Chatacter = mongoose.model("characters", character);
export {Chatacter};