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

		// Require completion on day before due date
		const trueEnd = new Date(this.end - 1000*60*60*24)

		// Get end of day
		const today = new Date()
		today.setHours(this.end.getHours())
		today.setMinutes(this.end.getMinutes())
		today.setSeconds(this.end.getSeconds())
		today.setMilliseconds(this.end.getMilliseconds())

		// Precomputed time constants
		const taskLength = trueEnd - this.start
		const taskElapsed = today - this.start
		const timePercent = 100*taskElapsed/taskLength

		// Edge cases
		if (taskElapsed < 0) {this.score = 0; return 0}
		if (taskElapsed > taskLength) {this.score=1000; return 1000}

		// Calculate Deviation
		const deviation = this.progress - functionMap[Data.settings["scoreType"]](timePercent)

		// Calculate score
		this.score = deviation
		return deviation
	}

	// DOM element generation
	generateTaskCard(callback) {
		// Create new panel for the task
		const taskDiv = document.createElement("div")
		taskDiv.className = "task-card glass-panel"

		// Set task name
		const taskName = document.createElement("p")
		taskName.innerText = this.name
		taskDiv.append(taskName)

		// Set days left display
		const timeLeft = document.createElement("p")
		let dateDeficit = Data.daysBetween(this.end, new Date())

		if (dateDeficit < 0) {
			timeLeft.innerText = "Overdue"
		} else if (dateDeficit == 0) {
			timeLeft.innerText = "Due Today"
		} else if (dateDeficit == 1) {
			timeLeft.innerText = "Due Tomorrow"
		} else {
			timeLeft.innerText = `${dateDeficit} days`
		}

		taskDiv.append(timeLeft)

		// Create the slider/progress bar
		const taskProgress = document.createElement("input")
		taskProgress.setAttribute("type", "range")
		taskProgress.setAttribute("min", "0")
		taskProgress.setAttribute("max", "100")
		taskProgress.setAttribute("value", this.progress)
		taskProgress.className = "progress"

		// Add progress bar event listener
		taskProgress.addEventListener("change", () => {
			this.progress = parseInt(taskProgress.value)
			this.flagRecomputeScore()
			Data.requestUpdate()
			callback()
		})

		// Add progress bar
		taskDiv.append(taskProgress)

		// Add link clickability
		taskDiv.addEventListener("click", (e) => {
			// Block clicks on progress bar
			if (e.target.tagName == "INPUT") {
				return
			}
			// Open link
			window.open(this.link, "_blank")
		})

		return taskDiv
	}

	static openEdit(task, isNew=false) {
		// Create dummy task if new
		if (!task) {
			task = new Task(["", "", "", "", 0, ""])
		}

		// Set form elements
		const name = Modal.textInput("Name", true, task.name)
		const start = Modal.dateInput("Start Date", task.start)
		const end = Modal.dateInput("Due Date", task.end)
		const link = Modal.textInput("Link (optional)", true, task.link)
		const form = Modal.sandwichForm(
			name,
			start, end,
			link
		)

		// Determine modal title
		let modalTitle
		if (isNew) {
			modalTitle = "New Task"
		} else {
			modalTitle = "Edit Task"
		}

		// Create modal
		new Modal(modalTitle, form, ["Cancel", "Save"], ["white", "green"], [() => {}, () => {
			let nameValue = name.children[0].value
			let startValue = new Date(start.children[0].value)
			let endValue = new Date(end.children[0].value)
			let linkValue = link.children[0].value
			// Validate input
			if (!(nameValue && !!startValue && !!endValue)) {
				const dummy = document.createElement("div")
				new Modal("Make sure all required fields are complete before saving", dummy, ["Ok"], ["white"])
				return true
			}

			if (endValue < startValue) {
				const dummy = document.createElement("div")
				new Modal("Due date must be after start date", dummy, ["Ok"], ["white"])
				return true
			}

			task.name = name.children[0].value
			task.start = new Date(start.children[0].value)
			task.end = new Date(end.children[0].value)
			task.link = link.children[0].value

			if (isNew) {
				Data.tasks.push(task)
			}

			Data.requestUpdate()
			document.dispatchEvent(new Event("pageChange"))
		}])
	}

	edit() {
		Task.openEdit(this)
	}

	delete() {
		const filler = document.createElement("div")
		new Modal(`Are you sure you want to delete \"${this.name}\"?`, filler, ["Keep", "Delete"], ["white", "red"], [() => {}, () => {
			Data.tasks = Data.tasks.filter((task) => task != this)
			Data.requestUpdate()
		}])
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

	// Formatters
	static formatDate(date, mode) {
		if (mode == "yyyy-mm-dd") {
			return `${date.getFullYear()}-${Task.prependZeroes(date.getMonth()+1, 2)}-${Task.prependZeroes(date.getDate(), 2)}`
		}
	}

	static prependZeroes(n, targetDigits) {
		// Prepends zeroes to n until targetDigits digits are reached
		let out = ""+n
		for (let i = 0; i < targetDigits-out.length; i++) {
			out = "0"+out
		}
		return out
	}
}
