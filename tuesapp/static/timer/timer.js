class Timer extends Page {
	static init() {
		this.pageName = "timer"
		this.pageBody = document.getElementById("timer")

		Timer.activateButtons()

		super.init()
	}

	static activateButtons() {
		const sequence = document.getElementById("sequence")
		sequence.addEventListener("click", () => {
			// TODO: Deactivate active button, activate current button, update time display
		})
	}
}