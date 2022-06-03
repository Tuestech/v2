class Dash extends Page {
	static onPageChange() {
		this.updateBasicInfoPanel()
		super.onPageChange()
	}

	static updateBasicInfoPanel() {
		// Build Date String
		const now = new Date()
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		let dateString = dayNames[now.getDay()] + ", " + monthNames[now.getMonth()] + " " + now.getDate()

		document.getElementById("date-display").innerText = dateString

		// Build Progress String (TODO)

		// Build Timing String (TODO)
	}

	// pdone and pstarted are between 0 and 100
	// pstarted doesn't include tasks that are done
	static updateProgressBar(pdone, pstarted) {
		const prefix = "transform: translateX("
		document.getElementById("green-progress").setAttribute("style", prefix + pdone + "%);")
		document.getElementById("yellow-progress").setAttribute("style", prefix + (pdone + pstarted) + "%);")
	}

	// pgood and pbad are between 0 and 100
	static updateProgressBar(pgood, pbad) {
		const prefix = "transform: translateX("
		document.getElementById("green-timing").setAttribute("style", prefix + pgood + "%);")
		document.getElementById("red-timing").setAttribute("style", prefix + (pgood + pbad) + "%);")
	}
	
	static init() {
		this.pageName = "dash"
		this.pageBody = document.getElementById("dash")
		super.init()
	}
}