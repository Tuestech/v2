class Settings extends Page {
	static init() {
		this.pageName = "settings"
		this.pageBody = document.getElementById("settings")

		this.preferences_input_id_key_pairs = {
			"workload-limit": "workloadLimit",
			"data-collection": "dataCollection",
			"beta": "beta",
			"default-links": "defaultLinks",
			"show-completed": "showCompleted"
		}

		// Preferences
		Settings.activatePreferences()

		// Progress Curve
		Settings.activateProgressCurves()

		// Actions
		Settings.activateActions()

		super.init()
	}

	static setInputValue(input, value) {
		if (input.getAttribute("type") == "checkbox") {
			input.checked = value
		} else {
			input.value = value
		}
	}

	static getInputValue(input) {
		if (input.getAttribute("type") == "checkbox") {
			return input.checked
		} else {
			return input.value
		}
	}

	static connectInput(input, settingsKey) {
		input.addEventListener("change", () => {
			Data.settings[settingsKey] = Settings.getInputValue(input)
			Data.requestUpdate()
		})
	}

	static activatePreferences() {
		// Set the current states of inputs and connect with data
		for (const [id, key] of Object.entries(Settings.preferences_input_id_key_pairs)) {
			const input = document.getElementById(id)
			Settings.setInputValue(input, Data.settings[key])
			Settings.connectInput(input, key)
		}
	}

	static updateProgressCurveGraph() {
		const curve = document.getElementById("progress-curve-curve")

		const curveClassNames = [
			"linear",
			"slight-poly",
			"strong-poly"
		]

		curve.classList.remove(...curveClassNames)
		curve.classList.add(curveClassNames[Data.settings["scoreType"]])
	}

	static activateProgressCurves() {
		// Update graph
		Settings.updateProgressCurveGraph()

		// Activate buttons
		const consistent = document.getElementById("consistent")
		const upFront = document.getElementById("up-front")
		const aggressive = document.getElementById("aggressive")

		const listener = (e) => {
			// Deactive other buttons
			for (const button of [consistent, upFront, aggressive]) {
				button.classList.remove("active")
			}

			// Activate clicked button
			e.target.classList.add("active")

			// Update data
			Data.settings["scoreType"] = e.target.getAttribute("data-score-type")
			Data.requestUpdate()

			// Update graph
			Settings.updateProgressCurveGraph()
		}

		for (const button of [consistent, upFront, aggressive]) {
			button.addEventListener("click", listener)
		}

		// Display active button
		const activeButton = [consistent, upFront, aggressive][Data.settings["scoreType"]]
		activeButton.classList.add("active")
	}

	static activateActions() {
		// Activate view source
		document.getElementById("view-source").addEventListener("click", () => {
			window.open("https://github.com/Tuestech/v2", "_blank")
		})

		// Activate delete data
		document.getElementById("delete-data").addEventListener("click", () => {
			const filler = document.createElement("div")
			new Modal(`Are you sure you want to delete all of your data? This cannot be undone.`, filler, ["Keep", "Delete"], ["white", "red"], [() => {}, () => {
				Data.deleteAll()
			}])
		})
	}
}