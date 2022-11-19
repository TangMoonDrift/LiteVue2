import parseHTML from './parse.js'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)}}/g

export const genProps = (attrs = []) => {
	let str = ''
	attrs.forEach(attr => {
		if (attr.name === 'style') {
			let temp = {}
			attr.value.split(';').forEach(cssProp => {
				const [key, value] = cssProp.split(':')
				temp[key] = value
			})
			attr.value = temp
		}
		str += `${ attr.name }: ${ JSON.stringify(attr.value) },`
	})
	return `{${ str.slice(0, -1) }}`
}

export const gen = (node) => {
	if (node.type === 1) {
		return genCode(node)
	} else if (node.type === 3) {
		const text = node.text
		if (!defaultTagRE.test(text)) {
			return `_v(${JSON.stringify(text)})`
		} else {
			let tokens = []
			let match
			defaultTagRE.lastIndex = 0
			let lastIndex = 0
			while (match = defaultTagRE.exec(text)) {
				let index = match.index
				if (index > lastIndex) {
					tokens.push(JSON.stringify(text.slice(lastIndex, index)))
				}
				tokens.push(`_s(${match[1].trim()})`)
				lastIndex = index + match[0].length
			}
			if (lastIndex < text.length) {
				tokens.push(JSON.stringify(text.slice(lastIndex)))
			}
			return `_v(${tokens.join('+')})`
		}
	}
}

export const genChildren = (children) => {
	if (children) {
		return children.map(child => {
			return gen(child)
		}).join(',')
	}
}

export const genCode = (ast) => {
	const children = genChildren(ast.children)
	return `_c('${ ast.tag }',${
		ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
	},${
		ast.children.length > 0 ? `${ children }` : ''
	})`
}

export const compileToFunction = (template) => {
	const ast = parseHTML(template)
	const code = `with(this){ return ${genCode(ast)}}`
	// console.log(code)
	return new Function(code)
}
