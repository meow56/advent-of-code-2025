"use strict";

function day05(input) {
	const FILE_REGEX = /(\d+-\d+)|(^\d+$)/gm;
	let entry;
	let ranges = [];
	let ingredients = [];
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[1]) {
			ranges.push(entry[1].split("-").map(e => +e));
		}

		if(entry[2]) {
			ingredients.push(+entry[2]);
		}
	}

	let freshCount = 0;
	for(let ingredient of ingredients) {
		if(ranges.some(range => ingredient >= range[0] && ingredient <= range[1])) {
			freshCount++;
		}
	}
	displayCaption(`The number of fresh ingredients is ${freshCount}.`);

	let stillMerging = true;
	while(stillMerging) {
		stillMerging = false;
		let newRanges = [];
		let mergedRanges = [];
		for(let range of ranges) {
			if(mergedRanges.includes(range)) continue;
			let merged = false;
			for(let range2 of ranges) {
				if(mergedRanges.includes(range2)) continue;
				if(range === range2) continue;
				if(range[0] >= range2[0] && range[0] <= range2[1]) {
					merged = true;
					stillMerging = true;
					mergedRanges.push(range, range2);
					newRanges.push([range2[0], Math.max(range[1], range2[1])]);
					break;
				}
				if(range[1] >= range2[0] && range[1] <= range2[1]) {
					merged = true;
					stillMerging = true;
					mergedRanges.push(range, range2);
					newRanges.push([range[0], range2[1]]);
					break;
				}
			}
			if(!merged) {
				newRanges.push(range);
			}
		}
		ranges = newRanges;
	}

	let unspoiledIDs = 0;
	for(let range of ranges) {
		unspoiledIDs += range[1] - range[0] + 1;
	}

	displayCaption(`The total number of unspoiled IDs is ${unspoiledIDs}.`);
}