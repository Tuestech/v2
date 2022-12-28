class Timer extends Page {
	static pauseImgPath = "/static/icons/Pause%20Icon.png"
	static playImgPath = "/static/icons/Play%20Icon.png"
	static sequenceButtons = Array.from(document.getElementById("sequence").getElementsByClassName("button"))
	static sequenceState = 0
	static worker

	static init() {
		// Setup variables
		this.pageName = "timer"
		this.pageBody = document.getElementById("timer")

		// Set up worker
		Timer.worker = new Worker("../static/timer/timer-worker.js")

		// Stop worker when page is closed
		window.addEventListener("beforeunload", function() {
			Timer.worker.postMessage("stop")
			Timer.worker.terminate()
		})

		// Handle messages from worker
		Timer.worker.addEventListener("message", function(e) {
			if (e.data == "next") {
				Timer.nextSequence()
			} else {
				Timer.updateDisplay(e.data)
			}
		})

		// Add basic navigation button functionality
		const backButton = document.getElementById("back")
		const playButton = document.getElementById("play")
		const forwardButton = document.getElementById("fast-forward")

		backButton.addEventListener("click", () => {Timer.previousSequence()})
		playButton.addEventListener("click", () => {Timer.toggle()})
		forwardButton.addEventListener("click", () => {Timer.nextSequence()})

		// Add sequence button functionality
		for (let i = 0; i < Timer.sequenceButtons.length; i++) {
			const button = Timer.sequenceButtons[i]

			// Get time on sequence button
			const time = button.children[1].innerText.replace(" mins", "")

			// Add sequence button functionality
			button.addEventListener("click", () => {
				// Deactivate all buttons
				for (const otherButton of Timer.sequenceButtons) {
					otherButton.classList.remove("active")
				}

				// Activate clicked button
				button.classList.add("active")

				// Update state
				Timer.sequenceState = i

				// Update worker
				Timer.worker.postMessage(""+time)
			})
		}

		// Complete page
		super.init()
	}

	static mod(a, b) {
		return ((a % b) + b) % b
	}

	static toggle() {
		const buttonImg = document.getElementById("play").children[0]
		const currentSrc = buttonImg.getAttribute("src")
		if (currentSrc == Timer.pauseImgPath) {
			buttonImg.setAttribute("src", Timer.playImgPath)
		} else {
			buttonImg.setAttribute("src", Timer.pauseImgPath)
		}

		Timer.worker.postMessage("toggle")
	}

	static previousSequence() {
		Timer.sequenceState = Timer.mod(Timer.sequenceState - 1, Timer.sequenceButtons.length)
		Timer.sequenceButtons[Timer.sequenceState].click()

		document.getElementById("play").children[0].setAttribute("src", Timer.pauseImgPath)
	}

	static nextSequence() {
		Timer.sequenceState = Timer.mod(Timer.sequenceState + 1, Timer.sequenceButtons.length)
		Timer.sequenceButtons[Timer.sequenceState].click()

		document.getElementById("play").children[0].setAttribute("src", Timer.pauseImgPath)
	}

	static updateDisplay(time) {
		document.getElementById("time").innerText = time
	}
}