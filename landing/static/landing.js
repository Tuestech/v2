// Determine if device is mobile
const MOBILE = window.innerWidth < 970

// Button click callback
const buttonCallback = () => {window.open("/app/", "_self")}

// Page cluster follow mouse
const MAX_SHIFT = 50

const clusterImages = Array.from(document.getElementById("cluster").children)
const mouseCallbacks = []

const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
const unitVector = (x, y) => [x/distance(x, y, 0, 0), y/distance(x, y, 0, 0)]
const smoothDecay = (x) => 1/(1 + (x/150)**2)

for (const img of clusterImages) {
	// Specific callback for each img
	let callback = (e) => {
		// Compute untransformed x and y of img
		let transform = window.getComputedStyle(img).transform.split(/,|\(|\)/)
		const rect = img.getBoundingClientRect()

		if (transform == "none") {
			transform = [0, 0, 0, 0, 0, 0]
		}

		const x = rect.left - parseFloat(transform[4]) + rect.width/2
		const y = rect.top - parseFloat(transform[5]) + rect.height/4 // Adjust center higher

		// Compute magnitude of movement based on distance
		const d = smoothDecay(distance(x, y, mouseX, mouseY))

		// Create a shift vector <u, v> of max length MAX_SHIFT
		let temp = unitVector(x-mouseX, y-mouseY)
		let u = temp[0]*d*MAX_SHIFT
		let v = temp[1]*d*MAX_SHIFT
		
		// Apply shift
		img.animate([
			{ transform: `translate(${u}px, ${v}px)` },
		], {
			duration: 2000,
			iterations: 1,
			fill: "forwards"
		})
	}

	// Add to global mouse callbacks
	mouseCallbacks.push(callback)
}

// Network edge pulses
const networkSvg = document.getElementById("network")

networkSvg.addEventListener("load", () => {
	let svg = networkSvg

	let edges = Array.from(svg.getElementsByClassName("network-edge"))

	for (let i = 0; i < edges.length; i++) {
		const edge = edges[i]

		setTimeout(() => {
			edge.animate([
				{ "opacity": "100%" },
				{ "opacity": "60%" },
				{ "opacity": "100%" },
			], {
				duration: 1000 + i*200,
				iterations: Infinity
			})
		}, i*500)
	}
})

// Mouse callbacks
let mouseX = 0
let mouseY = 0

if (!MOBILE) {
	document.addEventListener("mousemove", (e) => {
		mouseX = e.x
		mouseY = e.y

		for (const listener of mouseCallbacks) {
			listener(e)
		}
	})

	document.addEventListener("scroll", (e) => {
		for (const listener of mouseCallbacks) {
			listener(e)
		}
	})
}
