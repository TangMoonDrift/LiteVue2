export const patchProps = (el, props) => {
	for (const propsKey in props) {
		if (props === 'style') {
			for (const styleName in props.style) {
				el.style[styleName] = props.style[styleName]
			}
		} else {
			el.setAttribute(propsKey, props[propsKey])
		}
	}
}

export const createElement = (vNode) => {
	const {tag, props, text, children} = vNode
	if (typeof tag === 'string') {
		// 虚拟节点上挂载的真实节点
		vNode.el = document.createElement(tag)
		patchProps(vNode.el, props)
		children.forEach(child => {
			vNode.el.appendChild(createElement(child))
		})
	} else {
		vNode.el = document.createTextNode(text)
	}
	return vNode.el
}

export const patch = (oldNode, vNode) => {
	const isRealElement = oldNode.nodeType
	if (isRealElement) {
		const parent = oldNode.parentNode
		const newElement = createElement(vNode)
		parent.insertBefore(newElement, oldNode.nextSibling)
		parent.removeChild(oldNode)
		// console.log(newElement)
		return newElement
	} else {
		// diff 算法
	}
}
