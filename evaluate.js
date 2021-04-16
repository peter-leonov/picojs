export function Exception(message, loc) {
  this.message = message;
  this.backtrace = [loc];
}

export function evaluate(root) {
  const visitor = {
    NumericLiteral({ value }) {
      return value;
    },

    RegExpToken() {
      return /unimplemented/;
    },

    BinaryExpression({ left, operatorToken: op, right, loc }) {
      const leftValue = visit(left);
      const rightValue = visit(right);

      if (leftValue instanceof Exception) {
        leftValue.backtrace.push(loc);
        return leftValue;
      }
      if (rightValue instanceof Exception) {
        rightValue.backtrace.push(loc);
        return rightValue;
      }

      switch (op.type) {
        case "MulToken":
          return leftValue * rightValue;

        case "DivToken":
          // if (rightValue === 0) {
          //   return new Exception("division by zero error", op.loc);
          // }
          return leftValue / rightValue;

        case "PlusToken":
          return leftValue + rightValue;

        default:
          throw new Error(
            `unknown operator "${op.type}" at ${op.loc.file}:${op.loc.start.line}:${op.loc.start.column}`
          );
      }
    },
  };

  function visit(node) {
    const handler = visitor[node.type];
    if (!handler) {
      throw new Error(
        `unknown node type "${node.type}" at ${node.loc.file}:${node.loc.start.line}:${node.loc.start.column}`
      );
    }

    return handler(node);
  }

  return visit(root);
}
