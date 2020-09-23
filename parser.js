export function parser(file, tokens) {
  let token = null;

  function next() {
    token = tokens.next();
    if (!token) {
      throw new TypeError("next token is undefined");
    }
    console.log("parser: ", token && token.type);
  }

  function NumericLiteral() {
    if (token.type === "NumericLiteral") {
      const _token = token;
      next();
      return _token;
    }
  }

  function PlusToken() {
    if (token.type === "PlusToken") {
      const _token = token;
      next();
      return _token;
    }

    return null;
  }

  function MulToken() {
    if (token.type === "MulToken") {
      const _token = token;
      next();
      return _token;
    }

    return null;
  }

  function DivToken() {
    if (token.type === "DivToken") {
      const _token = token;
      next();
      return _token;
    }

    return null;
  }

  function BinaryExpression() {
    const head = NumericLiteral();
    if (!head) return null;

    return PlusExpression(MulExpression(head));
  }
  function PlusExpression(left) {
    const op = PlusToken();
    if (!op) return left;
    const next = NumericLiteral();
    if (!next) {
      throw new SyntaxError(
        `Expected token type "NumericLiteral" got "${token.type}" at ${file}:${token.loc.start.line}:${token.loc.start.column}`
      );
    }

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
    const right = NumericLiteral();
    if (!right) {
      throw new SyntaxError(
        `Expected token type "NumericLiteral" got "${token.type}" at ${file}:${token.loc.start.line}:${token.loc.start.column}`
      );
    }

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
