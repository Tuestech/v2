class Schedule extends Page {
	static init() {
		this.pageName = "schedule"
		this.pageBody = document.getElementById("schedule")
		super.init()
	}

	static onPageChange() {
		super.onPageChange()
		let testX = [1, 2, 3, 4, 5]
		let testY = [0.2, 0.8, 0.5, 0.6, 0.1]
		this.graph(testX, testY, [false, true, false, false, false])
	}

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