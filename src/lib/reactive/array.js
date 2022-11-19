const arrayProto = Array.prototype
const newArrayProto = Object.create(arrayProto)
const effectMethods = [
	'push',
	'pop',
	'shift',
	'unshift',
	'reverse',
	'sort',
	'splice'
]

effectMethods.forEach(method => {
	newArrayProto[method] = function (...args) {
		// console.log('method: ', method)
		// debugger
		let inserted
		switch (method) {
			case 'push':
			case 'unshift':
				inserted = args
				break
			case 'splice':
				inserted = args.slice(2)
				break
			default:
				break
		}
		inserted.forEach(item => {
			if (item.__ob__) {
				item.__ob__(item)
			}
		})
		return arrayProto[method].call(this, ...args)
	}
})

export default newArrayProto
