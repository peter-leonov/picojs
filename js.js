import { readFileSync } from "fs";
import { lexer } from "./lexer.js";
import { parser } from "./parser.js";

const file = "./source.js";
const input = String(readFileSync(file));

const ast = parser(lexer(file, input));
console.dir(ast, { depth: null });

console.log("DONE");
