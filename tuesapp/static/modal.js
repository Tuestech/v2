class Modal {
	constructor(title, content, options, colors, callbacks=[]) {
		/**
		 * Displays a modal
		 * 
		 * title     - String of the title of the modal
		 * content   - DOM element for the main content of the modal
		 * options   - Array of String names of buttons
		 * colors    - Array of String colors of buttons
		 * callbacks - Array of callback functions that correspond to buttons in options [Optional]
		 */
		
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
			button.className = `glass-panel button ${buttonPos[i]}`
			button.innerText = options[i]
			// TODO: Add colors

			// TODO: Make buttons do something

			optionsDiv.append(button)
		}

		// Build
		const body = document.getElementsByTagName("body")[0]
		modal.append(p)
		modal.append(contentDiv)
		modal.append(optionsDiv)
		container.append(modal)
		body.append(container)
	}
}