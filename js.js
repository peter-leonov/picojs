import { readFileSync } from "fs";

const file = "./source.js";
const input = String(readFileSync(file));

function isNumeric(c) {
  return "0" <= c && c <= "9";
}

function* lexer(str) {
  // little iterator ♥
  let line = 1;
  let column = 1;
  let cursor = 0;
  let char = str[cursor];

  function next() {
    cursor++;
    char = str[cursor];
    // ???
    column++;
  }

  function newline() {
    line++;
    column = 1;
  }

  function number() {
    let buffer = "";
    while (isNumeric(char)) {
      buffer += char;
      next();
    }

    if (buffer.length >= 1) {
      return {
        type: "number",
        value: Number(buffer),
      };
    }

    return null;
  }

  function isWhitespace(c) {
    return c === " " || c === "\t";
  }

  function whitespace() {
    if (isWhitespace(char)) {
      next();
    } else {
      return null;
    }

    while (isWhitespace(char)) {
      next();
    }

    return true;
  }

  function eol() {
    if (char === "\n") {
      next();
      newline();
    } else {
      return null;
    }

    while (char === "\n") {
      next();
      newline();
    }

    return true;
  }

  function eof() {
    if (char === undefined) {
      return {
        type: "EOF",
      };
    }

    return null;
  }

  for (;;) {
    const token = whitespace() || number() || eol() || eof();

    if (token) {
      if (token === true) {
        continue;
      }

      yield token;

      if (token.type === "EOF") {
        break;
      }
    } else {
      throw new SyntaxError(
        `unexpected character "${char}" at ${file}:${line}:${column}`
      );
    }
  }
}

console.log("start");
for (const token of lexer(input)) {
  console.log(token);
}
