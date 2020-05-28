const input = "123 456 789 0";

function isNumeric(c) {
  return "0" <= c && c <= "9";
}

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
