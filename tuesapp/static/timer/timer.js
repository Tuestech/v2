class Timer extends Page {
	static sequenceButtons = Array.from(document.getElementById("sequence").getElementsByClassName("button"))
	static stop = () => {}
	static toggle = () => {}

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

				Timer.stop()

				let [stop, toggle] = Timer.createTimer(parseInt(button.children[1].innerText.replace(" mins", "")))

				Timer.stop = stop
				Timer.toggle = toggle
			})
		}
		
		document.getElementById("play").addEventListener("click", () => {
			console.log("a")
			Timer.toggle()
		})
	}

	static deactivateAllButtons() {
		for (const button of Timer.sequenceButtons) {
			button.classList.remove("active")
		}
	}

	static createTimer(timerMinutes, callback) {
		// Set constants
		let init = new Date().getTime()
		const MINUTE = 1000 * 60
		let target = init + timerMinutes * MINUTE

		const intervalFunc = () => {
			const now = new Date().getTime()

			// Stop running if the timer is done
			if (target < now) {
				document.getElementById("time").innerText = "0:00"
				clearInterval(interval)
				callback()
				return
			}

			// Calculate numbers for timer
			let minutes = Math.floor((target - now) / MINUTE)
			let seconds = Math.floor((target - now) % MINUTE / 1000)

			// Ensure seconds are always 2 digits
			if (seconds < 10) {
				seconds = "0" + seconds
			}

			// Create the displayed time string
			const newString = `${minutes}:${seconds}`

			// Stop execution if the desired string is already present
			if (document.getElementById("time").innerText == newString) return

			// Update the displayed time
			document.getElementById("time").innerText = newString
		}

		let interval = setInterval(intervalFunc, 100)

		// Create control functions
		let timeLeft = target - init
		let paused = false

		const stop = () => {
			clearInterval(interval)
		}

		const pause = () => {
			clearInterval(interval)
			timeLeft = target - new Date().getTime()
		}

		const play = () => {
			init = new Date().getTime()
			target = init + timeLeft
			interval = setInterval(intervalFunc, 100)
		}

		const toggle = () => {
			if (paused) {
				play()
			} else {
				pause()
			}
			paused = !paused
		}

		return [stop, toggle]
	}
}