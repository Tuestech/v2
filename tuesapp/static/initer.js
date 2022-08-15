Data.init()
Nav.init()
Dash.init()
List.init()
Schedule.init()
Timer.init()
Settings.init()

document.addEventListener("DOMContentLoaded", function(event) {
  Dash.externalLoaded()
  List.externalLoaded()
  Schedule.externalLoaded()
  Timer.externalLoaded()
  Settings.externalLoaded()
});