"use strict";

function day01(input) {
	const FILE_REGEX = /(L|R)(\d+)/g;
	let entry;
	let moves = [];
	while(entry = FILE_REGEX.exec(input)) {
		moves.push(entry[1] === "L" ? -entry[2] : +entry[2]);
	}

	function mod(x, base) {
		return ((x % base) + base) % base;
	}

	let pos = 50;
	let numZeros = 0;
	for(let move of moves) {
		pos = mod(pos + move, 100);
		if(pos === 0) {
			numZeros++;
		}
	}
	displayCaption(`The number of zeros is ${numZeros}.`);
}