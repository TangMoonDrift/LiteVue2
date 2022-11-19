import newArrayProto from './array.js'
import Dep from './dep.js'

const proxy = (target) => {
	if (Array.isArray(target)) {
		return observeArray(target)
	}
	return observe(target)
}

export function observe(target) {
	if (typeof target !== 'object' || target === null) return target
	if (!target.__ob__) {
		Object.defineProperty(target, '__ob__', {
			value: observe,
			enumerable: false,
		})
		Object.keys(target).forEach(key => {
			let value = target[key]
			proxy(value)
			let dep = new Dep()
			Object.defineProperty(target, key, {
				enumerable: true,
				configurable: true,
				get() {
					// console.log('getter')
					if (Dep.target) {
						dep.depend()
					}
					return value
				},
				set(newValue) {
					// console.log('setter')
					if (newValue !== value) {
						newValue = proxy(newValue)
						// console.log(newValue)
						value = newValue
						dep.notify()
					}
				}
			})
		})
		return target
	} else {
		return target
	}
}

export function observeArray(array) {
	if (!Array.isArray(array)) {
		return array
	}
	Object.setPrototypeOf(array, newArrayProto)
	// debugger
	return array.forEach(item => observe(item))
}

export default proxy
