function unimplemented(message = "not implemented") {
  throw new Error(message);
}

export function typecheck(root) {
  const visitor = {
    NumericLiteral() {
      return "number";
    },

    RegExpToken() {
      return "RegExp";
    },

    BinaryExpression({ left, operatorToken: op, right, loc }) {
      const leftType = visit(left);
      const rightType = visit(right);

      switch (op.type) {
        case "MulToken":
        case "DivToken":
        case "PlusToken":
          if (leftType !== "number") {
            throw new Error(
              `lefthandside argument to binary operator "${op.type}" must be of type "number"`
            );
          }
          if (rightType !== "number") {
            throw new Error(
              `righthandside argument to binary operator "${op.type}" must be of type "number"`
            );
          }

          return "number";

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
