function unimplemented(message = "not implemented") {
  throw new Error(message);
}

function TypeNumber(loc) {
  this.loc = loc;
}

function TypeRegExp(loc) {
  this.loc = loc;
}

export function typecheck(root) {
  const visitor = {
    NumericLiteral({ loc }) {
      return new TypeNumber(loc);
    },

    RegExpToken({ loc }) {
      return new TypeRegExp(loc);
    },

    BinaryExpression({ left, operatorToken: op, right, loc }) {
      const leftType = visit(left);
      const rightType = visit(right);

      const spanLoc = {
        file: left.loc.file,
        start: left.loc.start,
        end: right.loc.end,
      };

      switch (op.type) {
        case "MulToken":
        case "DivToken":
        case "PlusToken":
          if (!(leftType instanceof TypeNumber)) {
            throw new Error(
              `lefthandside argument to binary operator "${op.type}" must NOT be of type "number" at ${leftType.loc.file}:${leftType.loc.start.line}:${leftType.loc.start.column}`
            );
          }
          if (!(rightType instanceof TypeNumber)) {
            throw new Error(
              `righthandside argument to binary operator "${op.type}" must NOT be of type "number" at ${rightType.loc.file}:${rightType.loc.start.line}:${rightType.loc.start.column}`
            );
          }

          return new TypeNumber(spanLoc);

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
