import proxy from './reactive/index.js'
import { compileToFunction } from './compiler/index.js'
import { mountComponent } from './lifeCycle.js'
import { createElementVNode, createTextVNode } from './vnode/index.js'
import { patch } from './vnode/patch.js'
import { nextTick } from './reactive/watcher.js'

class Vue {

	constructor(options) {
		this.$options = options
		this.$data = typeof options?.data === 'function' ?
			options.data.call(this) :
			options?.data
		this._data = proxy(this.$data)
		this.proxyData()
		if (options.el) {
			this.$mount(options.el)
		}
	}

	proxyData() {
		const vm = this
		for (let key in vm._data) {
			Object.defineProperty(vm, key, {
				get() {
					return vm._data[key]
				},
				set(newValue) {
					vm._data[key] = newValue
				}
			})
		}
	}

	$mount(el) {
		const vm = this
		const ops = vm.$options
		const dom = document.querySelector(el)
		if (!ops.render) {
			const HTMLStr = ops.template || dom?.outerHTML.toString()
			if (HTMLStr) {
				ops.render = compileToFunction(HTMLStr)
			}
		}
		mountComponent(vm, dom)
	}

	_render() {
		const vm = this
		return this.$options.render.call(vm)
	}

	_update(vNode) {
		const el = this.$el
		this.$el = patch(el, vNode)
	}

	_c() {
		return createElementVNode(this, ...arguments)
	}

	_s(value) {
		if (typeof value !== 'object') return value
		return JSON.stringify(value)
	}

	_v() {
		return createTextVNode(this, ...arguments)
	}

	$nextTick(callback) {
		nextTick(callback)
	}
}

export default Vue
