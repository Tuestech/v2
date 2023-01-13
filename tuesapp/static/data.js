class Data {
	static tasks
	static events
	static links
	static settings
	static updateNecessary = false
	static timeoutActive = false
	static TIMEOUT_LENGTH = 500
	static lastUpdated = new Date()

	// Init
	static init() {
		// Get data from "server"
		const data = JSON.parse(document.getElementById("data").innerText)
		Data.updateFromJSON(data)
		Data.lastUpdated = new Date(data["lastUpdated"])

		// Get data from real server async
		Data.sync(() => {
			document.dispatchEvent(new Event("pageChange"))
		})

		// Offline banner when offline
		window.addEventListener("offline", () => {
			document.getElementById("online").classList.remove("shown")
			document.getElementById("offline").classList.add("shown")
		})

		// Sync when back online
		window.addEventListener("online", () => {
			document.getElementById("offline").classList.remove("shown")
			document.getElementById("online").classList.add("shown")

			// Do not resync if setting is off
			if (!Data.settings["offlineResync"]) return

			Data.sync(() => {
				window.setTimeout(() => {document.getElementById("online").classList.remove("shown")}, 500)
				document.dispatchEvent(new Event("pageChange"))
			})
		})
	}

	// Data update pattern
	static sync(callback = () => {}) {
		Data.get((value) => {
			const parsedValue = JSON.parse(value)
			const dbLastUpdated = parsedValue["lastUpdated"]

			if (dbLastUpdated && (Data.lastUpdated.getTime() > new Date(dbLastUpdated).getTime())) {
				// Update db instead of instance if instance was updated after the last logged update in db
				Data.requestUpdate()
				callback()
			} else {
				// Update instance instead of db if instance was updated before the last logged update in db
				// Also handle case of no last updated time stored in db
				Data.updateFromJSON(parsedValue)
				callback()
			}
		})
	}

	static requestUpdate() {
		// Flag update
		Data.updateNecessary = true

		// Allow update loop to run if active
		if (Data.timeoutActive) return

		// Send request and start loop
		Data.set()
		Data.updateNecessary = false
		Data.timeoutActive = true
		setTimeout(Data.updateLoop, Data.TIMEOUT_LENGTH)
	}

	static updateLoop() {
		if (Data.updateNecessary) {
			Data.updateNecessary = false
			Data.set()
			setTimeout(Data.updateLoop, Data.TIMEOUT_LENGTH)
		} else {
			Data.timeoutActive = false
		}
	}

	// Data parsing
	static updateFromJSON(JSONdata) {
		Data.tasks = Data.fromJSON(JSONdata["tasks"], Task)
		Data.events = Data.fromJSON(JSONdata["events"], Event)
		Data.links = JSON.parse(JSONdata["links"])
		Data.settings = JSON.parse(JSONdata["settings"])
	}

	static fromJSON(json, class_) {
		const arr = JSON.parse(json)
		let temp = []
		for (const item of arr) {
			temp.push(new class_(item))
		}
		return temp
	}

	static getPrioritized(excludeCompleted=false) {
		// Create indices to sort by
		let indices = []
		for (let i = 0; i < Data.tasks.length; i++) {
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
		for (let i = 0; i < Data.tasks.length; i++) {
			out.push(Data.tasks[indices[i]])
		}

		// Exclude completed if needed
		if (excludeCompleted) {
			out = out.filter(x => x.progress != 100)
		}

		return out
	}

	static calculateWorkload(days=10) {
		// Init day to today
		let day = new Date()

		// Setup
		let workloads = []
		let current = Data.tasks.map(x => x.progress)
		let projectedEndOfDay = Data.tasks.map(x => x.expectedProgress(day))

		// Array ops
		const sub = (arr1, arr2) => {
			let out = []
			for (let i = 0; i < arr1.length; i++) {
				out.push(arr1[i] - arr2[i])
			}
			return out
		}
		const max0 = (arr) => arr.map(x => Math.max(0, x))
		const sum = (arr) => arr.reduce((a, b) => a + b, 0)

		// Calculate workloads
		for (let i = 0; i < days; i++) {
			// Calculate cumulative progress deficit between current and next day
			const deficits = max0(sub(projectedEndOfDay, current))
			workloads.push(sum(deficits))

			// Calculate actual progress of next day if projected work is done
			let calcNext = []
			for (let i = 0; i < current.length; i++) {
				calcNext.push(Math.max(current[i], projectedEndOfDay[i]))
			}

			// Move day to next day
			day = new Date(day.getTime() + (1000 * 60 * 60 * 24))

			// Move progresses to next day
			current = calcNext
			projectedEndOfDay = Data.tasks.map(x => x.expectedProgress(day))
		}

		return workloads
	}

	// Links
	static newLink() {
		// Create a modal that adds a new link then trigger a page update
		const name = Modal.textInput("Name")
		const link = Modal.textInput("Link")
		const stackForm = Modal.stackForm(name, link)

		const blankCallback = () => {}

		const callback = () => {
			const newName = name.children[0].value
			const newLink = link.children[0].value

			// TODO: Add link filtering
			
			Data.links.push([newName, newLink])

			Data.requestUpdate()

			// Page update
			document.dispatchEvent(new Event("pageChange"))
		}

		// Create modal
		new Modal("New Link", stackForm, ["Cancel", "OK"], ["white", "green"], [blankCallback, callback])
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

	static get(callback = () => {}) {
		fetch("/getuser/").then(result => {
			result.text().then(value => {
				callback(value)
			})
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
				"settings": JSON.stringify(Data.settings),
				"lastUpdated": Data.lastUpdated.toString()
			})
		}

		// Send Post request
		Data.post("/updateuser/", data, csrfToken)

		// Log update
		Data.lastUpdated = new Date()
	}

	static deleteAll() {
		// Get latest CSRF token
		const csrfToken = document.querySelector("meta[name='csrf_token']").content

		// Send delete data request
		Data.post("/deletedata/", null, csrfToken)

		// Redirect to landing page
		window.open("https://tues.tech/", "_self")
	}

	// Calculations
	static daysBetween(date1, date2) {
		date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
		date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
		return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24))
	}
}