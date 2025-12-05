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
}