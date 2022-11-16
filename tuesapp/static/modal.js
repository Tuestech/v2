class Modal {
	constructor(title, content, options, colors, callbacks=[]) {
		/**
		 * Displays a modal
		 * 
		 * title     - String of the title of the modal
		 * content   - DOM element for the main content of the modal
		 * options   - Array of String names of buttons
		 * colors    - Array of String colors ["red", "white", "green"] of buttons
		 * callbacks - Array of callback functions that correspond to buttons in options [Optional]
		 */
		
		// Constants
		const body = document.getElementsByTagName("body")[0]

		// Positioning setup
		const buttonPositionMap = {
			1: ["right"],
			2: ["left", "right"],
			3: ["left", "mid", "right"]
		}
		const buttonPos = buttonPositionMap[options.length]

		// Basic element setup
		const container = document.createElement("div")
		container.className = "modal-container"

		const modal = document.createElement("div")
		modal.className = "modal glass-panel"
		
		const p = document.createElement("p")
		p.innerText = title
		
		const contentDiv = document.createElement("div")
		contentDiv.append(content)

		const optionsDiv = document.createElement("div")
		optionsDiv.className = "options"

		// Create buttons
		for (let i = 0; i < options.length; i++) {
			const button = document.createElement("button")
			button.className = `glass-panel button ${buttonPos[i]} ${colors[i]}`
			button.innerText = options[i]

			// Make buttons do something
			if (callbacks.length > i) {
				button.addEventListener("click", () => {
					callbacks[i]()
					body.removeChild(container)
				})
			} else {
				button.addEventListener("click", () => {
					body.removeChild(container)
				})
			}

			optionsDiv.append(button)
		}

		// Build
		modal.append(p)
		modal.append(contentDiv)
		modal.append(optionsDiv)
		container.append(modal)
		body.append(container)
	}

	static sandwichForm(top, left, right, bottom) {
		const form = document.createElement("div")
		// TODO: Fill form with content
		return form
	}

	static stackForm(top, bottom) {
		const form = document.createElement("div")
		// TODO: Fill form with content
		return form
	}

	static textInput(label, wide=false) {
		// Return div with text input
		const out = document.createElement("div")
		out.classList.add("input")

		const labelP = document.createElement("p")
		labelP.innerText = label
		out.append(labelP)

		const input = document.createElement("input")
		input.setAttribute("type", "text")
		
		if (wide) {
			input.classList.add("wide")
		}
		out.append(input)

		return out
	}

	static dateInput(label) {
		// Return div with date input
		const out = document.createElement("div")
		out.classList.add("input")

		const labelP = document.createElement("p")
		labelP.innerText = label
		out.append(labelP)

		const input = document.createElement("input")
		input.setAttribute("type", "date")
		out.append(input)

		return out
	}

	static selectInput(label, options) {
		// Return div with select input
		
		// Implement later
	}
}