"use strict";

function day03(input) {
	const FILE_REGEX = /(\d+)/g;
	let entry;
	let lines = [];
	while(entry = FILE_REGEX.exec(input)) {
		lines.push(entry[1]);
	}

	let totalJoltage = 0;
	for(let line of lines) {
		let maxJoltageFound = false;
		for(let i = 9; i >= 0; i--) {
			let firstIndex = line.indexOf(i);
			if(firstIndex !== -1 && firstIndex !== line.length - 1) {
				for(let j = 9; j >= 0; j--) {
					let secondIndex = line.indexOf(j, firstIndex + 1);
					if(secondIndex !== -1) {
						console.log(`${line}: ${i} ${j}`);
						totalJoltage += (10 * i) + j;
						maxJoltageFound = true;
						break;
					}
				}
			}
			if(maxJoltageFound) break;
		}
	}

	displayCaption(`The total joltage you can get is ${totalJoltage}.`);
}