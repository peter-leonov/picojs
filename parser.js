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

  function FunctionCall(name) {
    const open = maybeTake("OpenParent", "expression");
    if (!open) return name;

    const args = [];

    // head
    const expr = Expression();
    if (expr) {
      args.push(expr);
      for (;;) {
        const colon = maybeTake("Colon", "expression");
        if (!colon) break;
        const expr = Expression();
        args.push(expr);
      }
    }

    const close = take("CloseParent");

    return {
      type: "FunctionCall",
      name,
      arguments: args,
      loc: {
        file: open.loc.file,
        start: open.loc.start,
        end: close.loc.start,
      },
    };
  }

  function ExpressionMember() {
    if (token.type === "Id") {
      const _token = token;
      next();
      return FunctionCall(_token);
    }

    if (
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

  function ExpressionMemberMust() {
    const next = ExpressionMember();
    if (!next) {
      panic(`Expected ExpressionMember got "${token.type}"`);
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
    const head = ExpressionMember();
    if (!head) return null;

    return PlusExpression(MulExpression(head));
  }
  function PlusExpression(left) {
    const op = PlusToken();
    if (!op) return left;
    const next = ExpressionMemberMust();

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
    const right = ExpressionMemberMust();

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

  function Block() {
    const open = maybeTake("OpenCurly", "expression");
    if (!open) return null;
    const body = Statements();
    const close = take("CloseCurly", "expression");

    return {
      type: "Block",
      body,
      loc: {
        file: open.loc.file,
        start: open.loc.start,
        end: close.loc.start,
      },
    };
  }

  function IfStatement() {
    const kw = maybeTake("If");
    if (!kw) return null;
    take("OpenParent", "expression");
    const condition = Expression();
    if (!condition) {
      panic("Expected an Expression for condition");
    }
    take("CloseParent", "expression");
    const then = Block() || Statement();
    if (!then) {
      panic("Expected an Expression for then");
    }

    let els = null;
    const elseKw = maybeTake("Else", "expression");
    if (elseKw) {
      els = Block() || Statement();
      if (!els) {
        panic("Expected an Expression for else");
      }
    }

    const end = els ? els.loc.end : then.loc.end;

    return {
      type: "If",
      condition,
      then,
      else: els,
      loc: {
        file: kw.loc.file,
        start: kw.loc.start,
        end,
      },
    };
  }

  function ArgumentList() {
    const args = [];
    take("OpenParent", "expression");

    // head
    const id = maybeTake("Id");
    if (id) {
      args.push(id);
    }

    for (;;) {
      const colon = maybeTake("Colon");
      if (!colon) break;
      const id = take("Id");
      args.push(id);
    }

    take("CloseParent");

    return args;
  }

  function FunctionStatement() {
    const kw = maybeTake("Function");
    if (!kw) return null;

    const name = take("Id");
    const args = ArgumentList();

    const body = Block();
    if (!body) {
      panic("Expected a Bloc for the function");
    }

    return {
      type: "FunctionStatement",
      name,
      args,
      body,
      loc: {
        file: kw.loc.file,
        start: kw.loc.start,
        end: body.loc.end,
      },
    };
  }

  function Statement() {
    const expression = Expression();
    if (expression) {
      const sc = take("Semicolon", "expression");
      return {
        type: "Statement",
        expression,
        loc: {
          file: expression.loc.file,
          start: expression.loc.start,
          end: sc.loc.end,
        },
      };
    }

    const ifstmt = IfStatement();
    if (ifstmt) {
      maybeTake("Semicolon", "expression");
      return ifstmt;
    }

    const fnstmt = FunctionStatement();
    if (fnstmt) {
      return fnstmt;
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
