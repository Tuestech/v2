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
		switch (Tutorial.step) {
			case 1:
				// Make new modal with intro things
				break;
			
			case 2:
				// Make new modal with tutorial things
				break;
			// More cases here
			default:
				// Make exit modal
		}
	}
}