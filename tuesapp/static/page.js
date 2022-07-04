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

	// startIndex is number of elements to skip from the beginning
	// endIndex is the number of elements
	static clearChildren(parent, startIndex=0, endIndex=0) {
		const array = parent.children

		// Iterate backwards for peace of mind
		for (let i = array.length - endIndex; i < startIndex; i--) {
			parent.removeChild(array[i])
		}
	}

	static init() {
		this.updateVisibility()
		this.onPageChange()
		document.addEventListener("pageChange", () => {this.onPageChange()})
	}
}
