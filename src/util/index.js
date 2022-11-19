export const deepClone = (origin) => {
	if (origin === null || typeof origin !== 'object') {
		return origin
	}
	if (!deepClone.cache) {
		deepClone.cache = new WeakMap()
	}
	if (deepClone.cache.has(origin)) {
		return deepClone.cache.get(origin)
	}

	if (origin instanceof Set) {
		let temp = new Set()
		origin.forEach(item => {
			temp.add(deepClone(item))
		})
		deepClone.cache.set(origin, temp)
		return temp
	} else if (origin instanceof Map) {
		let temp = new Map()
		origin.forEach((key, val) => {
			temp.set(deepClone(key), deepClone(val))
		} )
		deepClone.cache.set(origin, temp)
		return temp
	} else if (origin instanceof RegExp) {
		const temp = new RegExp(origin)
		deepClone.cache.set(origin, temp)
		return temp
	} else {
		const result = new origin.constructor()
		for (let key in origin) {
			result[key] = deepClone(origin[key])
		}
		deepClone.cache.set(origin, result)
		return result
	}
}
