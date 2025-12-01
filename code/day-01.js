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
	let otherPos = 50;
	let numZeros = 0;
	let secondZeros = 0;
	for(let move of moves) {
		pos = mod(pos + move, 100);
		if(pos === 0) {
			numZeros++;
		}

		let newPos = otherPos + move;
		if(otherPos === 0 && move < 0) secondZeros--;
		while(newPos < 0) {
			newPos += 100;
			secondZeros++;
		}
		if(newPos === 0) secondZeros++;
		while(newPos > 99) {
			newPos -= 100;
			secondZeros++;
		}
		otherPos = newPos;
	}
	if(otherPos === 0) secondZeros++;
	displayCaption(`The number of zeros is ${numZeros}.`);
	displayCaption(`The number of 0x434C49434B zeros is ${secondZeros}.`);
}