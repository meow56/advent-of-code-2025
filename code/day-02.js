"use strict";

function day02(input) {
	const FILE_REGEX = /(\d+)-(\d+)/g;
	let entry;
	let ranges = [];
	while(entry = FILE_REGEX.exec(input)) {
		ranges.push([+entry[1], +entry[2]]);
	}

	let sum = 0;
	let sum2 = 0;
	for(let range of ranges) {
		for(let i = range[0]; i <= range[1]; i++) {
			let len = i.toString().length;
			if(len % 2 === 0) {
				let firstHalf = i.toString().slice(0, len / 2);
				let secondHalf = i.toString().slice(len / 2);
				if(firstHalf === secondHalf) {
					sum += i;
				}
			}

			let strI = i.toString();
			for(let cutSize = 1; cutSize < len; cutSize++) {
				if(len % cutSize !== 0) continue;
				let base = strI.slice(0, cutSize);
				let sillyID = true;
				for(let j = cutSize; j < len; j += cutSize) {
					let testCut = strI.slice(j, j + cutSize);
					if(testCut !== base) {
						sillyID = false;
						break;
					}
				}
				if(sillyID) {
					sum2 += i;
					break;
				}
			}
		}
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The sum2 is ${sum2}.`);
}