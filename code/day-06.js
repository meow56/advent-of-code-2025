"use strict";

function day06(input) {
	const FILE_REGEX = /^.+$/gm;
	let entry;
	let numGrid = [];
	let wrongGrid = [];
	while(entry = FILE_REGEX.exec(input)) {
		numGrid.push(entry[0].split(" ").filter(e => e !== ""));
		wrongGrid.push(entry[0].split(""));
	}

	function transpose(grid) {
		let transposedGrid = [];
		for(let i = 0; i < grid[0].length; i++) {
			let newRow = [];
			for(let j = 0; j < grid.length; j++) {
				newRow.push(grid[j][i]);
			}
			transposedGrid.push(newRow);
		}
		return transposedGrid;
	}

	let transposedGrid = transpose(numGrid);
	let transposedTextGrid = transpose(wrongGrid).toReversed();
	console.log(transposedTextGrid);

	let sum = 0;
	for(let row of transposedGrid) {
		let operation = row.pop();
		let answer = +(operation === "*");
		for(let num of row) {
			if(operation === "+") {
				answer += +num;
			} else if(operation === "*") {
				answer *= +num;
			}
		}
		sum += answer;
	}

	let trueSum = 0;
	let stack = [];
	for(let row of transposedTextGrid) {
		if(row.join("").trim().length === 0) continue;
		let operation = row.pop();
		stack.push(+(row.join("")));
		if(operation !== " ") {
			trueSum += stack.reduce((acc, val) => (operation === "*" ? acc * val : acc + val));
			stack = [];
		}
	}

	displayCaption(`The grand total is ${sum}.`);
	displayCaption(`The actual grand total is ${trueSum}.`);
}