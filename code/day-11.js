"use strict";

function day11(input) {
	const FILE_REGEX = /([a-z]{3}): ((?:[a-z]{3} ?)+)/g;
	let entry;
	let devices = [];
	while(entry = FILE_REGEX.exec(input)) {
		devices.push(new Device(entry[1], entry[2].split(" ")));
	}

	function Device(name, outs) {
		this.name = name;
		this.outs = outs;
	}

	devices.push(new Device("out", []));

	Device.prototype.connect = function() {
		this.outs = this.outs.map(e => devices.find(d => d.name === e));
	}

	devices.forEach(d => d.connect());

	let you = devices.find(d => d.name === "you");
	const numPaths = new Map();
	function pathsToOut(currPos) {
		if(currPos.name === "out") return 1;
		if(numPaths.has(currPos.name)) return numPaths.get(currPos.name);
		let sum = 0;
		for(let neighbor of currPos.outs) {
			sum += pathsToOut(neighbor);
		}

		numPaths.set(currPos.name, sum);
		return sum;
	}

	let result = pathsToOut(you);
	displayCaption(`The number of paths to out is ${result}.`);
}