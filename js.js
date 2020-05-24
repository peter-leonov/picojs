const input = "7 \t 7777   77";

function* lexer(str) {
  let cursor = 0;
  let char = str[cursor];

  function next() {
    cursor++;
    char = str[cursor];
  }

  function number() {
    let buffer = "";
    while (char === "7") {
      buffer += char;
      next();
    }

    if (buffer.length >= 1) {
      return {
        type: "number",
        value: buffer,
      };
    }

    return null;
  }

  function whitespace() {
    let buffer = "";
    while (char === " ") {
      buffer += char;
      next();
    }

    if (buffer.length >= 1) {
      return {
        type: "whitespace",
        value: buffer,
      };
    }

    return null;
  }

  function eof() {
    char = str[cursor];
    if (char === undefined) {
      return {
        type: "EOF",
      };
    }

    return null;
  }

  for (;;) {
    const token = number() || whitespace() || eof();

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
