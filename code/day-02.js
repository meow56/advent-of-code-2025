"use strict";

function day02(input) {
	const FILE_REGEX = /(\d+)-(\d+)/g;
	let entry;
	let ranges = [];
	while(entry = FILE_REGEX.exec(input)) {
		ranges.push([+entry[1], +entry[2]]);
	}

	let sum = 0;
	for(let range of ranges) {
		for(let i = range[0]; i <= range[1]; i++) {
			let len = i.toString().length;
			if(len % 2 !== 0) continue;
			let firstHalf = i.toString().slice(0, len / 2);
			let secondHalf = i.toString().slice(len / 2);
			if(firstHalf === secondHalf) {
				console.log(i);
				sum += i;
			}
		}
	}
	displayCaption(`The sum is ${sum}.`);
}