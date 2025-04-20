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

	function makeToken(type, value, startOffset, endOffSet, startLine, startColumn) {
		return {
			type,
			value,
			loc: {
				start: {
					line: startLine,
					column: startColumn,
					offset: startOffset,
				},
				end: {
					line,
					column,
					offset: endOffSet,
				},
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
		const startOffset = i;

		if (char === "{") {
			tokens.push(makeToken("LBRACE", "{", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === "}") {
			tokens.push(makeToken("RBRACE", "}", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === "[") {
			tokens.push(makeToken("LBRACKET", "[", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === "]") {
			tokens.push(makeToken("RBRACKET", "]", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === ":") {
			tokens.push(makeToken("COLON", ":", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === ",") {
			tokens.push(makeToken("COMMA", ",", startOffset, i + 1, startLine, startColumn));
			advance();
			continue;
		}

		if (char === '"') {
			const quote = input[i];
			let value = quote;
			advance(); // skip opening quote
			while (i < length && input[i] !== '"') {
				if (input[i] === "\\") {
					value += input[i];
					advance();
					if (i >= length) {
						throw new SyntaxError(`Unclosed string literal at ${startLine}:${startColumn}`);
					}
					value += input[i];
					advance(); // skip escaped character
				} else {
					value += input[i];
				}
				advance();
			}
			if (i >= length) {
				throw new SyntaxError(`Unclosed string literal at ${startLine}:${startColumn}`);
			}
			value += input[i]; // add closing quote
			advance(); // skip closing quote
			tokens.push(makeToken("STRING", value, startOffset, startOffset + value.length, startLine, startColumn));
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

			tokens.push(makeToken("NUMBER", value, startOffset, startOffset + value.length, startLine, startColumn));
			continue;
		}

		if (LETTER.test(char)) {
			let value = "";
			while (i < length && LETTER.test(input[i])) {
				value += input[i];
				advance();
			}
			if (value === "true" || value === "false") {
				tokens.push(makeToken("BOOLEAN", value, startOffset, startOffset + value.length, startLine, startColumn));
			} else if (value === "null") {
				tokens.push(makeToken("NULL", value, startOffset, startOffset + value.length, startLine, startColumn));
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
