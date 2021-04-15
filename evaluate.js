export function evaluate(root) {
  function NumericLiteral({ value }) {
    return value;
  }

  function BinaryExpression({ left, operatorToken: op, right }) {
    const leftValue = visit(left);
    const rightValue = visit(right);

    switch (op.type) {
      case "MulToken":
        return leftValue * rightValue;

      case "DivToken":
        return leftValue / rightValue;

      case "PlusToken":
        return leftValue + rightValue;

      default:
        throw new Error(
          `unknown operator "${op.type}" at ${op.loc.file}:${op.loc.start.line}:${op.loc.start.column}`
        );
    }

    return 123;
  }

  function visit(node) {
    if (node == null) throw "something";
    switch (node.type) {
      case "BinaryExpression":
        return BinaryExpression(node);

      case "NumericLiteral":
        return NumericLiteral(node);

      default:
        throw new Error(
          `unknown node type "${node.type}" at ${node.loc.file}:${node.loc.start.line}:${node.loc.start.column}`
        );
    }
  }

  return visit(root);
}
