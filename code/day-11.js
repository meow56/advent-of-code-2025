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
	function pathsToOut(currPos, p2 = false, hitDAC = false, hitFFT = false) {
		if(currPos.name === "out") return +(!p2 || (hitDAC && hitFFT));
		if(currPos.name === "dac") hitDAC = true;
		if(currPos.name === "fft") hitFFT = true;
		let mapKey = `${currPos.name};${p2};${hitDAC};${hitFFT}`;
		if(numPaths.has(mapKey)) return numPaths.get(mapKey);
		let sum = 0;
		for(let neighbor of currPos.outs) {
			sum += pathsToOut(neighbor, p2, hitDAC, hitFFT);
		}

		numPaths.set(mapKey, sum);
		return sum;
	}

	let result = pathsToOut(you);
	displayCaption(`The number of paths to out is ${result}.`);

	let svr = devices.find(d => d.name === "svr");
	let serverResult = pathsToOut(svr, true);
	displayCaption(`The number of sus paths is ${serverResult}.`);
}