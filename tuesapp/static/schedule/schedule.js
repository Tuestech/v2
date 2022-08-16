class Schedule extends Page {
	static init() {
		this.pageName = "schedule"
		this.pageBody = document.getElementById("schedule")
		super.init()
	}

	static externalLoaded() {
		let testX = [1, 2, 3, 4, 5, 6, 7, 8]
		let testY = [2, 5, 3, 2, 3, 4, 1, 3]
		this.graph(testX, testY, [null, 7, null, null, null, null, null, null])
	}
	
	static graph(x, y, wY) {
		// x, y, and wY must be the same length
		// wY are the y values for the warnings if needed, else null

		// Create warning image
		const warningImage = new Image(30, 30)
		warningImage.src = "/static/icons/Warning.png"

		// Define data
		const data = {
			labels: x,
			datasets: [{
				label: 'Workload',
				backgroundColor: '#438BFF',
				borderColor: '#438BFF',
				data: y,
				tension: 0.4,
				pointRadius: 0
			}, {
				label: 'Warnings',
				backgroundColor: 'rgba(0, 0, 0, 0)',
				data: wY,
				pointStyle: [warningImage],
			}]
		}

		// Configure graph
		const config = {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						position: "nearest",
						callbacks: {
							title: (a) => "Warning",
							beforeLabel: () => "Your workload will be very high. Consider\ndoing extra work now to reduce work later.",
							label: () => "",
						}
					},
				},
				scales: {
					xAxes: {
						grid: {
							display: false,
							drawBorder: false
						},
						ticks: {
							display: false
						}
					},
					yAxes: {
						min: 0,
						max: 8,
						grid: {
							display: false,
							drawBorder: false
						},
						ticks: {
							display: false,
						}
					}
				}
			}
		}

		return new Chart(
			document.getElementById('s-graph'),
			config
		)
	}
}