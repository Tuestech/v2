// State
let startTime = Date.now()
let pauseStartTime = Date.now()
let timeLength = 25 * 60 * 1000 // 25 minutes
let currentDisplay = "25:00"
let paused = true
let intervalId

// Handle messages
self.addEventListener("message", function(e) {
  if (e.data == "toggle") {
		if (paused) {
			unpause()
		} else {
			pause()
		}
  } else if (e.data == "stop") {
    clearInterval(timerId)
  } else {
		startTime = Date.now()
		timeLength = parseInt(e.data) * 60 *1000

		if (paused) {
			pauseStartTime = Date.now()
			unpause()
		}
	}
})

// Handlers
function intervalHandler() {
	// Calculate time left
	const timeLeft = timeLength - (Date.now() - startTime)

	// Move to next in sequence if time is up
	if (timeLeft < 0) {
		self.postMessage("next")
		return
	}

	// Calculate displayed time
	const minutesLeft = Math.floor(timeLeft/(60 * 1000))
	const secondsLeft = Math.floor(timeLeft/1000) % 60
	const newDisplay = `${padNumber(minutesLeft)}:${padNumber(secondsLeft)}`

	// Update UI if needed
	if (newDisplay != currentDisplay) {
		self.postMessage(newDisplay)
		currentDisplay = newDisplay
	}
}

function unpause() {
	startTime = Date.now() - (pauseStartTime - startTime)
	intervalId = setInterval(intervalHandler, 100)

	paused = false
}

function pause() {
	clearInterval(intervalId)
	pauseStartTime = Date.now()

	paused = true
}

// Calculations
function padNumber(n) {
	if (n < 10) {
		return "0"+n
	}
	return ""+n
}
