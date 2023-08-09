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
			const baseCallback = () => {
				container.removeChild(modal)
				container.classList.add("removed")
				container.addEventListener("transitionend", () => {body.removeChild(container)})
			}

			if (callbacks.length > i) {
				button.addEventListener("click", () => {
					if (callbacks[i]()) return
					baseCallback()
				})
			} else {
				button.addEventListener("click", () => {
					baseCallback()
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

	static sandwichForm(top, left, right, mid, bottom) {
		const form = document.createElement("div")
		form.classList.add("form", "sandwich")

		top.classList.add("top")
		left.classList.add("left")
		right.classList.add("right")
		mid.classList.add("mid")
		bottom.classList.add("bottom")

		form.append(top)
		form.append(left)
		form.append(right)
		form.append(mid)
		form.append(bottom)

		return form
	}

	static stackForm(top, bottom) {
		const form = document.createElement("div")
		form.classList.add("form", "stack")
		
		form.append(top)
		form.append(bottom)

		return form
	}

	static textInput(label, wide=false, initialValue="") {
		// Return div with text input
		const out = document.createElement("div")
		out.classList.add("input")

		const labelP = document.createElement("p")
		labelP.innerText = label

		const input = document.createElement("input")
		input.setAttribute("type", "text")
		input.value = initialValue
		
		if (wide) {
			input.classList.add("wide")
		}

		out.append(input)
		out.append(labelP)

		return out
	}

	static dateInput(label, initialValue) {
		// Return div with date input
		const out = document.createElement("div")
		out.classList.add("input")

		const labelP = document.createElement("p")
		labelP.innerText = label

		const input = document.createElement("input")
		input.setAttribute("type", "date")
		if (initialValue) {
			input.value = Task.formatDate(initialValue, "yyyy-mm-dd")
		}

		out.append(input)
		out.append(labelP)

		return out
	}

	static sliderInput(label, intervals, initialValue) {
		// Return div with slider input
		const out = document.createElement("div")
		out.classList.add("input", "slider")

		const labelP = document.createElement("p")
		labelP.innerText = label
		labelP.classList.add("label")

		const leftP = document.createElement("p")
		leftP.innerText = intervals[0]
		leftP.classList.add("l")

		const rightP = document.createElement("p")
		rightP.innerText = intervals[intervals.length - 1]
		rightP.classList.add("r")

		const input = document.createElement("input")
		input.setAttribute("type", "range")
		input.classList.add("wide", "s")
		input.value = intervals.indexOf(initialValue)

		const tooltip = document.createElement("div")
		tooltip.classList.add("tooltip")
		tooltip.innerText = initialValue

		input.min = 0
		input.max = intervals.length - 1
		input.step = 0.01

		// Update tooltip when slider is moved
		const updateTooltip = () => {
			let xOff = leftP.getBoundingClientRect().width + 10
			let prog = 9+(input.getBoundingClientRect().width-18) * (input.value/(intervals.length-1))
			let halfWidth = tooltip.getBoundingClientRect().width/2

			tooltip.style = `transform: translate(${xOff + prog - halfWidth}px, -40px)`
		}

		input.addEventListener("input", () => {
			tooltip.innerText = intervals[Math.round(input.value)]
			updateTooltip()
		})

		// Update tooltip when visible
		new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if(entry.intersectionRatio > 0) {
					updateTooltip()
					observer.disconnect()
				}
			})
		}).observe(input);

		out.append(input)
		out.append(rightP)
		out.append(leftP)
		out.append(labelP)
		out.append(tooltip)

		return out
	}

	static selectInput(label, options) {
		// Return div with select input
		
		// Implement later
	}

	static tutorialBlock(text, element=null) {
		// Return a tutorial block with text describing the element below
		const div = document.createElement("div")
		div.classList.add("tutorial-block")

		const p = document.createElement("p")
		p.innerHTML = text
		div.append(p)

		if (element) {
			div.append(element)
		}

		return div
	}
}