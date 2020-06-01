function isNumeric(c) {
  return "0" <= c && c <= "9";
}

export function* lexer(file, str) {
  // little iterator ♥
  let line = 1;
  let column = 1;
  let cursor = 0;
  let char = str[cursor];
  // console.log("lexer: ", char);

  function next() {
    cursor++;
    char = str[cursor];
    // console.log("lexer: ", char);
    column++;
  }

  function newline() {
    line++;
    column = 1;
  }

  function operator() {
    if (char === "+") {
      const start = { line, column };
      next();
      const end = { line, column };
      return {
        type: "PlusToken",
        loc: { start, end },
      };
    }

    return null;
  }

  function number() {
    let buffer = "";
    const start = { line, column };
    while (isNumeric(char)) {
      buffer += char;
      next();
    }

    if (buffer.length >= 1) {
      const end = { line, column };
      return {
        type: "NumericLiteral",
        value: Number(buffer),
        loc: { start, end },
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
      const start = { line, column };
      const end = start;
      return {
        type: "EndOfFileToken",
        loc: { start, end },
      };
    }

    return null;
  }

  for (;;) {
    const token = whitespace() || operator() || number() || eol();

    if (token) {
      if (token === true) {
        continue;
      }

      yield token;

      continue;
    }

    const maybeEof = eof();
    if (maybeEof) {
      yield maybeEof;
      break;
    }

    throw new SyntaxError(
      `unexpected character "${char}" at ${file}:${line}:${column}`
    );
  }
}
