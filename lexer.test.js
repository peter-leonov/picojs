const { lexer } = require("./lexer.js");

describe("lexer", () => {
  it("return a generator", () => {
    const iter = [].values();
    const tokens = lexer("file", "");
    expect(tokens).toBeInstanceOf(iter.constructor);
  });

  // TODO: remove once switched to TS
  it("takes two arguments", () => {
    expect(lexer.length).toBe(2);
  });

  it("throws SyntaxError for an unknown charater", () => {
    expect(() => [
      ...lexer("file", "%%%"),
    ]).toThrowErrorMatchingInlineSnapshot(
      `"unexpected character \\"%\\" at file:1:1"`
    );
  });

  it("return EndOfFileToken for an empty file", () => {
    expect([...lexer("file", "")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 1,
              "line": 1,
            },
            "start": Object {
              "column": 1,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });

  it("skipps whitespaces", () => {
    expect([...lexer("file", "   \t    ")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 9,
              "line": 1,
            },
            "start": Object {
              "column": 9,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });

  it("parses PlusToken", () => {
    expect([...lexer("file", "+++")]).toMatchInlineSnapshot(`
      Array [
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
          "type": "PlusToken",
        },
        Object {
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
        Object {
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
          "type": "PlusToken",
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 1,
            },
            "start": Object {
              "column": 4,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });

  it("parses NumericLiteral", () => {
    expect([...lexer("file", "9 9")]).toMatchInlineSnapshot(`
      Array [
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
          "value": 9,
        },
        Object {
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
          "value": 9,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 1,
            },
            "start": Object {
              "column": 4,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);

    expect([...lexer("file", "123 456")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 1,
            },
            "start": Object {
              "column": 1,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 123,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 8,
              "line": 1,
            },
            "start": Object {
              "column": 5,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 456,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 8,
              "line": 1,
            },
            "start": Object {
              "column": 8,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });

  it("parses newline", () => {
    expect([...lexer("file", "")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 1,
              "line": 1,
            },
            "start": Object {
              "column": 1,
              "line": 1,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);

    expect([...lexer("file", "\n")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 1,
              "line": 2,
            },
            "start": Object {
              "column": 1,
              "line": 2,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);

    expect([...lexer("file", "   \n   ")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 2,
            },
            "start": Object {
              "column": 4,
              "line": 2,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);

    expect([...lexer("file", "   \n   \n")]).toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 1,
              "line": 3,
            },
            "start": Object {
              "column": 1,
              "line": 3,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);

    expect([...lexer("file", "   \n   \n   ")])
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 3,
            },
            "start": Object {
              "column": 4,
              "line": 3,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });

  expect([...lexer("file", "\n\n\n")]).toMatchInlineSnapshot(`
    Array [
      Object {
        "loc": Object {
          "end": Object {
            "column": 1,
            "line": 4,
          },
          "start": Object {
            "column": 1,
            "line": 4,
          },
        },
        "type": "EndOfFileToken",
      },
    ]
  `);

  it("just parses multiple tokens", () => {
    expect([...lexer("file", "1+1 + 4 4 4 + + 9\n9 9 4444 \t\t\t ")])
      .toMatchInlineSnapshot(`
      Array [
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
        },
        Object {
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
        Object {
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
          "value": 1,
        },
        Object {
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
          "type": "PlusToken",
        },
        Object {
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
        Object {
          "loc": Object {
            "end": Object {
              "column": 10,
              "line": 1,
            },
            "start": Object {
              "column": 9,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 4,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 12,
              "line": 1,
            },
            "start": Object {
              "column": 11,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 4,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 14,
              "line": 1,
            },
            "start": Object {
              "column": 13,
              "line": 1,
            },
          },
          "type": "PlusToken",
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 16,
              "line": 1,
            },
            "start": Object {
              "column": 15,
              "line": 1,
            },
          },
          "type": "PlusToken",
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 18,
              "line": 1,
            },
            "start": Object {
              "column": 17,
              "line": 1,
            },
          },
          "type": "NumericLiteral",
          "value": 9,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 2,
              "line": 2,
            },
            "start": Object {
              "column": 1,
              "line": 2,
            },
          },
          "type": "NumericLiteral",
          "value": 9,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 4,
              "line": 2,
            },
            "start": Object {
              "column": 3,
              "line": 2,
            },
          },
          "type": "NumericLiteral",
          "value": 9,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 9,
              "line": 2,
            },
            "start": Object {
              "column": 5,
              "line": 2,
            },
          },
          "type": "NumericLiteral",
          "value": 4444,
        },
        Object {
          "loc": Object {
            "end": Object {
              "column": 14,
              "line": 2,
            },
            "start": Object {
              "column": 14,
              "line": 2,
            },
          },
          "type": "EndOfFileToken",
        },
      ]
    `);
  });
});
