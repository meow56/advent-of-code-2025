"use strict";

function day08(input) {
	const FILE_REGEX = /(\d+),(\d+),(\d+)/g;
	let entry;

	function Junction(pos) {
		this.pos = pos;
		this.distances = [];
	}

	Junction.prototype.allDistances = function() {
		let optimizeFlag = true;
		for(let junction of junctions) {
			if(junction === this) {
				optimizeFlag = false;
				continue;
			}
			if(optimizeFlag) continue;
			this.distances.push([distance(this.pos, junction.pos), junction.pos]);
		}
		this.distances.sort((a, b) => {
			return a[0] - b[0];
		});
	}

	function distance(a, b) {
		return Math.sqrt(((a[0] - b[0]) ** 2) + ((a[1] - b[1]) ** 2) + ((a[2] - b[2]) ** 2));
	}

	let junctions = [];
	while(entry = FILE_REGEX.exec(input)) {
		junctions.push(new Junction([entry[1], entry[2], entry[3]]));
	}

	for(let junction of junctions) {
		junction.allDistances();
	}

	let allJunctionDistances = [];
	for(let junction of junctions) {
		for(let secondJunction of junction.distances) {
			allJunctionDistances.push([secondJunction[0], [junction.pos.join(), secondJunction[1].join()]]);
		}
	}

	allJunctionDistances.sort((a, b) => {
		return a[0] - b[0];
	});

	let connectedRegions = [];
	for(let i = 0; i < 1000; i++) {
		let shortestPair = allJunctionDistances.shift();
		let firstJunction = shortestPair[1][0];
		let secondJunction = shortestPair[1][1];
		let firstInRegion = connectedRegions.some(e => e.includes(firstJunction));
		let secondInRegion = connectedRegions.some(e => e.includes(secondJunction));
		if(firstInRegion && secondInRegion) {
			let firstRegion = connectedRegions.findIndex(e => e.includes(firstJunction));
			let secondRegion = connectedRegions.findIndex(e => e.includes(secondJunction));
			if(firstRegion === secondRegion) {
				continue;
			} else {
				connectedRegions[firstRegion] = connectedRegions[firstRegion].concat(connectedRegions[secondRegion]);
				connectedRegions.splice(secondRegion, 1);
			}
		} else if (firstInRegion) {
			let firstRegion = connectedRegions.find(e => e.includes(firstJunction));
			firstRegion.push(secondJunction);
		} else if(secondInRegion) {
			let secondRegion = connectedRegions.find(e => e.includes(secondJunction));
			secondRegion.push(firstJunction);
		} else {
			connectedRegions.push([firstJunction, secondJunction]);
		}
	}

	connectedRegions.sort((a, b) => {
		return b.length - a.length;
	});

	let product = connectedRegions[0].length * connectedRegions[1].length * connectedRegions[2].length;
	displayCaption(`The product of region sizes is ${product}.`);
}