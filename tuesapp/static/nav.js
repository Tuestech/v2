class Nav {
	static pages = ["home", "list", "schedule", "timer", "settings"]
	static activePage = 0
	static icons = Array.from(document.getElementsByClassName("icon")).slice(1)
	static pageChangeEvent = new Event("pageChange")

	// Update navigation UI and trigger pageChange event on icon click
	static iconClick(index) {
		// Move the selection indicator
		this.icons[this.activePage].classList.toggle("selected", false)
		this.icons[index].classList.toggle("selected", true)

		// Update active page
		this.activePage = index

		// Dispatch event
		document.dispatchEvent(this.pageChangeEvent)
	}

	// To be run on file load
	static init() {
		// Add click event listeners for icons
		for (let i = 0; i < this.icons.length; i++) {
			this.icons[i].addEventListener("click", () => {
				Nav.iconClick(i)
			})
		}
	}
}

Nav.init()