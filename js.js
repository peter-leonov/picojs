import { readFileSync } from "fs";
import { lexer } from "./lexer.js";
import { parser } from "./parser.js";

const file = "./source.js";
const input = String(readFileSync(file));

console.log("start");

const ast = parser(lexer(file, input));
console.log(ast);

console.log("done");
