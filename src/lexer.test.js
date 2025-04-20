import assert from "node:assert";
import test, { describe } from "node:test";
import { jsonLexer } from "./lexer.js";

describe("should tokenize an object", () => {
	test("{}", () => {
		const input = "{}";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "LBRACE", value: "{", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } } },
			{ type: "RBRACE", value: "}", loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 2 } } },
		]);
	});

	test('{"key": "value"}', () => {
		const input = '{"key": "value"}';
		const tokens = jsonLexer(input);

		assert.deepStrictEqual(tokens, [
			{ type: "LBRACE", value: "{", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } } },
			{ type: "STRING", value: "key", loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 6 } } },
			{ type: "COLON", value: ":", loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 7 } } },
			{ type: "STRING", value: "value", loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 15 } } },
			{ type: "RBRACE", value: "}", loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 16 } } },
		]);
	});
});

describe("should tokenize a array", () => {
	test("[]", () => {
		const input = "[]";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "LBRACKET", value: "[", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } } },
			{ type: "RBRACKET", value: "]", loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 2 } } },
		]);
	});
});

describe("should tokenize a string", () => {
	test("hello", () => {
		const input = '"hello"';
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "STRING", value: "hello", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 7 } } },
		]);
	});
});

describe("should tokenize a number", () => {
	test("123", () => {
		const input = "123";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "NUMBER", value: "123", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 4 } } },
		]);
	});
});

describe("should tokenize a boolean", () => {
	test("true", () => {
		const input = "true";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "BOOLEAN", value: "true", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 5 } } },
		]);
	});

	test("false", () => {
		const input = "false";
		const tokens = jsonLexer(input);
		assert.deepStrictEqual(tokens, [
			{ type: "BOOLEAN", value: "false", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 6 } } },
		]);
	});
});

test("should tokenize null", () => {
	const input = "null";
	const tokens = jsonLexer(input);
	assert.deepStrictEqual(tokens, [{ type: "NULL", value: "null", loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 5 } } }]);
});

test("should throw an error for invalid input", () => {
	const input = "@";
	assert.throws(() => jsonLexer(input), SyntaxError);
});
