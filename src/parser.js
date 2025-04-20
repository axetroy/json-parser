function parse(tokens) {
	let i = 0;

	function peek() {
		return tokens[i];
	}

	function consume(expectedType) {
		const token = tokens[i];
		if (!token || token.type !== expectedType) {
			throw new SyntaxError(
				`Expected token type ${expectedType}, got ${token?.type} at ${token?.loc?.start.line}:${token?.loc?.start.column}`
			);
		}
		i++;
		return token;
	}

	function withLoc(node, tokenStart, tokenEnd) {
		return {
			...node,
			loc: {
				start: tokenStart.loc.start,
				end: tokenEnd.loc.end,
			},
		};
	}

	function parseValue() {
		const token = peek();

		switch (token.type) {
			case "STRING": {
				const t = consume("STRING");
				return {
					type: "String",
					value: t.value,
					loc: t.loc,
				};
			}
			case "NUMBER": {
				const t = consume("NUMBER");
				return {
					type: "Number",
					value: Number(t.value),
					loc: t.loc,
				};
			}
			case "BOOLEAN": {
				const t = consume("BOOLEAN");
				return {
					type: "Boolean",
					value: t.value === "true",
					loc: t.loc,
				};
			}
			case "NULL": {
				const t = consume("NULL");
				return {
					type: "Null",
					value: null,
					loc: t.loc,
				};
			}
			case "LBRACE":
				return parseObject();
			case "LBRACKET":
				return parseArray();
			default:
				throw new SyntaxError(`Unexpected token: ${token.type}`);
		}
	}

	function parseObject() {
		const startToken = consume("LBRACE");
		const obj = {
			type: "Object",
			properties: [],
		};

		if (peek().type === "RBRACE") {
			const endToken = consume("RBRACE");
			return withLoc(obj, startToken, endToken);
		}

		while (true) {
			const keyToken = consume("STRING");
			consume("COLON");
			const value = parseValue();
			obj.properties.push({
				key: keyToken.value,
				keyLoc: keyToken.loc,
				value,
			});

			if (peek().type === "COMMA") {
				consume("COMMA");
			} else {
				break;
			}
		}

		const endToken = consume("RBRACE");
		return withLoc(obj, startToken, endToken);
	}

	function parseArray() {
		const startToken = consume("LBRACKET");
		const arr = {
			type: "Array",
			elements: [],
		};

		if (peek().type === "RBRACKET") {
			const endToken = consume("RBRACKET");
			return withLoc(arr, startToken, endToken);
		}

		while (true) {
			const value = parseValue();
			arr.elements.push(value);
			if (peek().type === "COMMA") {
				consume("COMMA");
			} else {
				break;
			}
		}

		const endToken = consume("RBRACKET");
		return withLoc(arr, startToken, endToken);
	}

	const result = parseValue();

	if (i < tokens.length) {
		const token = tokens[i];
		throw new SyntaxError(`Unexpected token at end: ${token.type} at ${token.loc.start.line}:${token.loc.start.column}`);
	}

	return result;
}
