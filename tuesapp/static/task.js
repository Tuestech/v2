class Task {
	static keys = ["name", "time", "start", "end", "progress", "link"]
	static types = ["s", "n", "d", "d", "n", "s"]
	
	constructor(arr) {
		for (let i = 0; i < Task.keys.length; i++) {
			if (Task.types[i] != "d") {
				this[Task.keys[i]] = arr[i]
			} else {
				this[Task.keys[i]] = new Date(arr[i])
			}
		}
		this.score = null

		// Data fixing
		const intervals = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]
		if (!this.time) {
			this.time = 2
		} else if (!intervals.includes(this.time)) {
			// Find nearest time in interval and set it
			let delta = 1/0
			let best = intervals[0]

			for (const interval of intervals) {
				let newDelta = Math.abs(interval - this.time)

				if (newDelta < delta) {
					delta = newDelta
					best = interval
				} else {
					break
				}
			}

			this.time = best
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
		let deviation = this.progress - this.expectedProgress(today)

		// Weight Deviation by time needed to complete the task
		deviation *= this.time

		// Calculate score
		this.score = deviation
		return this.score
	}

	// PREPME TEMP
	isPrepme() {
		return this.name.substring(0, 10) == "~[PREPME]~"
	}

	getName() {
		if (this.isPrepme()) return this.name.substring(10)
		return this.name
	}
	// END PREPME TEMP

	// DOM element generation
	generateTaskCard(callback, tutorialMode=false) {
		// Create new panel for the task
		const taskDiv = document.createElement("div")
		taskDiv.className = "task-card glass-panel"

		// Set task name
		const taskName = document.createElement("p")
		taskName.innerText = this.getName() // PREPME TEMP
		taskDiv.append(taskName)

		// PREPME TEMP
		if (this.name.substring(0, 10) == "~[PREPME]~") {
			taskDiv.classList.add("prepme")
		}
		// END PREPME TEMP

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

			// Confetti if done
			if (this.progress == 100) {
				const rect = taskProgress.getBoundingClientRect()
				confetti({
					particleCount: 60,
					spread: 360,
					origin: {
						x: (rect.x + rect.width)/window.innerWidth,
						y: (rect.y + rect.height/2)/window.innerHeight
					},
				})
			}

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

			// Alert if no link
			if (this.link == 0) {
				const dummy = document.createElement("div")
				dummy.innerText = "Please add a link to your task."
				new Modal("There is no link to open!", dummy, ["Ok"], ["white"])
				return
			}

			// Open link
			if (!tutorialMode) {
				window.open(this.link, "_blank")
			} else {
				alert("Hello! You opened a link!")
			}
		})

		// Add hover time indicator
		const hoverTime = document.createElement("div")
		hoverTime.classList.add("hover-time")

		const hoverTimeMapping = {
			0.5: [0, 0.5],
			1: [0, 0.5, 1],
			1.5: [0, 0.5, 1, 1.5],
			2: [0, 0.5, 1, 1.5, 2],
			2.5: [0, 0.5, 1, 1.5, 2, 2.5],
			3: [0, 1, 2, 3],
			4: [0, 1, 2, 3, 4],
			5: [0, 1, 2, 3, 4, 5],
			6: [0, 2, 4, 6],
			8: [0, 2, 4, 6, 8],
			10: [0, 2, 4, 6, 8, 10],
			12: [0, 3, 6, 9, 12],
			15: [0, 5, 10, 15],
			20: [0, 5, 10, 15, 20],
			25: [0, 5, 10, 15, 20, 25]
		}

		const times = hoverTimeMapping[this.time]

		for (const time of times) {
			const el = document.createElement("p")
			el.innerText = Modal.addHours(time)

			hoverTime.append(el)
		}

		taskDiv.append(hoverTime)

		return taskDiv
	}

	static openEdit(task, isNew=false) {
		// Create dummy task if new
		if (!task) {
			task = new Task(["", 2, "", "", 0, ""])
		}

		// Set hours intervals
		const intervals = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]

		// Set form elements
		const name = Modal.textInput("Name", true, task.getName()) // PREPME TEMP
		const start = Modal.dateInput("Start Date", task.start)
		const end = Modal.dateInput("Due Date", task.end)
		const hours = Modal.sliderInput("Hours Needed", intervals, task.time)
		const link = Modal.textInput("Link (optional)", true, task.link)

		// PREPME TEMP
		// Disable name change for prepme tasks
		if (task.isPrepme()) {
			name.children[0].disabled = true
			name.children[1].innerText = "Name (locked)"
		}
		// PREPME TEMP END

		const form = Modal.sandwichForm(
			name,
			start, end,
			hours,
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
			let hoursValue = hours.children[3].value
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

			// PREPME TEMP
			if (task.isPrepme()) {
				nameValue = `~[PREPME]~${nameValue}`
			}
			// END PREPME TEMP

			task.name = nameValue
			task.start = Task.timelessDate(Task.dateFromFormat(startValue, "yyyy-mm-dd"))
			task.end = Task.timelessDate(Task.dateFromFormat(endValue, "yyyy-mm-dd"))
			task.time = intervals[Math.round(hoursValue)]
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
		
		// PREPME TEMP
		if (this.isPrepme() && this.progress != 100) {
			new Modal(`You haven't finished this important task yet! Force delete anyways?`, filler, ["Keep", "Delete"], ["white", "red"], [() => {}, () => {
				// Update data
				Data.tasks = Data.tasks.filter((task) => task != this)
				Data.requestUpdate()

				// Update pages
				document.dispatchEvent(new Event("pageChange"))
			}])
			return
		}
		// END PREPME TEMP

		new Modal(`Are you sure you want to delete \"${this.getName()}\"?`, filler, ["Keep", "Delete"], ["white", "red"], [() => {}, () => { // PREPME TEMP
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
