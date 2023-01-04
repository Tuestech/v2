class Schedule extends Page {
	static init() {
		this.pageName = "schedule"
		this.pageBody = document.getElementById("schedule")
		super.init()
	}

	static onPageChange() {
		// Timeline
		this.setTimelineDays()
		this.setTimelineTasks()

		// Workload
		this.updateWorkload()

		super.onPageChange()
	}

	// Timeline
	static setTimelineDays() {
		// Setup
		const dayNameDiv = document.getElementById("timeline-day-names")
		Page.clearChildren(dayNameDiv)

		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		const today = new Date().getDay()

		// Set day names
		for (let i = today; i < today + 10; i++) {
			const day = document.createElement("p")
			day.innerText = dayNames[i % 7]
			day.setAttribute("style", `grid-area: a${i+1-today};`)

			dayNameDiv.append(day)
		}
	}

	static setTimelineTasks() {
		// Setup
		const timeline = document.getElementById("timeline")
		Page.clearChildren(timeline, 1)

		// Calculate tasks that can be displayed
		const prioritized = Data.getPrioritized(true)
		const filtered = prioritized.filter(task => Data.daysBetween(task.start, new Date()) < 10)

		// No tasks in range behavior
		if (filtered.length == 0) {		
			const p = document.createElement("p")
			p.innerText = "Nothing to see here!"
			timeline.append(p)
			return
		}

		// Add tasks
		for (const task of filtered) {
			// Create row
			const row = document.createElement("div")
			row.classList.add("row")

			// Create task
			const taskDiv = document.createElement("div")
			taskDiv.classList.add("glass-panel")
			taskDiv.innerText = task.name
			taskDiv.setAttribute("style", "grid-area: b;")

			// Calculate task div positioning
			let startIndex = Math.max(-1, Data.daysBetween(task.start, new Date()))
			let endIndex = Math.min(10, Data.daysBetween(task.end, new Date()))

			// Handle overdue tasks
			if (endIndex < 0) {
				endIndex = 0
				taskDiv.classList.add("overdue")
			}

			// Generate grid-template-areas property for row
			let gridAreas = ""
			for (let i = -1; i <= 10; i++) {
				if (i < startIndex) {
					gridAreas += "a "
				} else if (i <= endIndex) {
					gridAreas += "b "
				} else {
					gridAreas += "c "
				}
			}

			row.setAttribute("style", `grid-template-areas: "${gridAreas}";`)

			// Ensure task name is visible and centered
			if (startIndex == -1) {
				taskDiv.setAttribute("style", taskDiv.getAttribute("style")+`padding-left: ${100/(endIndex-startIndex+1)}%;`)
			}
			if (endIndex == 10) {
				taskDiv.setAttribute("style", taskDiv.getAttribute("style")+`padding-right: ${100/(endIndex-startIndex+1)}%;`)
			}

			row.append(taskDiv)
			timeline.append(row)
		}
	}

	// Workload
	static updateWorkload() {
		// Generate x
		let x = []
		for (let i = 1; i <= 10; i++) {
			x.push(i)
		}

		// Calculate y
		let y = Data.calculateWorkload(10)

		// Apply normalizer function to y
		const normalizer = (x) => -1*Math.E**(-1*(x/(30 * parseFloat(Data.settings["workloadLimit"]))))+1
		y = y.map(normalizer)

		// TODO: Generate Warnings
		let warnings = []
		for (const a of x) {
			warnings.push(false)
		}

		Schedule.graph(x, y, warnings)
	}

	// Graphing
	static setSVGDims(svg, parent) {
		const width = parent.offsetWidth
		const height = parent.offsetHeight

		svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
	}
	
	static graph(x, y, w) {
		// x, y, and w must be the same length
		// y must be on [0, 1]
		// w is an array of booleans corresponding to points that indicate if a warning is needed

		// TODO: implement warnings

		// Elements
		const parent = document.getElementById("s-graph-container")
		const svg = document.getElementById("svg")
		const pathElement = document.getElementById("path")

		// Get properties
		const pathWidth = parseInt(pathElement.getAttribute("stroke-width").replace("px", ""))

		// Resize observer
		let xScale = parent.offsetWidth - 2 * pathWidth
		let yScale = parent.offsetHeight - 2 * pathWidth

		const resizeObserver = new ResizeObserver((entries) => {
			xScale = entries[0].target.offsetWidth - 2 * pathWidth
			yScale = entries[0].target.offsetHeight - 2 * pathWidth

			Schedule.setSVGDims(svg, entries[0].target)
			Schedule.updatePath(x, y, xScale, yScale, pathElement, pathWidth)
		})

		resizeObserver.observe(parent)

		// Normalize all x-values on [0, 1]
		const xMin = Math.min(...x)
		const xMax = Math.max(...x)

		for (let i = 0; i < x.length; i++) {
			x[i] = (x[i] - xMin)/(xMax - xMin)
		}

		// Update path
		Schedule.setSVGDims(svg, parent)
		Schedule.updatePath(x, y, xScale, yScale, pathElement, pathWidth)
	}

	static updatePath(x, y, xScale, yScale, pathElement, padding) {
		// Generate path
		let path = `M ${x[0] + padding} ${(1 - y[0]) * yScale} `
		const xIncrement = 1/(x.length - 1)/2

		for (let i = 1; i < x.length; i++) {
			const controlX = (x[i] - xIncrement) * xScale
			path += Schedule.generatePath(controlX, y[i-1]*yScale, controlX, y[i]*yScale, x[i]*xScale, y[i]*yScale, yScale, padding)
		}

		pathElement.setAttribute("d", path)
	}

	static generatePath(xc1, yc1, xc2, yc2, x, y, height, padding) {
		return `C ${xc1 + padding} ${height - yc1 - padding}, ${xc2 + padding} ${height - yc2 - padding}, ${x + padding} ${height - y - padding} `
	}
}