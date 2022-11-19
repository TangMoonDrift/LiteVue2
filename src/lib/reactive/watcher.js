import Dep from './dep.js'
// import { deepClone } from '../../util/index.js'

let id = 0
let queue = new Set()
let ids = new Set()
let pending = false

class Watcher {
	// 不同的组件有不同的watcher
	constructor(vm, fn, flag) {
		this.id = id++
		this.getter = fn
		this.renderWatcher = flag
		this.deps = new Set()
		this.depsId = new Set()
		this.get()
	}

	get() {
		Dep.target = this
		this.getter()
		Dep.target = null
	}

	addDeps(dep) {
		let id = dep.id
		if (!this.depsId.has(id)) {
			this.deps.add(dep)
			this.depsId.add(id)
			dep.addSub(this)
		}
	}

	update() {
		// this.get()
		queueWatcher(this)
	}

	run() {
		console.log('run')
		this.get()
	}
}

function queueWatcher(watcher) {
	const id = watcher.id
	if (!ids.has(id)) {
		queue.add(watcher)
		ids.add(id)
		// 不管update执行几次，最终只执行一轮刷新操作
		if (!pending) {
			nextTick(() => {
				// const temp = deepClone(queue)
				queue.forEach(watcher => {
					watcher.run()
				})
				queue.clear()
				ids.clear()
				pending = false
			})
			pending = true
		}
	}
}

const callbacks = []
let waiting = false
function flushCallbacks() {
	waiting = true
	callbacks.forEach(callback => {
		callback()
	})
	callbacks.length = 0
}

export function nextTick(callback) {
	callbacks.push(callback)
	if (!waiting) {
		Promise.resolve().then(() => {
			flushCallbacks()
		})
	}
}

export default Watcher
