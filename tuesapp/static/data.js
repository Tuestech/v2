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

		// Convert tasks to nested arrays and JSON stringify
		let arrTasks = []
		for (const task of Data.tasks) {
			arrTasks.push(task.toArray())
		}

		const data = {
			"appData": JSON.stringify(arrTasks)
		}

		// Send Post request
		Data.post("/updateuser/", data, csrfToken)
	}

	static init() {
		const data = document.getElementById("data").innerText
		this.tasks = this.fromJSON(data, Task)
	}
}