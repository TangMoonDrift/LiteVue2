let id = 0

class Dep {
	constructor() {
		this.id = id ++
		this.subs = new Set()
	}

	depend() {
		// this.subs.add(Dep.target)
		Dep.target.addDeps(this)
	}

	addSub(watcher) {
		this.subs.add(watcher)
	}

	notify() {
		this.subs.forEach(watcher => {
			watcher.update()
		})
	}
}

Dep.target = null

export default Dep
