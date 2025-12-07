"use strict";

function day07(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let startPos;
	for(let y = 0; y < grid.length; y++) {
		for(let x = 0; x < grid[y].length; x++) {
			if(grid[y][x] === "S") {
				startPos = [x, y];
				break;
			}
		}
		if(startPos) break;
	}

	let splits = 0;
	let beamsX = new Map([[startPos[0], 1]]);
	for(let y = 0; y < grid.length; y++) {
		let newBeamsX = new Map();
		for(let [beam, multiplicity] of beamsX.entries()) {
			if(grid[y][beam] === "^") {
				splits++;
				newBeamsX.set(beam - 1, multiplicity + (newBeamsX.get(beam - 1) ?? 0));
				newBeamsX.set(beam + 1, multiplicity + (newBeamsX.get(beam + 1) ?? 0));
			} else {
				newBeamsX.set(beam, multiplicity + (newBeamsX.get(beam) ?? 0));
			}
		}
		beamsX = newBeamsX;
	}

	let timelines = 0;
	for(let mult of beamsX.values()) {
		timelines += mult;
	}

	displayCaption(`The number of times the beam splits is ${splits}.`);
	displayCaption(`The number of timelines is ${timelines}.`);
}