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

	static clearChildren(parent) {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild)
		}
	}

	static init() {
		this.updateVisibility()
		this.onPageChange()
		document.addEventListener("pageChange", () => {this.onPageChange()})
	}
}
