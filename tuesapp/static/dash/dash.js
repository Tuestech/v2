class Dash extends Page {
	static onPageChange() {
		this.updateBasicInfoPanel()
		super.onPageChange()
	}

	static updateBasicInfoPanel() {
		const panel = document.getElementById("date-display")

		// Build Date String
		const now = new Date()
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		let dateString = dayNames[now.getDay()] + ", " + monthNames[now.getMonth()] + " " + now.getDate()

		document.getElementById("date-display").innerText = dateString

		// Build Progress String (TODO)

		// Build Timing String (TODO)
	}
	
	static init() {
		this.pageName = "dash"
		this.pageBody = document.getElementById("dash")
		super.init()
	}
}