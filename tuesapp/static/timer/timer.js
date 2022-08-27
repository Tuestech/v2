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
				Timer.deactivateAllButtons()
				button.classList.add("active")
				// TODO: update time display
			})
		}
	}

	static deactivateAllButtons() {
		for (const button of Timer.sequenceButtons) {
			button.classList.remove("active")
		}
	}
}