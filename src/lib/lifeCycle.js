import Watcher from './reactive/watcher.js'

export const mountComponent = (vm, el) => {
	vm.$el = el
	// console.log(vm._render())
	const updateComponent = () => {
		// debugger
		vm._update(vm._render())
	}
	new Watcher(vm, updateComponent, true)
	vm._update(vm._render())
}
