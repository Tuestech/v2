class Event {
	static keys = ["name", "date", "link"]
	static types = ["s", "d", "s"]
	constructor(arr) {
		for (let i = 0; i < Event.keys.length; i++) {
			if (Event.types[i] != "d") {
				this[Event.keys[i]] = arr[i]
			} else {
				this[Event.keys[i]] = new Date(arr[i])
			}
		}
	}

	toArray() {
		let out = []
		for (const key of Event.keys) {
			out.push(this[key])
		}
		return out
	}
}