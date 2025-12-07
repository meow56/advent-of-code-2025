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
	let beamsX = [startPos[0]];
	for(let y = 0; y < grid.length; y++) {
		let newBeamsX = [];
		for(let beam of beamsX) {
			if(grid[y][beam] === "^") {
				splits++;
				if(!newBeamsX.includes(beam - 1)) 
					newBeamsX.push(beam - 1);
				if(!newBeamsX.includes(beam + 1)) 
					newBeamsX.push(beam + 1);
			} else {
				if(!newBeamsX.includes(beam)) 
					newBeamsX.push(beam);
			}
		}
		beamsX = newBeamsX;
	}
	displayCaption(`The number of times the beam splits is ${splits}.`);
}