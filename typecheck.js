function unimplemented(message = "not implemented") {
  throw new Error(message);
}

function unreachable() {
  throw new Error("unreachable!");
}

function locToStart(loc) {
  return `${loc.file}:${loc.start.line}:${loc.start.column}`;
}

class TypeBase {
  constructor(loc) {
    this.loc = loc;
  }
  name() {
    unreachable();
  }
  operatorPlus() {
    return null;
  }
  operatorMul() {
    return null;
  }
  operatorDiv() {
    return null;
  }
}

class TypeAny extends TypeBase {
  name() {
    return "any";
  }

  operatorPlus() {
    return TypeAny;
  }
  operatorMul() {
    return TypeAny;
  }
  operatorDiv() {
    return TypeAny;
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

  operatorMul(right) {
    if (right instanceof TypeNumber) {
      return TypeNumber;
    }

    return null;
  }

  operatorDiv(right) {
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
  const errors = [];

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
        case "PlusToken": {
          const newType = leftType.operatorPlus(rightType);
          if (!newType) {
            errors.push(
              `Operator '+' cannot be applied to types '${leftType.name()}' and '${rightType.name()}' at ${locToStart(
                spanLoc
              )}.`
            );
            return new TypeAny(spanLoc);
          }
          return new newType(spanLoc);
        }

        case "MulToken": {
          const newType = leftType.operatorMul(rightType);
          if (!newType) {
            errors.push(
              `Operator '*' cannot be applied to types '${leftType.name()}' and '${rightType.name()}' at ${locToStart(
                spanLoc
              )}.`
            );
          }
          return new TypeAny(spanLoc);
        }

        case "DivToken": {
          const newType = leftType.operatorDiv(rightType);
          if (!newType) {
            errors.push(
              `Operator '/' cannot be applied to types '${leftType.name()}' and '${rightType.name()}' at ${locToStart(
                spanLoc
              )}.`
            );
          }
          return new TypeAny(spanLoc);
        }

        default:
          throw new Error(
            `unknown operator "${op.type}" at ${locToStart(op.loc)}`
          );
      }
    },
  };

  function visit(node) {
    const handler = visitor[node.type];
    if (!handler) {
      throw new Error(
        `unknown node type "${node.type}" at ${locToStart(node.loc)}`
      );
    }

    return handler(node);
  }

  visit(root);

  return errors;
}
