class Timer extends Page {
	static sequenceButtons = Array.from(document.getElementById("sequence").getElementsByClassName("button"))

	static init() {
		this.pageName = "timer"
		this.pageBody = document.getElementById("timer")

		Timer.activateButtons()

		super.init()
	}

	static activateButtons() {
		for (const button of Timer.sequenceButtons) {
			button.addEventListener("click", () => {
				// TODO: Deactivate active button, activate current button, update time display
			})
		}
	}
}