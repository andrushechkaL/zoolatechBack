"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatacter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const character = new Schema({
    name: {
        type: String
    },
    homeworld: {
        type: String
    },
    gender: {
        type: String
    }
}, { collection: "starwars" });
const Chatacter = mongoose_1.default.model("characters", character);
exports.Chatacter = Chatacter;
//# sourceMappingURL=models.js.map