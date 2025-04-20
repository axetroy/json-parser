function evalJsonAst(node) {
	switch (node.type) {
		case "Object": {
			const obj = {};
			for (const prop of node.properties) {
				obj[prop.key] = evalJsonAst(prop.value);
			}
			return obj;
		}
		case "Array": {
			return node.elements.map(evalJsonAst);
		}
		case "String":
		case "Number":
		case "Boolean":
		case "Null":
			return node.value;
		default:
			throw new TypeError(`Unsupported AST node type: ${node.type}`);
	}
}
