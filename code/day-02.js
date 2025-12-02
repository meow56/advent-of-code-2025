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
	let sillyP1 = new Map();
	let sillyP2 = new Map();
	for(let range of ranges) {
		const RANGE_KEY = range.join("-");
		sillyP1.set(RANGE_KEY, []);
		sillyP2.set(RANGE_KEY, []);
		for(let i = range[0]; i <= range[1]; i++) {
			let strI = i.toString();
			let len = strI.length;
			if(len % 2 === 0) {
				let firstHalf = strI.slice(0, len / 2);
				let secondHalf = strI.slice(len / 2);
				if(firstHalf === secondHalf) {
					sum += i;
					sillyP1.get(RANGE_KEY).push(i);
				}
			}

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
					sillyP2.get(RANGE_KEY).push(i);
					break;
				}
			}
		}
	}
	displayCaption(`The sum of silly IDs is ${sum}.`);
	displayCaption(`The sum of even sillier IDs is ${sum2}.`);
	displayCaption(`The list of every silly ID is displayed.`);
	displayCaption(`Switch to the siller pane to see all part 2 IDs.`);

	assignPane('p1', 'Silly');
	assignPane('p2', 'Sillier');

	for(let [range, ids] of sillyP1.entries()) {
		let toDisplay = `${range}: `;
		if(ids.length === 0) {
			toDisplay += 'N/A';
		} else {
			toDisplay += ids.join(', ');
		}

		displayToPane('p1', toDisplay);
	}

	for(let [range, ids] of sillyP2.entries()) {
		let toDisplay = `${range}: `;
		if(ids.length === 0) {
			toDisplay += 'N/A';
		} else {
			toDisplay += ids.join(', ');
		}

		displayToPane('p2', toDisplay);
	}
}