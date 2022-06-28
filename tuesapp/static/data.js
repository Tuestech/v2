class Data {
	static tasks

	// Task Processing
	static fromJSON(json) {
		const arr_tasks = JSON.parse(json)
		let temp = []
		for (const task of arr_tasks) {
			temp.push(new Task(task))
		}
		Data.tasks = temp
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
			Data.fromJSON(result)
			callback()
		})
	}

	static set() {
		// Get latest CSRF token
		const csrfToken = document.querySelector("meta[name='csrf_token']").content

		// Convert data to nested arrays and JSON stringify
		let arrTasks = []
		for (const task of arrTasks) {
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
		this.fromJSON(data)
	}
}