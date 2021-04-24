function isNumeric(c) {
  return "0" <= c && c <= "9";
}

function isAlpha(c) {
  return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
}

export function lexer(file, str) {
  // little iterator ♥
  let line = 1;
  let column = 1;
  let cursor = 0;
  let char = str[cursor];
  // console.log("lexer: ", char);

  function position() {
    return { cursor, line, column };
  }

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

  function stringOfType(delimiter) {
    if (char !== delimiter) return null;

    const start = position();
    next();
    while (char !== delimiter) {
      next();
    }

    next(); // last delimiter

    const end = position();
    return {
      type: "String",
      loc: { file, start, end },
    };
  }

  function string() {
    return stringOfType('"') || stringOfType("'");
  }

  function regexp() {
    if (char === "/") {
      const start = position();
      next();
      if (char === "/") {
        next();
        return readComment(start);
      }

      next();
      while (char !== "/") {
        next();
      }

      next(); // last /

      const end = position();
      return {
        type: "RegExpToken",
        loc: { file, start, end },
      };
    }
  }

  function readComment(start) {
    for (;;) {
      if (char === "\n") {
        newline();
        next();
        break;
      }

      if (char === undefined) {
        break;
      }

      next();
    }

    const end = position();

    return {
      type: "CommentToken",
      loc: { file, start, end },
    };
  }

  function operator() {
    if (char === "+") {
      const start = position();
      next();
      const end = position();
      return {
        type: "PlusToken",
        loc: { file, start, end },
      };
    }

    if (char === "*") {
      const start = position();
      next();
      const end = position();
      return {
        type: "MulToken",
        loc: { file, start, end },
      };
    }

    if (char === "/") {
      const start = position();
      next();
      if (char === "/") {
        next();
        return readComment(start);
      }
      const end = position();
      return {
        type: "DivToken",
        loc: { file, start, end },
      };
    }

    return null;
  }

  function number() {
    let buffer = "";
    const start = position();
    while (isNumeric(char)) {
      buffer += char;
      next();
    }

    if (buffer.length >= 1) {
      const end = position();
      return {
        type: "NumericLiteral",
        value: Number(buffer),
        loc: { file, start, end },
      };
    }

    return null;
  }

  const KEYWORDS = {
    if: "If",
    else: "Else",
    function: "Function",
  };

  function id() {
    let buffer = "";
    if (!isAlpha(char)) return null;
    const start = position();
    buffer += char;
    next();

    while (isNumeric(char) || isAlpha(char)) {
      buffer += char;
      next();
    }

    const end = position();

    const type = KEYWORDS[buffer];
    if (type) {
      return {
        type,
        loc: { file, start, end },
      };
    }

    return {
      type: "Id",
      value: buffer,
      loc: { file, start, end },
    };

    return null;
  }

  function isWhitespace(c) {
    return c === " " || c === "\t";
  }

  function semicolon() {
    if (char !== ";") return null;
    const start = position();
    next();

    const end = position();

    return {
      type: "Semicolon",
      loc: { file, start, end },
    };
  }

  function colon() {
    if (char !== ",") return null;
    const start = position();
    next();

    const end = position();

    return {
      type: "Colon",
      loc: { file, start, end },
    };
  }

  function parents() {
    if (char === "(") {
      const start = position();
      next();
      const end = position();
      return {
        type: "OpenParent",
        loc: { file, start, end },
      };
    }

    if (char === ")") {
      const start = position();
      next();
      const end = position();
      return {
        type: "CloseParent",
        loc: { file, start, end },
      };
    }

    if (char === "{") {
      const start = position();
      next();
      const end = position();
      return {
        type: "OpenCurly",
        loc: { file, start, end },
      };
    }

    if (char === "}") {
      const start = position();
      next();
      const end = position();
      return {
        type: "CloseCurly",
        loc: { file, start, end },
      };
    }

    return null;
  }

  function whitespace() {
    const start = position();
    if (!isWhitespace(char)) {
      return null;
    }
    next();

    while (isWhitespace(char)) {
      next();
    }
    const end = position();

    return {
      type: "Whitespace",
      loc: { file, start, end },
    };
  }

  function eol() {
    const start = position();

    if (char !== "\n") {
      return null;
    }

    next();
    newline();

    const end = position();

    return {
      type: "Newline",
      loc: { file, start, end },
    };
  }

  function eof() {
    if (char === undefined) {
      const start = position();
      const end = start;
      return {
        type: "EndOfFileToken",
        loc: { file, start, end },
      };
    }

    return null;
  }

  function next2(mode) {
    function value() {
      return number() || string() || regexp();
    }

    const token =
      whitespace() ||
      id() ||
      colon() ||
      semicolon() ||
      parents() ||
      (mode === "expression" ? value() : operator()) ||
      eol();

    if (token) {
      return token;
    }

    const maybeEof = eof();
    if (maybeEof) {
      return maybeEof;
    }

    throw new SyntaxError(
      `unexpected character "${char}" at ${file}:${line}:${column}`
    );
  }

  return {
    next: next2,
  };
}
