const COLORS = {
  DivToken: "\x1b[31m",
  MulToken: "\x1b[31m",
  PlusToken: "\x1b[31m",
  RegExpToken: "\x1b[33m",
  String: "\x1b[32m",
  NumericLiteral: "\x1b[36m",
  CommentToken: "\x1b[37m\x1b[2m",
  Semicolon: "\x1b[37m\x1b[2m",
};

export function highlight(content, tokens) {
  let res = "";
  for (const t of tokens) {
    const color = COLORS[t.type];

    const tokenText = content.substring(
      t.loc.start.cursor,
      t.loc.end.cursor
    );

    if (color) {
      res += `${color}${tokenText}\x1b[0m`;
    } else {
      res += tokenText;
    }
  }

  return res;
}
