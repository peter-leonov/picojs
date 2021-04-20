import { readFileSync } from "fs";
import { lexer } from "./lexer.js";
import { parser } from "./parser.js";
import { evaluate, Exception } from "./evaluate.js";
import { typecheck } from "./typecheck.js";
import { highlight } from "./highlighter.js";

const file = "./source.js";
const content = String(readFileSync(file));

const { ast, tokens } = parser(lexer(file, content));
console.dir(ast, { depth: null });

console.log(highlight(content, tokens));

// const typeErrors = typecheck(ast);
// if (typeErrors.length) {
//   console.log("TYPE ERRORS:");
//   for (const error of typeErrors) {
//     console.log(`  ${error}`);
//   }
// }

// const result = evaluate(ast);
// if (result instanceof Exception) {
//   console.log(`panic: ${result.message}`);
//   for (const loc of result.backtrace) {
//     console.log(
//       `  at ${loc.file}:${loc.start.line}:${loc.start.column}`
//     );
//   }
// } else {
//   console.dir(result, { depth: null });
// }

console.log("DONE");
