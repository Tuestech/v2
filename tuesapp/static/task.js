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

	flagRecomputeScore() {
		this.score = null
	}

	getScore() {
		// Use existing score if possible
		if (this.score != null) return this.score

		// Progress prediction functions
		const functionMap = {
			0: Task.linear,
			1: Task.slightPoly,
			2: Task.strongPoly
		}

		// Precomputed time constants
		const taskLength = this.end - this.start
		const taskElapsed = new Date() - this.start
		const timePercent = 100*taskElapsed/taskLength

		// Edge cases
		if (taskElapsed < 0) return 0
		if (taskElapsed > taskLength) return 1000

		// Score calculation
		const deviation = this.progress - functionMap[Data.settings["scoreType"]](timePercent)
		this.score = -1 * deviation
		return this.score
	}

	getSafeLink() {
		// Replace with more robust solution
		if (this.link.substring(0, 4) != "http") {
			this.link = "https://" + this.link
		}
		return this.link
	}

	// Task progress prediction functions
	static linear(t) {
		return t
	}

	static slightPoly(t) {
		return 100*(-800*(t**(0.973188)) + 803.876*(t**(0.972444)))/99.5594227405
	}

	static strongPoly(t) {
		return 100*(-800*(t**(0.748301)) + 812.105*(t**(0.7459)))/99.6199552061
	}
}
