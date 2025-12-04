"use strict";

function day04(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}
	let gridCopy = grid.map(e => e.slice());

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

	let removedPaper = 1;
	let totalRemoved = 0;
	let accessiblePaper = 0;
	let steps = [];
	while(removedPaper !== 0) {
		removedPaper = 0;
		let accessiblePapers = [];
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
					accessiblePapers.push([x, y]);
				}
			}
		}
		if(accessiblePaper === 0) {
			accessiblePaper = accessiblePapers.length;
		}

		for(let coord of accessiblePapers) {
			grid[coord[1]][coord[0]] = ".";
		}
		removedPaper = accessiblePapers.length;
		totalRemoved += removedPaper;
		steps.push(accessiblePapers.slice());
	}

	displayCaption(`The number of accessible rolls is ${accessiblePaper}.`);
	displayCaption(`The total number of rolls you can remove is ${totalRemoved}.`);
	displayCaption(`The grid is shown.`);
	displayCaption(`Use Previous and Next to navigate through the removals.`);
	displayCaption(`X marks rolls that were just removed.`);

	function stepsClosure(steps, grid) {
		let step = 0;
		function next() {
			step = Math.min(steps.length, step + 1);
			display();
		}

		function prev() {
			step = Math.max(0, step - 1);
			display();
		}

		function display() {
			clearText();
			displayText(`Step ${step}`);
			let gridCopy = grid.map(e => e.slice());
			for(let i = 0; i < step; i++) {
				for(let coord of steps[i]) {
					gridCopy[coord[1]][coord[0]] = (i === step - 1) ? "X" : ".";
				}
			}

			for(let row of gridCopy) {
				displayText(row.join(""));
			}
		}

		display();

		return [next, prev];
	}

	let [next, prev] = stepsClosure(steps, gridCopy);
	assignButton(prev, "Previous");
	assignButton(next, "Next");
}