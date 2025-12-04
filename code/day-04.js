"use strict";

function day04(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	const NEIGHBORS = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	let accessiblePaper = 0;
	for(let y = 0; y < grid.length; y++) {
		for(let x = 0; x < grid[y].length; x++) {
			if(grid[y][x] !== "@") continue;
			let adjacentPaper = 0;
			for(let neighbor of NEIGHBORS) {
				if(grid[y + neighbor[1]]?.[x + neighbor[0]] === "@") {
					adjacentPaper++;
				}
			}
			if(adjacentPaper < 4) {
				accessiblePaper++;
			}
		}
	}

	displayCaption(`The number of accessible rolls is ${accessiblePaper}.`);
}