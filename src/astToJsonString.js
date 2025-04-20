function astToJsonString(ast, indent = 2) {
	const space = " ".repeat(indent);

	function stringify(node, depth) {
		const pad = space.repeat(depth);

		switch (node.type) {
			case "Object":
				if (node.properties.length === 0) return "{}";
				return `{\n${node.properties
					.map(({ key, value }) => `${pad}${space}"${key}": ${stringify(value, depth + 1)}`)
					.join(",\n")}\n${pad}}`;

			case "Array":
				if (node.elements.length === 0) return "[]";
				return `[\n${node.elements.map((el) => `${pad}${space}${stringify(el, depth + 1)}`).join(",\n")}\n${pad}]`;

			case "String":
				return JSON.stringify(node.value); // handles escape characters

			case "Number":
				return String(node.value);

			case "Boolean":
				return node.value ? "true" : "false";

			case "Null":
				return "null";

			default:
				throw new TypeError(`Unknown node type: ${node.type}`);
		}
	}

	return stringify(ast, 0);
}
