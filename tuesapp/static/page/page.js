class Page {
	static pageName
	static pageBody

	static onPageChange() {
		this.updateVisibility()
	}

	static updateVisibility() {
		const activePageName = Nav.pages[Nav.activePage]
		if (activePageName == this.pageName) {
			this.pageBody.classList.toggle("hidden", false)
		} else {
			this.pageBody.classList.toggle("hidden", true)
		}
	}

	static init() {
		this.updateVisibility()
		document.addEventListener("pageChange", () => {this.onPageChange()})
	}
}
