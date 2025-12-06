"use strict";

function day06(input) {
	const FILE_REGEX = /^.+$/gm;
	let entry;
	let numGrid = [];
	while(entry = FILE_REGEX.exec(input)) {
		numGrid.push(entry[0].split(" ").filter(e => e !== ""));
	}

	let transposedGrid = [];
	for(let i = 0; i < numGrid[0].length; i++) {
		let newRow = [];
		for(let j = 0; j < numGrid.length; j++) {
			newRow.push(numGrid[j][i]);
		}
		transposedGrid.push(newRow);
	}

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

	displayCaption(`The grand total is ${sum}.`);
}