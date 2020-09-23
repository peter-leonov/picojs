export function parser(file, tokens) {
  let token = null;

  function next(mode) {
    token = tokens.next(mode);
    if (!token) {
      throw new TypeError("next token is undefined");
    }
    console.log("parser: ", token && token.type);
  }

  function ValueLiteral() {
    if (
      token.type === "NumericLiteral" ||
      token.type === "RegExpToken"
    ) {
      const _token = token;
      next();
      return _token;
    }

    return null;
  }

  function ValueLiteralMust() {
    const next = ValueLiteral();
    if (!next) {
      throw new SyntaxError(
        `Expected token type "NumericLiteral" or "RegExpLiteral" got "${token.type}" at ${file}:${token.loc.start.line}:${token.loc.start.column}`
      );
    }
    return next;
  }

  function PlusToken() {
    if (token.type === "PlusToken") {
      const _token = token;
      next("value");
      return _token;
    }

    return null;
  }

  function MulToken() {
    if (token.type === "MulToken") {
      const _token = token;
      next("value");
      return _token;
    }

    return null;
  }

  function DivToken() {
    if (token.type === "DivToken") {
      const _token = token;
      next("value");
      return _token;
    }

    return null;
  }

  function BinaryExpression() {
    const head = ValueLiteral();
    if (!head) return null;

    return PlusExpression(MulExpression(head));
  }
  function PlusExpression(left) {
    const op = PlusToken();
    if (!op) return left;
    const next = ValueLiteralMust();

    // magic!!!
    const right = MulExpression(next);

    const node = {
      type: "BinaryExpression",
      left,
      operatorToken: op,
      right: right,
      // TODO: loc
    };

    return PlusExpression(node);
  }

  function MulExpression(left) {
    const op = MulToken() || DivToken();
    if (!op) return left;
    const right = ValueLiteralMust();

    const node = {
      type: "BinaryExpression",
      left,
      operatorToken: op,
      right,
      // TODO: loc
    };

    return MulExpression(node);
  }

  next();
  const program = BinaryExpression();

  // @ts-ignore
  if (token.type != "EndOfFileToken") {
    throw new SyntaxError(
      // @ts-ignore
      `Expected token type "EndOfFileToken" got "${token.type}" at ${file}:${token.loc.start.line}:${token.loc.start.column}`
    );
  }

  return program;
}
