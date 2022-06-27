class Task {
	static keys = ["name", "course", "start", "end", "progress", "link"]
	constructor(arr) {
		for (let i = 0; i < Task.keys.length; i++) {
			this[Task.keys[i]] = arr[i]
		}
	}

	static toArray(task) {
		let out = []
		for (const key of keys) {
			out.push(task[key])
		}
		return out
	}

	getScore() {
		if (!this.score) {
			// TODO: implement scoring algorithm

			this.score = 100
		}
		return this.score
	}
}
