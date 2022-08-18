class List extends Page {
	static init() {
		this.pageName = "list"
		this.pageBody = document.getElementById("list")
		super.init()
	}

	static generateTaskCard(task) {
		const container = document.createElement("div")
		container.className = "task-container"

		const mainTask = task.generateTaskCard()
		
		const editButton = document.createElement("div")
		editButton.className = "glass-panel button"
		const editImg = document.createElement("img")
		editImg.src = "/static/icons/Edit%20Icon.png"
		editButton.append(editImg)
		editButton.addEventListener("click", () => {
			task.openEdit()
		})

		const deleteButton = document.createElement("div")
		deleteButton.className = "glass-panel button"
		const deleteImg = document.createElement("img")
		deleteImg.src = "/static/icons/Delete%20Icon.png"
		deleteButton.append(deleteImg)
		deleteButton.addEventListener("click", () => {
			task.delete()
		})

		container.append(mainTask)
		container.append(editButton)
		container.append(deleteButton)

		return container
	}
}
