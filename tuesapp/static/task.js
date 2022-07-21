class Task {
	static keys = ["name", "course", "start", "end", "progress", "link"]
	static types = ["s", "s", "d", "d", "n", "s"]
	
	constructor(arr) {
		for (let i = 0; i < Task.keys.length; i++) {
			if (Task.types[i] != "d") {
				this[Task.keys[i]] = arr[i]
			} else {
				this[Task.keys[i]] = new Date(arr[i])
			}
		}
	}

	toArray() {
		let out = []
		for (const key of Task.keys) {
			out.push(this[key])
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

	getSafeLink() {
		// Replace with more robust solution
		if (this.link.substring(0, 4) != "http") {
			this.link = "https://" + this.link
		}
		return this.link
	}
}
