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
}