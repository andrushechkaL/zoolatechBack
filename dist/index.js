"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./_models/models");
const app = express_1.default();
const MONGODB_URL = "mongodb+srv://root:root@clustercloudcomputing.izeky.mongodb.net/starwars?retryWrites=true&w=majority";
mongoose_1.default.connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
const connection = mongoose_1.default.connection;
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
    console.error('connection error:', err);
});
function getPeople(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`https://swapi.dev/api/people/?search=${name}`);
    });
}
function getPlanet(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`${url}`);
    });
}
function saveCharacter(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const find = yield models_1.Chatacter.findOne({ name: character.name });
        // tslint:disable-next-line:no-console
        console.log(find);
        if (!find) {
            const characterNew = new models_1.Chatacter({ name: character.name, homeworld: character.homeworld, gender: character.gender });
            // tslint:disable-next-line:no-console
            console.log(character);
            characterNew.save((err) => {
                // tslint:disable-next-line:no-console
                if (err)
                    return console.log(err);
            });
        }
    });
}
app.get("/autocomlete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    try {
        const apiData = yield getPeople(name);
        res.send(apiData.data);
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
    }
}));
app.get("/search-people", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiData = yield getPeople(req.query.name);
        const result = apiData.data.results;
        if (apiData.data.count === 0) {
            res.status(200).json([]);
        }
        else {
            let planetUrl;
            result.forEach((element) => {
                planetUrl = element.homeworld;
            });
            const planetData = yield getPlanet(planetUrl);
            const responseBody = {
                homeworld: planetData.data.name,
                name: result[0].name,
                gender: result[0].gender,
            };
            yield saveCharacter(responseBody);
            res.status(200).json([responseBody]);
        }
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
    }
}));
app.get("/dbupload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield models_1.Chatacter.find();
        res.send(characters);
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
    }
}));
exports.app = app;
if (process.env.NODE_ENV !== "test") {
    const PORT = 4000;
    app.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`Listening on port ${PORT}`);
    });
}
//# sourceMappingURL=index.js.map