class Dash extends Page {
	static onPageChange() {
		// Row 1
		this.updateBasicInfoPanel()
		this.updateProgressBar()
		this.updateTimingBar()

		// Row 2
		

		// Update page visibility
		super.onPageChange()
	}

	static updateBasicInfoPanel() {
		// Build Date String
		const now = new Date()
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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

		// Build On Track String (TODO)
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
		let doneProgress = 0
		let totalProgress = 0
		for (const task of Data.tasks) {
			if (task.progress == 100) {
				doneProgress += 100
			}
			totalProgress += task.progress
		}

		const pDone = doneProgress/Data.tasks.length
		const pStarted = totalProgress/Data.tasks.length

		document.getElementById("green-progress").setAttribute("style", `transform: translateX(${pDone}%);`)
		document.getElementById("yellow-progress").setAttribute("style", `transform: translateX(${pDone +pStarted}%);`)
	}

	static updateTimingBar() {
		let numGood = 0
		let numBad = 0
		for (const task of Data.tasks) {
			if (task.getScore() < 0) {
				numBad++
			} else if (task.getScore() > 0) {
				numGood++
			}
		}

		const pGood = 100 * numGood / Data.tasks.length
		const pBad = 100 * numBad / Data.tasks.length

		document.getElementById("green-timing").setAttribute("style", `transform: translateX(${pGood}%);`)
		document.getElementById("red-timing").setAttribute("style", `transform: translateX(${pGood + pBad}%);`)
	}
	
	static init() {
		this.pageName = "dash"
		this.pageBody = document.getElementById("dash")
		super.init()
	}
}