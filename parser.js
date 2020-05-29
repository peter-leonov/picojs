export function parser(tokens) {
  let token = null;

  function next() {
    token = tokens.next().value;
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
  }

  function BinaryExpression() {
    const head = NumericLiteral();
    if (!head) return null;

    return BinaryExpressionTail(head);
  }
  function BinaryExpressionTail(left) {
    const plus = PlusToken();
    if (!plus) return left;
    const right = NumericLiteral();
    if (!right) {
      throw new SyntaxError(
        `Expected token type "NumericLiteral" got "${token.type}"`
      );
    }

    const node = {
      type: "BinaryExpression",
      left,
      operatorToken: plus,
      right,
      // TODO: loc
    };

    return BinaryExpressionTail(node);
  }

  next();
  const program = BinaryExpression();

  // @ts-ignore
  if (token.type != "EndOfFileToken") {
    throw new SyntaxError(
      // @ts-ignore
      `Expected token type "EndOfFileToken" got "${token.type}"`
    );
  }

  return program;
}
