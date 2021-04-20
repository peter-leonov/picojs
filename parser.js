export function parser(tokens) {
  let token = null;
  const rawTokens = [];

  function next(mode) {
    token = tokens.next(mode);
    if (!token) {
      throw new TypeError("next token is undefined");
    }
    rawTokens.push(token);
    if (
      token.type === "CommentToken" ||
      token.type === "Whitespace" ||
      token.type === "Newline"
    ) {
      return next(mode);
    }
    // console.log("parser: ", token && token.type);
  }

  function panic(message) {
    throw new SyntaxError(
      // @ts-ignore
      `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}`
    );
  }

  function ValueLiteral() {
    if (
      token.type === "Id" ||
      token.type === "NumericLiteral" ||
      token.type === "String" ||
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
      panic(
        `Expected token type "NumericLiteral" or "RegExpLiteral" got "${token.type}"`
      );
    }
    return next;
  }

  function take(type, mode) {
    if (token.type === type) {
      const _token = token;
      next(mode);
      return _token;
    }

    panic(`Expected token type "${type}" got "${token.type}"`);
  }

  function maybeTake(type, mode) {
    if (token.type === type) {
      const _token = token;
      next(mode);
      return _token;
    }

    return null;
  }

  function PlusToken() {
    if (token.type === "PlusToken") {
      const _token = token;
      next("expression");
      return _token;
    }

    return null;
  }

  function MulToken() {
    if (token.type === "MulToken") {
      const _token = token;
      next("expression");
      return _token;
    }

    return null;
  }

  function DivToken() {
    if (token.type === "DivToken") {
      const _token = token;
      next("expression");
      return _token;
    }

    return null;
  }

  function Expression() {
    return BinaryExpression();
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
      loc: {
        file: op.loc.file,
        start: left.loc.start,
        end: right.loc.end,
      },
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
      loc: {
        file: op.loc.file,
        start: left.loc.start,
        end: right.loc.end,
      },
    };

    return MulExpression(node);
  }

  function IfStatement() {
    const kw = maybeTake("If");
    if (!kw) return null;
    take("OpenParent", "expression");
    const condition = Expression();
    if (!condition) {
      panic("Expected an Expression");
    }
    take("CloseParent", "expression");
    const then = Statement();

    return {
      type: "If",
      condition,
      then,
      loc: {
        file: kw.loc.file,
        start: kw.loc.start,
        end: then.loc.end,
      },
    };
  }

  function Statement() {
    const expr = Expression();
    if (expr) {
      take("Semicolon", "expression");
      return expr;
    }

    const ifstmt = IfStatement();
    if (ifstmt) {
      return ifstmt;
    }

    return null;
  }

  function Statements() {
    const stmts = [];
    for (;;) {
      const stmt = Statement();
      if (!stmt) break;
      stmts.push(stmt);
    }
    return stmts;
  }

  next("expression");
  const ast = Statements();

  // @ts-ignore
  if (token.type != "EndOfFileToken") {
    panic(`Expected token type "EndOfFileToken" got "${token.type}"`);
  }

  return { ast, tokens: rawTokens };
}
