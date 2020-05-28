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
    const left = NumericLiteral();
    if (!left) return null;

    return BinaryExpressionTail(left);
  }
  function BinaryExpressionTail(left) {
    const plus = PlusToken();
    if (!plus) return null;
    const right = NumericLiteral();
    if (!right) return null;

    return {
      type: "BinaryExpression",
      left,
      operatorToken: plus,
      right,
      // TODO: loc
    };
  }

  next();
  const program = BinaryExpression();

  if (program == null) {
    // @ts-ignore
    throw new SyntaxError(`Panic!`);
  }

  if (token != null) {
    // @ts-ignore
    throw new SyntaxError(`Unknown token ${token.type}`);
  }

  return program;
}
