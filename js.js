const input = "77777877777";

function* lexer(str) {
  for (let cursor = 0; cursor <= str.length; cursor++) {
    const char = str[cursor];

    if (char === "7") {
      yield {
        type: "number",
        value: 7,
        // loc: {
        //   begin: cursor,
        //   end: cursor + 1,
        // },
      };
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
