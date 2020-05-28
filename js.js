import { readFileSync } from "fs";
import { lexer } from "./lexer.js";

const file = "./source.js";
const input = String(readFileSync(file));

console.log("start");
for (const token of lexer(file, input)) {
  console.log(token);
}
