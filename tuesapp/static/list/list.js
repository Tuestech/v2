class List extends Page {
	static init() {
		this.pageName = "list"
		this.pageBody = document.getElementById("list")
		super.init()
	}

	static onPageChange() {
		this.updateToDo()
		this.updateCompleted()
		// TODO: Add Events

		// Update page visibility
		super.onPageChange()
	}	

	static updateToDo() {
		const toDo = document.getElementById("todo")
		Page.clearChildren(toDo, 1)

		const tasks = Data.tasks.filter((task) => task.progress != 100)

		for (const task of tasks) {
			toDo.append(List.generateTaskCard(task))
		}
	}

	static updateCompleted() {
		const completed = document.getElementById("completed")
		Page.clearChildren(completed, 1)

		const tasks = Data.tasks.filter((task) => task.progress == 100)

		for (const task of tasks) {
			completed.append(List.generateTaskCard(task))
		}
	}

	static generateTaskCard(task) {
		const container = document.createElement("div")
		container.className = "task-container"

		const mainTask = task.generateTaskCard(() => {
			List.updateToDo()
			List.updateCompleted()
		})
		
		const editButton = document.createElement("div")
		editButton.className = "glass-panel button"
		const editImg = document.createElement("img")
		editImg.src = "/static/icons/Edit%20Icon.png"
		editButton.append(editImg)
		editButton.addEventListener("click", () => {task.edit()})

		const deleteButton = document.createElement("div")
		deleteButton.className = "glass-panel button"
		const deleteImg = document.createElement("img")
		deleteImg.src = "/static/icons/Delete%20Icon.png"
		deleteButton.append(deleteImg)
		deleteButton.addEventListener("click", () => {task.delete()})

		container.append(mainTask)
		container.append(editButton)
		container.append(deleteButton)

		return container
	}
}
