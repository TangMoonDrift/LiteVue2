export const createElementVNode = (vm, tag, props, ...children) => {
	props ??= {}
	const key = props.key
	delete props.key
	return createVNode(vm, tag, props, key, undefined, children)
}

export const createTextVNode = (vm, text) => {
	return createVNode(vm, undefined, undefined, undefined, text, undefined)
}

export const createVNode = (vm, tag, props, key, text, children) => {
	return {
		vm,
		tag,
		props,
		key,
		text,
		children
	}
}
