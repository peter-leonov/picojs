import { readFileSync } from "fs";
import { lexer } from "./lexer.js";
import { parser } from "./parser.js";
import { evaluate, Exception } from "./evaluate.js";
import { typecheck } from "./typecheck.js";

const file = "./source.js";
const input = String(readFileSync(file));

const ast = parser(lexer(file, input));

console.log(typecheck(ast));

const result = evaluate(ast);
if (result instanceof Exception) {
  console.log(`panic: ${result.message}`);
  for (const loc of result.backtrace) {
    console.log(
      `  at ${loc.file}:${loc.start.line}:${loc.start.column}`
    );
  }
} else {
  console.dir(result, { depth: null });
}

console.log("DONE");
