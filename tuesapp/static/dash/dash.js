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

		// Functionalize buttons
		this.functionalizeButtons()

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
			if (task.progress == 100) {
				numDone++
			}
		}
		let pDone = Math.floor(100 * numDone / Data.tasks.length)

		// Hardcode no tasks behavior
		if (Data.tasks.length == 0) {
			pDone = 100
		}

		document.getElementById("p-complete").innerText = `${pDone}% Complete`

		// Build On Track String
		let numOnTrack = 0
		for (const task of Data.tasks) {
			if (task.getScore() >= 0) {
				numOnTrack++
			}
		}
		let pOnTrack = Math.floor(100 * numOnTrack / Data.tasks.length)

		// Hardcode no tasks behavior
		if (Data.tasks.length == 0) {
			pOnTrack = 100
		}

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
		let pDone = doneProgress/Data.tasks.length
		let pStarted = totalProgress/Data.tasks.length

		// Hardcode no tasks behavior
		if (Data.tasks.length == 0) {
			pDone = 100
			pStarted = 100
		}

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
		let pGood = 100 * numGood / Data.tasks.length
		let pBad = 100 * numBad / Data.tasks.length

		// Hardcode no tasks behavior
		if (Data.tasks.length == 0) {
			pGood = 100
			pBad = 0
		}

		// Update display
		document.getElementById("green-timing").setAttribute("style", `transform: translateX(${pGood}%);`)
		document.getElementById("red-timing").setAttribute("style", `transform: translateX(${pGood + pBad}%);`)
	}

	static updateCurrentTasks() {
		const currentTasks = document.getElementById("current-tasks")
		const originalNameTopMap = Object.fromEntries(Array.from(currentTasks.children).slice(1, ).map(x => [x.children[0].innerText, x.getBoundingClientRect().top]))

		// Prevents duplicate tasks
		Page.clearChildren(currentTasks, 1)

		// Prioritize tasks
		const prioritized = Data.getPrioritized(false)

		// No tasks behavior
		if (prioritized.length == 0) {
			const p = document.createElement("p")
			p.innerText = "Nothing to do!"
			currentTasks.append(p)
			return
		}

		// Create task cards
		for (const task of prioritized) {
			const taskCard = task.generateTaskCard(() => {
				Dash.updateBasicInfoPanel()
				Dash.updateProgressBar()
				Dash.updateTimingBar()
				Dash.updateCurrentTasks()
			})
			currentTasks.append(taskCard)
		}

		// Calculate new mappings
		const newNameTopMap = Object.fromEntries(Array.from(currentTasks.children).slice(1, ).map(x => [x.children[0].innerText, x.getBoundingClientRect().top]))

		const newNameDivMap = Object.fromEntries(Array.from(currentTasks.children).slice(1, ).map(x => [x.children[0].innerText, x]))

		// If tasks are the same but are in a different order
		const originalNames = Object.keys(originalNameTopMap)
		const newNames = Object.keys(newNameTopMap)
		if ((originalNames.join("") != newNames.join("")) && (originalNames.sort().join("") == newNames.sort().join(""))) {
			for (let i = 0; i < prioritized.length; i++) {
				// Temp variables
				const name = newNames[i]

				// Calculate delta
				const topDelta = originalNameTopMap[name] - newNameTopMap[name]

				// Don't animate cards that don't move
				if (topDelta == 0) continue

				// Define animation
				const animation = [
					{transform: `translateY(${topDelta}px)`},
					{transform: "translateY(0px)"}
				]
				const timing = {
					duration: 300,
					interations: 1
				}

				// Apply animation
				newNameDivMap[name].animate(animation, timing)
			}
		}
	}

	static updateUpcoming() {
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		
		// No tasks behavior
		if (Data.tasks.length == 0) {
			const panel = document.getElementById("events-and-due-dates")
			Page.clearChildren(panel, 1)
			
			const p = document.createElement("p")
			p.innerText = "Nothing to do!"
			panel.append(p)
			return
		}

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

		if (Data.links.length == 0) {
			const p = document.createElement("p")
			p.innerText = "No links yet..."
			links.prepend(p)
		}

		for (let i = 0; i < Data.links.length; i++) {
			// Temp variable
			const link = Data.links[i]

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
				window.open(link[1], "_blank", "noreferrer")
			})

			// X
			const x = document.createElement("div")
			x.className = "x"

			x.addEventListener("click", (e) => {
				e.stopPropagation()
				Data.links = Data.links.filter((list) => list != link)
				Data.requestUpdate()
				Dash.updateLinks()
			})

			container.append(x)

			// Prepend container to the document
			links.prepend(container)
		}
	}

	static functionalizeButtons() {
		document.getElementById("new-link").addEventListener("click", Data.newLink)
	}
	
	static init() {
		// Set properties
		this.pageName = "dash"
		this.pageBody = document.getElementById("dash")

		super.init()
	}
}