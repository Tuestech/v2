class Tutorial {
	static step = 1

	static start() {
		Tutorial.step = 1
		Tutorial.generateModal()
	}

	static next() {
		Tutorial.step += 1
		Tutorial.generateModal()
	}

	static generateModal() {
		if (Tutorial.step == 1) {

			const block = Modal.tutorialBlock("Welcome to Tuesday, the smart work management tool. Would you like a quick tour?")
			new Modal("Tutorial (1/7)", block, ["No", "Yes"], ["white", "green"], [() => {}, Tutorial.next])
			
		} else if (Tutorial.step == 2) {

			const block = Modal.tutorialBlock(
				"This is a task. It has a name, start date, due date, and progress. If you provide a link, you can also click the task to open it later.\n\nThe striped blue bar is your progress goal for today. Try sliding the solid blue progress bar below, then click the task itself.",
				new Task(["Tutorial Task", "", new Date(), new Date(new Date().getTime() + (3*1000*60*60*24)), 20, "https://tues.tech"]).generateTaskCard(() => {}, true)
			)
			new Modal("Tutorial (2/7)", block, ["Exit", "Next"], ["white", "green"], [() => {}, Tutorial.next])

		} else if (Tutorial.step == 3) {

			const img = document.createElement("img")
			img.src = "/static/tutorial/Dashboard.png"
			const block = Modal.tutorialBlock(
				"This is the dashboard. Here, you have a summary of tasks you're working on and any quick-access links you set.",
				img
			)
			new Modal("Tutorial (3/7)", block, ["Exit", "Next"], ["white", "green"], [() => {}, Tutorial.next])

		} else if (Tutorial.step == 4) {

			const img = document.createElement("img")
			img.src = "/static/tutorial/Lists.png"
			const block = Modal.tutorialBlock(
				"These are your lists. Here, you have the ability to edit all of your tasks and events.",
				img
			)
			new Modal("Tutorial (4/7)", block, ["Exit", "Next"], ["white", "green"], [() => {}, Tutorial.next])

		} else if (Tutorial.step == 5) {

			const img = document.createElement("img")
			img.src = "/static/tutorial/Schedule.png"
			const block = Modal.tutorialBlock(
				"This is the schedule page. Here, you can see a timeline of all your tasks as well as a graph of your workload over the next 10 days.",
				img
			)
			new Modal("Tutorial (5/7)", block, ["Exit", "Next"], ["white", "green"], [() => {}, Tutorial.next])

		} else if (Tutorial.step == 6) {
		
			const img = document.createElement("img")
			img.src = "/static/tutorial/Timer.png"
			const block = Modal.tutorialBlock(
				"This is the timer. It follows the Pomodoro Technique, a time management method that is known to increase productivity.",
				img
			)
			new Modal("Tutorial (6/7)", block, ["Exit", "Next"], ["white", "green"], [() => {}, Tutorial.next])

		} else {
			const block = Modal.tutorialBlock(
				`That's it! 🎉<br><br>

				Privacy Policy: <a href="https://tues.tech/privacy">https://tues.tech/privacy</a><br>
				Github: <a href="https://github.com/Tuestech/v2">https://github.com/Tuestech/v2</a><br>
				Contact: <a href="mailto:contact@tues.tech?subject=Hello!">contact@tues.tech</a>`
			)
			new Modal("Tutorial (7/7)", block, ["Complete"], ["green"], [() => {}])

		}
	}
}