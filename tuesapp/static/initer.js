Data.init()
Nav.init()
Settings.init()
Dash.init()
List.init()
Schedule.init()
Timer.init()

document.addEventListener("DOMContentLoaded", function(event) {
  Dash.externalLoaded()
  List.externalLoaded()
  Schedule.externalLoaded()
  Timer.externalLoaded()
  Settings.externalLoaded()

	// Start tutorial if new user
	if (document.getElementById("is-new").innerText == "True") {
		Tutorial.start()
	}
})
