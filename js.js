const input = "123 456 789 0";

function* lexer(str) {
  // little iterator ♥
  let cursor = 0;
  let char = str[cursor];

  function next() {
    cursor++;
    char = str[cursor];
  }

  function number() {
    let buffer = "";
    while (
      char === "0" ||
      char === "1" ||
      char === "2" ||
      char === "3" ||
      char === "4" ||
      char === "5" ||
      char === "6" ||
      char === "7" ||
      char === "8" ||
      char === "9"
    ) {
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

  function whitespace() {
    while (char === " " || char === "\t") {
      next();
    }
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
    whitespace();
    const token = number() || eof();

    if (token) {
      yield token;

      if (token.type === "EOF") {
        break;
      }
    } else {
      throw new SyntaxError(
        `unexpected character "${char}" at ${cursor + 1}`
      );
    }
  }
}

console.log("start");
for (const token of lexer(input)) {
  console.log(token);
}
console.log("finish");
