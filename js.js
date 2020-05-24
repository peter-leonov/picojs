const input = "777";

function* lexer(str) {
  for (let cursor = 0; cursor <= str.length; cursor++) {
    let char = str[cursor];

    function number() {
      let value = "";
      for (; cursor <= str.length; cursor++) {
        char = str[cursor];
        if (char === "7") {
          value += char;
        } else {
          break;
        }
      }
      return {
        type: "number",
        value,
      };
    }

    if (char === "7") {
      yield number();
    } else if (char === undefined) {
      yield {
        type: "EOF",
      };
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
