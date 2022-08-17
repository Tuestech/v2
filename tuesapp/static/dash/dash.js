class Dash extends Page {
	static onPageChange() {
		// Row 1
		this.updateBasicInfoPanel()
		this.updateProgressBar()
		this.updateTimingBar()

		// Row 2
		this.updateCurrentTasks()
		this.updateUpcoming()

		// Row 3
		this.updateLinks()

		// Update page visibility
		super.onPageChange()
	}

	static updateBasicInfoPanel() {
		// Set constants
		const now = new Date()
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

		// Build date string
		let dateString = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`

		document.getElementById("date-display").innerText = dateString

		// Build Complete String
		let numDone = 0
		for (const task of Data.tasks) {
			if (task.progress == 0) {
				numDone++
			}
		}
		const pDone = Math.floor(100 * numDone / Data.tasks.length)

		document.getElementById("p-complete").innerText = `${pDone}% Complete`

		// Build On Track String
		let numOnTrack = 0
		for (const task of Data.tasks) {
			if (task.getScore() >= 0) {
				numOnTrack++
			}
		}
		const pOnTrack = Math.floor(100 * numOnTrack / Data.tasks.length)

		document.getElementById("p-on-track").innerText = `${pOnTrack}% On Track`
	}

	static updateProgressBar() {
		// Aggregate progress across all tasks and count done
		let doneProgress = 0
		let totalProgress = 0
		for (const task of Data.tasks) {
			if (task.progress == 100) {
				doneProgress += 100
			}
			totalProgress += task.progress
		}

		// Calculate percentages [0-100]
		const pDone = doneProgress/Data.tasks.length
		const pStarted = totalProgress/Data.tasks.length

		// Update display
		document.getElementById("green-progress").setAttribute("style", `transform: translateX(${pDone}%);`)
		document.getElementById("yellow-progress").setAttribute("style", `transform: translateX(${pStarted}%);`)
	}

	static updateTimingBar() {
		// Count good and bad tasks
		let numGood = 0
		let numBad = 0
		for (const task of Data.tasks) {
			if (task.getScore() < 0) {
				numBad++
			} else if (task.getScore() > 0) {
				numGood++
			}
		}

		// Calculate percentages [0-100]
		const pGood = 100 * numGood / Data.tasks.length
		const pBad = 100 * numBad / Data.tasks.length

		// Update display
		document.getElementById("green-timing").setAttribute("style", `transform: translateX(${pGood}%);`)
		document.getElementById("red-timing").setAttribute("style", `transform: translateX(${pGood + pBad}%);`)
	}

	static updateCurrentTasks() {
		const currentTasks = document.getElementById("current-tasks")

		// Prevents duplicate tasks
		Page.clearChildren(currentTasks, 1)

		for (const task of Data.tasks) {
			currentTasks.append(task.generateTaskCard(Dash.updateProgressBar()))
		}
	}

	static updateUpcoming() {
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		
		// Set day name headers
		let idIndex = 1
		for (let i = new Date().getDay(); i < new Date().getDay() + 5; i++) {
			document.getElementById(`day-label-${idIndex}`).innerText = dayNames[i]
			idIndex += 1
		}

		// Add tasks
		let currDate = new Date()
		for (let i = 1; i <= 5; i++) {
			const dayDiv = document.getElementById(`day-${i}`)

			// Prevents duplicate tasks
			Page.clearChildren(dayDiv)
			for (const task of Data.tasks) {
				// Creates element if the due date matches the date of the calendar
				if (task.end.toDateString() == currDate.toDateString()) {
					// Create the container element
					const taskDiv = document.createElement("div")
					taskDiv.className = "glass-panel"

					// Create the task name
					const textP = document.createElement("p")
					textP.innerText = `${task.name} Due`
					taskDiv.append(textP)

					// Add task to the page
					dayDiv.append(taskDiv)
				}
			}
			currDate.setDate(currDate.getDate() + 1)
		}
	}

	static updateLinks() {
		const links = document.getElementById("links")

		Page.clearChildren(links, 0, 1)

		const defaultWebIcon = "/static/icons/Web Icon.png"

		for (const link of Data.links) {
			// Container
			const container = document.createElement("div")
			container.className = "glass-panel link button"

			// Icon
			const img = document.createElement("img")

			// TODO: Dynamic icons to match certain favicons
			img.setAttribute("src", defaultWebIcon)
			container.append(img)

			// Label
			const label = document.createElement("p")
			label.innerText = link[0]
			container.append(label)

			// Link function
			container.addEventListener("click", () => {
				// TODO: Make safety function to prevent javascript running
				window.open(link[1], "_blank", "noreferrer")
			})

			// Prepend container to the document
			links.prepend(container)
		}
	}
	
	static init() {
		this.pageName = "dash"
		this.pageBody = document.getElementById("dash")
		super.init()
	}
}