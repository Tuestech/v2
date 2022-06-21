class Task {
	constructor(name, course, start, end, progress) {
		this.course = course
		this.name = name
		this.start = start
		this.end = end
		this.progress = progress
	}

	getScore() {
		if (!this.score) {
			// TODO: implement scoring algorithm

			this.score = 100
		}
		return this.score
	}
}
