class Settings extends Page {
	static init() {
		this.pageName = "settings"
		this.pageBody = document.getElementById("settings")

		this.preferences_input_id_key_pairs = {
			"workload-limit": "workloadLimit",
			"data-collection": "dataCollection",
			"double-click": "doubleClick",
			"prepme": "prepme",
			"offline-resync": "offlineResync",
			"beta": "betaFeatures",
			"default-links": "defaultLinks",
			"show-completed": "showCompleted"
		}

		this.defaultValues = {
			"workloadLimit": 1.5,
			"dataCollection": false,
			"doubleClick": true,
			"prepme": false,
			"offlineResync": true,
			"beta": false,
			"defaultLinks": false,
			"showCompleted": false
		}

		// Preferences
		Settings.activatePreferences()

		// Progress Curve
		Settings.activateProgressCurves()

		// Actions
		Settings.activateActions()

		super.init()
	}

	static onPageChange() {
		// Beta Lock
		Settings.updateBetaLock()

		super.onPageChange()
	}

	static updateBetaLock() {
		const locked = Array.from(document.getElementsByClassName("beta-lock"))

		if (Data.settings["betaFeatures"]) {
			locked.forEach(x => x.removeAttribute("disabled"))
		} else {
			locked.forEach(x => x.setAttribute("disabled", true))
		}
	}

	static setInputValue(input, value) {
		if (input.getAttribute("type") == "checkbox") {
			input.checked = value
		} else {
			input.value = value
			input.oninput()
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

			Settings.updateBetaLock()
		})
	}

	static activatePreferences() {
		// Add workload slider
		const cont = document.getElementById("workload-limit-container")
		const slider = Modal.sliderInput("", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4, false)
		slider.getElementsByTagName("input")[0].id = "workload-limit"
		cont.append(slider)

		// Set the current states of inputs and connect with data
		for (const [id, key] of Object.entries(Settings.preferences_input_id_key_pairs)) {
			const input = document.getElementById(id)

			if (!(key in Data.settings)) {
				Data.settings[key] = Settings.defaultValues[key]
			}

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