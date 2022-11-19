const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ ncname }\\:)?${ ncname })`
const startTagOpen = new RegExp(`^<${ qnameCapture }`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

const parseHTML = (HTMLStr) => {
	const ELEMENT_TYPE = 1
	const TEXT_TYPE = 3
	const stack = []
	let currentParent = null
	let root = null

	const createAST = (tag, attrs) => {
		return {
			tag,
			type: ELEMENT_TYPE,
			children: [],
			attrs,
			parent: null
		}
	}
	const advance = (len) => {
		HTMLStr = HTMLStr.substring(len)
	}
	const start = (tag, attrs) => {
		let node = createAST(tag, attrs)
		if (!root) {
			root = node
		}
		if (currentParent) {
			node.parent = currentParent
			currentParent.children.push(node)
		}
		stack.push(node)
		currentParent = node
	}
	const chars = (text) => {
		text = text.replace(/\s/g, '')
		// 文本直接放入当前指向的节点中
		text && currentParent.children.push({
			type: TEXT_TYPE,
			text,
			parent: currentParent
		})
	}
	const end = () => {
		stack.pop()
		currentParent = stack[stack.length - 1]
	}
	const parseStartTag = () => {
		const start = HTMLStr.match(startTagOpen)
		// console.log(start)
		if (start) {
			const match = {
				tagName: start[1],
				attrs: []
			}
			advance(start[0].length)
			// console.log(HTMLStr)
			// 如果不是开始标签的结束就一直匹配下去
			let attr, end
			while (
				!(end = HTMLStr.match(startTagClose)) &&
				(attr = HTMLStr.match(attribute))
				) {
				if (attr) {
					advance(attr[0].length)
					match.attrs.push({
						name: attr[1],
						value: attr[3] || attr[4] || attr[5] || true
					})
				}
			}
			// 删除开始标签的尖角号
			if (end) {
				advance(end[0].length)
			}
			return match
		}
		// console.log(HTMLStr)
		return false
	}
	// HTMLStr 以`<`开头
	while (HTMLStr) {
		let textEnd = HTMLStr.indexOf('<')
		if (textEnd === 0) {
			const startTagMatch = parseStartTag(HTMLStr)
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs)
				continue
			}
			const endTagMatch = HTMLStr.match(endTag)
			if (endTagMatch) {
				end()
				advance(endTagMatch[0].length)
			}
		} else if (textEnd > 0) {
			let text = HTMLStr.substring(0, textEnd)
			chars(text)
			advance(text.length)
		}
	}
	// console.log(root)
	return root
}

export default parseHTML
