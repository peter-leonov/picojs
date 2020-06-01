const { lexer } = require("./lexer.js");
const { parser } = require("./parser.js");

describe("parser", () => {
  it("parses empty string", () => {
    const tokens = [
      {
        type: "EndOfFileToken",
      },
    ];
    expect(parser("file", tokens.values())).toMatchInlineSnapshot(
      `null`
    );
  });

  it("reports an error if there is no EOF", () => {
    expect(() =>
      parser("file", [].values())
    ).toThrowErrorMatchingInlineSnapshot(`"next token is undefined"`);

    expect(() =>
      parser("file", [{ type: "NumericLiteral" }].values())
    ).toThrowErrorMatchingInlineSnapshot(`"next token is undefined"`);
  });

  it("parses BinaryExpression", () => {
    expect(parser("file", lexer("file", "1"))).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 2,
            "line": 1,
          },
          "start": Object {
            "column": 1,
            "line": 1,
          },
        },
        "type": "NumericLiteral",
        "value": 1,
      }
    `);

    expect(parser("file", lexer("file", "1+2")))
      .toMatchInlineSnapshot(`
      Object {
        "left": Object {
          "loc": Object {
            "end": Object {
              "column": 2,
              "line": 1,
            },
            "start": Object {
              "column": 1,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 1,
        },
        "operatorToken": Object {
          "loc": Object {
            "end": Object {
              "column": 3,
              "line": 1,
            },
            "start": Object {
              "column": 2,
              "line": 1,
            },
          },
          "type": "PlusToken",
        },
        "right": Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 1,
            },
            "start": Object {
              "column": 3,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 2,
        },
        "type": "BinaryExpression",
      }
    `);

    expect(parser("file", lexer("file", "1+2+3")))
      .toMatchInlineSnapshot(`
      Object {
        "left": Object {
          "left": Object {
            "loc": Object {
              "end": Object {
                "column": 2,
                "line": 1,
              },
              "start": Object {
                "column": 1,
                "line": 1,
              },
            },
            "type": "NumericLiteral",
            "value": 1,
          },
          "operatorToken": Object {
            "loc": Object {
              "end": Object {
                "column": 3,
                "line": 1,
              },
              "start": Object {
                "column": 2,
                "line": 1,
              },
            },
            "type": "PlusToken",
          },
          "right": Object {
            "loc": Object {
              "end": Object {
                "column": 4,
                "line": 1,
              },
              "start": Object {
                "column": 3,
                "line": 1,
              },
            },
            "type": "NumericLiteral",
            "value": 2,
          },
          "type": "BinaryExpression",
        },
        "operatorToken": Object {
          "loc": Object {
            "end": Object {
              "column": 5,
              "line": 1,
            },
            "start": Object {
              "column": 4,
              "line": 1,
            },
          },
          "type": "PlusToken",
        },
        "right": Object {
          "loc": Object {
            "end": Object {
              "column": 6,
              "line": 1,
            },
            "start": Object {
              "column": 5,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 3,
        },
        "type": "BinaryExpression",
      }
    `);

    expect(parser("file", lexer("file", "1+2+3+4")))
      .toMatchInlineSnapshot(`
      Object {
        "left": Object {
          "left": Object {
            "left": Object {
              "loc": Object {
                "end": Object {
                  "column": 2,
                  "line": 1,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                },
              },
              "type": "NumericLiteral",
              "value": 1,
            },
            "operatorToken": Object {
              "loc": Object {
                "end": Object {
                  "column": 3,
                  "line": 1,
                },
                "start": Object {
                  "column": 2,
                  "line": 1,
                },
              },
              "type": "PlusToken",
            },
            "right": Object {
              "loc": Object {
                "end": Object {
                  "column": 4,
                  "line": 1,
                },
                "start": Object {
                  "column": 3,
                  "line": 1,
                },
              },
              "type": "NumericLiteral",
              "value": 2,
            },
            "type": "BinaryExpression",
          },
          "operatorToken": Object {
            "loc": Object {
              "end": Object {
                "column": 5,
                "line": 1,
              },
              "start": Object {
                "column": 4,
                "line": 1,
              },
            },
            "type": "PlusToken",
          },
          "right": Object {
            "loc": Object {
              "end": Object {
                "column": 6,
                "line": 1,
              },
              "start": Object {
                "column": 5,
                "line": 1,
              },
            },
            "type": "NumericLiteral",
            "value": 3,
          },
          "type": "BinaryExpression",
        },
        "operatorToken": Object {
          "loc": Object {
            "end": Object {
              "column": 7,
              "line": 1,
            },
            "start": Object {
              "column": 6,
              "line": 1,
            },
          },
          "type": "PlusToken",
        },
        "right": Object {
          "loc": Object {
            "end": Object {
              "column": 8,
              "line": 1,
            },
            "start": Object {
              "column": 7,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 4,
        },
        "type": "BinaryExpression",
      }
    `);
  });

  it("does not parse BinaryExpression", () => {
    expect(() =>
      parser("file", lexer("file", "1+"))
    ).toThrowErrorMatchingInlineSnapshot(
      `"Expected token type \\"NumericLiteral\\" got \\"EndOfFileToken\\" at file:1:3"`
    );
  });
});
