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
		this.score = null
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

	expectedProgress(date) {
		// Timeless date
		date = Task.timelessDate(date, false)

		// Progress prediction functions
		const functionMap = {
			0: Task.linear,
			1: Task.slightPoly,
			2: Task.strongPoly
		}

		// Clamping Function
		const clamp = (min, val, max) => Math.max(min, Math.min(max, val))

		// Ensure start and end dates are at start of day
		this.start = Task.timelessDate(this.start)
		this.end = Task.timelessDate(this.end)

		// Calculate Timings
		const taskLength = this.end - this.start
		const taskElapsed = date - this.start
		let timePercent = clamp(0, 100*taskElapsed/taskLength, 100)
		
		// Edge cases
		if (taskLength <= 0 && taskElapsed >= 0) { // Task is 1 day or less and task has started
			timePercent = 100
		}

		return clamp(0, functionMap[Data.settings["scoreType"]](timePercent), 100)
	}

	getScore() {
		// Task complete edge case
		if (this.progress == 100) {this.score = 1000; return 1000}

		// Use existing score if possible
		if (this.score != null) return this.score

		// Get today
		const today = Task.timelessDate(new Date())

		// Edge cases
		if (today - Task.timelessDate(this.start) < 0) {this.score = 0; return 0}
		if (Data.daysBetween(this.end, today) < 0) {this.score=-1000; return -1000}

		// Calculate Deviation
		const deviation = this.progress - this.expectedProgress(today)

		// Calculate score
		this.score = deviation
		return this.score
	}

	// DOM element generation
	generateTaskCard(callback, tutorialMode=false) {
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

		if (this.progress == 100) {
			timeLeft.innerText = "Done"
		} else if (dateDeficit < 0) {
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
		window.requestAnimationFrame(() => {
			// --gray-len property is dependent on width so must be after 1 frame
			taskProgress.style.setProperty("--gray-len", -(100-this.expectedProgress(new Date()))/100*taskProgress.clientWidth + "px")
		})
		taskProgress.className = "progress"

		// Add progress bar event listener
		taskProgress.addEventListener("change", () => {
			// Exit if in tutorial
			if (tutorialMode) return

			this.progress = parseInt(taskProgress.value)
			this.flagRecomputeScore()
			Data.requestUpdate()
			callback()
		})

		// Dynamically set projected progress
		window.addEventListener("resize", (e) => {
			taskProgress.style.setProperty("--gray-len", -(100-this.expectedProgress(new Date()))/100*taskProgress.clientWidth + "px")
		})

		// Add progress bar
		taskDiv.append(taskProgress)

		// Add link clickability
		let eventName = "click"
		if (Data.settings["doubleClick"]) {
			eventName = "dblclick"
		}

		taskDiv.addEventListener(eventName, (e) => {
			// Block clicks on progress bar
			if (e.target.tagName == "INPUT") {
				return
			}

			// Open link
			if (!tutorialMode) {
				window.open(this.link, "_blank")
			} else {
				alert("Hello! You opened a link!")
			}
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
			let startValue = start.children[0].value
			let endValue = end.children[0].value
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

			if (Data.tasks.filter(x => x != task).map(x => x.name).includes(nameValue)) {
				const dummy = document.createElement("div")
				new Modal("Task names must be unique", dummy, ["Ok"], ["white"])
				return true
			}

			task.name = nameValue
			task.start = Task.timelessDate(Task.dateFromFormat(startValue, "yyyy-mm-dd"))
			task.end = Task.timelessDate(Task.dateFromFormat(endValue, "yyyy-mm-dd"))
			task.link = linkValue

			if (isNew) {
				Data.tasks.push(task)
			}

			task.flagRecomputeScore()

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
			// Update data
			Data.tasks = Data.tasks.filter((task) => task != this)
			Data.requestUpdate()

			// Update pages
			document.dispatchEvent(new Event("pageChange"))
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

	// Preprocessors
	static timelessDate(date, startOfDay=true) {
		date = new Date(date.getTime()) // make copy before changing
		if (startOfDay) {
			date.setHours(0, 0, 0, 0)
		} else {
			date.setHours(23, 59, 59, 999)
		}
		return date
	}

	// Formatters
	static formatDate(date, mode) {
		if (mode == "yyyy-mm-dd") {
			return `${date.getFullYear()}-${Task.prependZeroes(date.getMonth()+1, 2)}-${Task.prependZeroes(date.getDate(), 2)}`
		}
	}

	static dateFromFormat(string, mode) {
		if (mode == "yyyy-mm-dd") {
			const [year, month, day] = string.split("-")

			return new Date(parseInt(year), parseInt(month)-1, parseInt(day))
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
