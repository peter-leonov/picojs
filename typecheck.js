function unimplemented(message = "not implemented") {
  throw new Error(message);
}

function unreachable() {
  throw new Error("unreachable!");
}

class TypeBase {
  constructor(loc) {
    this.loc = loc;
  }
  name() {
    unreachable();
  }
  operatorPlus() {
    return false;
  }
}

class TypeNumber extends TypeBase {
  name() {
    return "number";
  }
  operatorPlus(right) {
    if (right instanceof TypeNumber) {
      return TypeNumber;
    }

    return null;
  }
}

class TypeRegExp extends TypeBase {
  name() {
    return "RegExp";
  }
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
        case "PlusToken":
          const newType = leftType.operatorPlus(rightType);
          if (!newType) {
            throw new Error(
              `Operator '+' cannot be applied to types '${leftType.name()}' and '${rightType.name()}'.`
            );
          }
          return new newType(spanLoc);

        case "MulToken":
        case "DivToken":
          unimplemented();

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
