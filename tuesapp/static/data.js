class Data {
	static tasks

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

	static get() {
		// TODO: Use fetch to get data
		let result = fetch("url goes here")
		tasks = JSON.parse()
	}

	static set() {
		// Get latest CSRF token
		const csrfToken = document.querySelector("meta[name='csrf_token']").content

		// TODO: Convert data to nested arrays and JSON stringify
		const data = {
			"appData": "qweagsdgasdgrty"
		}

		// Send Post request
		Data.post("/updateuser/", data, csrfToken)
	}

	static init() {
	}
}