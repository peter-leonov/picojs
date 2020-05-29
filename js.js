import { readFileSync } from "fs";
import { lexer } from "./lexer.js";
import { parser } from "./parser.js";

const file = "./source.js";
const input = String(readFileSync(file));

console.log("start");

const ast = parser(file, lexer(file, input));
console.dir(ast, { depth: null });

console.log("done");
