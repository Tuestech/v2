class Data {
	static tasks
	static events
	static links
	static settings

	// Task Processing
	static fromJSON(json, class_) {
		const arr = JSON.parse(json)
		let temp = []
		for (const item of arr) {
			temp.push(new class_(item))
		}
		return temp
	}

	static getPrioritized() {
		// Create indicies to sort by
		let indices = []
		for (const i = 0; i < Data.task.length; i++) {
			indices.push(i)
		}

		// Sort indices by their corresponding tasks
		indices.sort((a, b) => {
			if (Data.tasks[a].getScore() < Data.tasks[b].getScore()) {
				return -1
			} else if (Data.tasks[a].getScore() > Data.tasks[b].getScore()) {
				return 1
			}
			return 0
		})

		// Convert indices back to task objects
		let out = []
		for (const i = 0; i < Data.tasks.length; i++) {
			out.push(Data.tasks[i])
		}
		return out
	}

	// Network
	static post(url, data, csrfToken) {
		let xhr
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest()
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP")
		}
		xhr.open('POST', url, true)
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.setRequestHeader('X-CSRFToken', csrfToken)
		xhr.setRequestHeader("Accept", "application/json")
		xhr.send(JSON.stringify(data))
	}

	static get(callback) {
		fetch("/getuser/").then(result => {
			Data.tasks = Data.fromJSON(result, Task)
			callback()
		})
	}

	static set() {
		// Get latest CSRF token
		const csrfToken = document.querySelector("meta[name='csrf_token']").content

		// Convert tasks to nested arrays
		let arrTasks = []
		for (const task of Data.tasks) {
			arrTasks.push(task.toArray())
		}

		// Convert events to nested arrays
		let arrEvents = []
		for (const event of Data.events) {
			arrEvents.push(event.toArray())
		}

		const data = {
			"appData": JSON.stringify({
				"tasks": JSON.stringify(arrTasks),
				"events": JSON.stringify(arrEvents),
				// No need to use converted versions because they will not be special objects
				"links": JSON.stringify(Data.links),
				"settings": JSON.stringify(Data.settings)
			})
		}

		// Send Post request
		Data.post("/updateuser/", data, csrfToken)
	}

	// Calculations
	static daysBetween(date1, date2) {
		return Math.floor((date1 - date2)/(1000 * 60 * 60 * 24))
	}

	static init() {
		const data = JSON.parse(document.getElementById("data").innerText)
		this.tasks = this.fromJSON(data["tasks"], Task)
		this.events = this.fromJSON(data["events"], Event)
		this.links = JSON.parse(data["links"])
		this.settings = JSON.parse(data["settings"])
	}
}