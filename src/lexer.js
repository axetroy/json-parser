/**
 *
 * @param {string} input
 * @returns
 */
function jsonLexer(input) {
	const tokens = [];
	const length = input.length;
	let i = 0;
	let line = 1;
	let column = 1;

	const WHITESPACE = /\s/;
	const NUMBER = /[0-9]/;
	const LETTER = /[a-zA-Z]/;

	/**
	 * Advances the current position in the input string.
	 * @param {number} n
	 */
	function advance(n = 1) {
		while (n-- > 0 && i < length) {
			if (input[i] === "\n") {
				line++;
				column = 1;
			} else {
				column++;
			}
			i++;
		}
	}

	function makeToken(type, value, startLine, startColumn) {
		return {
			type,
			value,
			// start: Math.max(0, i - value.length),
			// end: i,
			loc: {
				start: { line: startLine, column: startColumn },
				end: { line, column },
			},
		};
	}

	while (i < length) {
		const char = input[i];

		if (WHITESPACE.test(char)) {
			advance();
			continue;
		}

		const startLine = line;
		const startColumn = column;

		if (char === "{") {
			tokens.push(makeToken("LBRACE", "{", startLine, startColumn));
			advance();
			continue;
		}

		if (char === "}") {
			tokens.push(makeToken("RBRACE", "}", startLine, startColumn));
			advance();
			continue;
		}

		if (char === "[") {
			tokens.push(makeToken("LBRACKET", "[", startLine, startColumn));
			advance();
			continue;
		}

		if (char === "]") {
			tokens.push(makeToken("RBRACKET", "]", startLine, startColumn));
			advance();
			continue;
		}

		if (char === ":") {
			tokens.push(makeToken("COLON", ":", startLine, startColumn));
			advance();
			continue;
		}

		if (char === ",") {
			tokens.push(makeToken("COMMA", ",", startLine, startColumn));
			advance();
			continue;
		}

		if (char === '"') {
			let value = "";
			advance(); // skip opening quote
			while (i < length && input[i] !== '"') {
				if (input[i] === "\\") {
					value += input[i];
					advance();
					if (i >= length) {
						throw new SyntaxError(`Unclosed string literal at ${startLine}:${startColumn}`);
					}
					value += input[i];
				} else {
					value += input[i];
				}
				advance();
			}
			if (i >= length) {
				throw new SyntaxError(`Unclosed string literal at ${startLine}:${startColumn}`);
			}
			tokens.push(makeToken("STRING", value, startLine, startColumn));
			advance(); // skip closing quote
			continue;
		}

		if (NUMBER.test(char) || char === "-") {
			let value = "";
			if (char === "-") {
				value += "-";
				advance();
			}
			while (i < length && NUMBER.test(input[i])) {
				value += input[i];
				advance();
			}
			if (input[i] === ".") {
				value += ".";
				advance();
				while (i < length && NUMBER.test(input[i])) {
					value += input[i];
					advance();
				}
			}
			if (input[i] === "e" || input[i] === "E") {
				value += input[i++];
				if (input[i] === "+" || input[i] === "-") {
					value += input[i++];
				}
				while (i < length && NUMBER.test(input[i])) {
					value += input[i++];
				}
			}

			tokens.push(makeToken("NUMBER", value, startLine, startColumn));
			continue;
		}

		if (LETTER.test(char)) {
			let value = "";
			while (i < length && LETTER.test(input[i])) {
				value += input[i];
				advance();
			}
			if (value === "true" || value === "false") {
				tokens.push(makeToken("BOOLEAN", value, startLine, startColumn));
			} else if (value === "null") {
				tokens.push(makeToken("NULL", value, startLine, startColumn));
			} else {
				throw new SyntaxError(`Unknown literal '${value}' at ${startLine}:${startColumn}`);
			}
			continue;
		}

		throw new SyntaxError(`Unexpected character '${char}' at ${line}:${column}`);
	}

	return tokens;
}

export { jsonLexer };
