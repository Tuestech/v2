class Page {
	static pageName
	static pageBody

	static onPageChange() {
		this.updateVisibility()
	}

	static updateVisibility() {
		// Update the visibility of the main content
		const activePageName = Nav.pages[Nav.activePage]
		if (activePageName == this.pageName) {
			this.pageBody.classList.toggle("hidden", false)
			
			// If the page is the new selected page, update title as well
			document.getElementById("title").innerText = Nav.titleNames[Nav.activePage]
		} else {
			this.pageBody.classList.toggle("hidden", true)
		}
	}

	static init() {
		this.updateVisibility()
		document.addEventListener("pageChange", () => {this.onPageChange()})
	}
}
