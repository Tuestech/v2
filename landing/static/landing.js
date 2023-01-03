// Determine if device is mobile
const MOBILE = window.innerWidth < 970

// Button click callback
let buttonCallback = () => {window.open("/app/", "_self")}

// Activate buttons
const getStartedButtons = Array.from(document.getElementsByClassName("get-started-button"))

for (const button of getStartedButtons) {
	if (MOBILE) {
		button.innerText = "Mobile Coming Soon"
	} else {
		button.addEventListener("click", buttonCallback)
	}
}
