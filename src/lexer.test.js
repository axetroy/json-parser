import assert from "node:assert";
import test, { describe } from "node:test";
import { jsonLexer } from "./lexer.js";

function extractToken(input, token) {
	assert.equal(input.slice(token.loc.start.offset, token.loc.end.offset), token.value);
}

// describe("should tokenize an object", () => {
// 	test("{}", () => {
// 		const input = "{}";
// 		const tokens = jsonLexer(input);
// 		assert.deepStrictEqual(tokens, [
// 			{ type: "LBRACE", value: "{", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } } },
// 			{ type: "RBRACE", value: "}", loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 2 } } },
// 		]);
// 	});

// 	test('{"key": "value"}', () => {
// 		const input = '{"key": "value"}';
// 		const tokens = jsonLexer(input);

// 		assert.deepStrictEqual(tokens, [
// 			{ type: "LBRACE", value: "{", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } } },
// 			{ type: "STRING", value: "key", loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 6 } } },
// 			{ type: "COLON", value: ":", loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 7 } } },
// 			{ type: "STRING", value: "value", loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 15 } } },
// 			{ type: "RBRACE", value: "}", loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 16 } } },
// 		]);
// 	});
// });

describe("should tokenize a array", () => {
	test("[]", () => {
		const input = "[]";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "LBRACKET", value: "[", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 1 } } },
			{ type: "RBRACKET", value: "]", loc: { start: { line: 1, column: 2, offset: 1 }, end: { line: 1, column: 2, offset: 2 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});

	test('["item1", "item2"]', () => {
		const input = '["item1", "item2"]';
		const tokens = jsonLexer(input);

		assert.deepStrictEqual(tokens, [
			{ type: "LBRACKET", value: "[", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 1 } } },
			{ type: "STRING", value: '"item1"', loc: { start: { line: 1, column: 2, offset: 1 }, end: { line: 1, column: 9, offset: 8 } } },
			{ type: "COMMA", value: ",", loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 9, offset: 9 } } },
			{
				type: "STRING",
				value: '"item2"',
				loc: { start: { line: 1, column: 11, offset: 10 }, end: { line: 1, column: 18, offset: 17 } },
			},
			{ type: "RBRACKET", value: "]", loc: { start: { line: 1, column: 18, offset: 17 }, end: { line: 1, column: 18, offset: 18 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});
});

describe("should tokenize a string", () => {
	test("hello", () => {
		const input = '"hello"';
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "STRING", value: '"hello"', loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 8, offset: 7 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});
});

describe("should tokenize a number", () => {
	test("123", () => {
		const input = "123";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "NUMBER", value: "123", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 4, offset: 3 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});
});

describe("should tokenize a boolean", () => {
	test("true", () => {
		const input = "true";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "BOOLEAN", value: "true", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 5, offset: 4 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});

	test("false", () => {
		const input = "false";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "BOOLEAN", value: "false", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } } },
		]);

		tokens.forEach((token) => extractToken(input, token));
	});
});

test("should tokenize null", () => {
	const input = "null";
	const tokens = jsonLexer(input);
	assert.deepStrictEqual(tokens, [
		{ type: "NULL", value: "null", loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 5, offset: 4 } } },
	]);

	tokens.forEach((token) => extractToken(input, token));
});

// test("should throw an error for invalid input", () => {
// 	const input = "@";
// 	assert.throws(() => jsonLexer(input), SyntaxError);
// });
