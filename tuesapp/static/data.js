class Data {
	static tasks
	static uid

	// Get uid
	static getUid() {
		this.uid = document.querySelector("meta[name='uid']").content
	}

	// Network
	static post(url, data, csrfToken) {
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('X-CSRF-Token', csrfToken);
		xhr.send(JSON.stringify(data));
	}

	static get() {
		// TODO: Use fetch to get data
		let result = fetch("url goes here")
		tasks = JSON.parse()
	}

	static set() {
		// TODO: Use an actual csrf token
		const csrfToken = "asdf"
		// TODO: Send Post request using post function
	}

	static init() {
		Data.getUid()
	}
}