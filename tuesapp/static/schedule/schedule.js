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
			taskDiv.innerText = task.getName() // PREPME TEMP
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
		const originalY = Data.calculateWorkload(10)

		// Apply normalizer function to y
		const normalizer = (x) => -1*Math.E**(x*Math.log(0.2)/parseFloat(Data.settings["workloadLimit"]))+1
		const y = originalY.map(normalizer)

		// Generate Warnings
		let warnings = []
		for (const yValue of originalY) {
			warnings.push(yValue > 100*parseFloat(Data.settings["workloadLimit"]))
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

		// Elements
		const parent = document.getElementById("s-graph-container")
		const svg = document.getElementById("svg")
		const pathElement = document.getElementById("path")

		// Get properties
		const pathWidth = parseInt(pathElement.getAttribute("stroke-width").replace("px", ""))

		// Warning constants
		const warningSize = 25

		// Resize observer
		let xScale = parent.offsetWidth - 2 * pathWidth
		let yScale = parent.offsetHeight - 2 * pathWidth - warningSize - 10

		const resizeObserver = new ResizeObserver((entries) => {
			xScale = entries[0].target.offsetWidth - 2 * pathWidth
			yScale = entries[0].target.offsetHeight - 2 * pathWidth - warningSize - 10

			Schedule.setSVGDims(svg, entries[0].target)
			Schedule.updatePath(x, y, xScale, yScale, pathElement, pathWidth, warningSize)
			Schedule.updateWarnings(x, y, xScale, yScale, svg, pathWidth, warningSize)
		})

		// Normalize all x-values on [0, 1]
		const xMin = Math.min(...x)
		const xMax = Math.max(...x)

		for (let i = 0; i < x.length; i++) {
			x[i] = (x[i] - xMin)/(xMax - xMin)
		}

		resizeObserver.observe(parent)

		// Update path
		Schedule.setSVGDims(svg, parent)
		Schedule.updatePath(x, y, xScale, yScale, pathElement, pathWidth, warningSize)
		Schedule.updateWarnings(x, y, xScale, yScale, svg, pathWidth, warningSize)
	}

	static updatePath(x, y, xScale, yScale, pathElement, padding, warningSize) {
		// Scale and pad x; scale, pad, and invert y
		x = x.map(x_ => x_*xScale + padding)
		y = y.map(y_ => (1-y_)*yScale + padding + warningSize + 10)

		// Find path starting point
		let path = `M ${x[0]} ${y[0]} `
		const xIncrement = xScale/(x.length - 1)/2

		for (let i = 1; i < x.length; i++) {
			const controlX = x[i] - xIncrement
			path += `C ${controlX} ${y[i-1]}, ${controlX} ${y[i]}, ${x[i]} ${y[i]} `
		}

		pathElement.setAttribute("d", path)
	}

	static updateWarnings(x, y, xScale, yScale, svgElement, padding, warningSize) {
		// Remove all existing warnings
		const warnings = Array.from(document.getElementsByClassName("warning-image"))
		warnings.map(warning => warning.remove())

		// Find the coordinates of points that require warning
		let warnX = []
		let warnY = []
		for (let i = 0; i < x.length; i++) {
			if (y[i] > 0.8) {
				warnX.push(x[i])
				warnY.push(y[i])
			}
		}

		// minmax
		const minmax = (n, min_, max_) => Math.min(max_, Math.max(min_, n))

		// Transform warning coordinates to be image coordinates
		warnX = warnX.map(x_ => minmax(x_*xScale + padding - warningSize/2, 0, xScale - warningSize))
		warnY = warnY.map(y_ => (1-y_)*yScale + padding)

		// Add warning images to transformed coordinates
		const xmlns = "http://www.w3.org/2000/svg"
		const imgUrl = "/static/icons/Warning.png"
		for (let i = 0; i < warnX.length; i++) {
			const warningImage = document.createElementNS(xmlns, "image")

			warningImage.setAttribute("href", imgUrl)
			warningImage.setAttributeNS(xmlns, "xlink:href", imgUrl)

			warningImage.setAttribute("x", warnX[i])
			warningImage.setAttribute("y", warnY[i])
			warningImage.setAttribute("width", warningSize)
			warningImage.setAttribute("height", warningSize)

			warningImage.classList.add("warning-image")

			svgElement.append(warningImage)
		}
	}
}