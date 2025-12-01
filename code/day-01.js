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

	assignPane('part1', 'Part 1');
	assignPane('part2', 'Part 2');
	displayToPane('part1', 'START     -> 50');
	displayToPane('part2', 'START     -> 50');

	let pos = 50;
	let otherPos = 50;
	let numZeros = 0;
	let secondZeros = 0;
	for(let move of moves) {
		pos = mod(pos + move, 100);
		let p1Text = (move < 0 ? `LEFT ` : `RIGHT`) + ` ${((Math.abs(move)).toString()).padStart(3, ' ')} -> ${pos.toString().padStart(2, '0')}`;
		if(pos === 0) {
			numZeros++;
			p1Text += ` [${numZeros}]`;
		}
		displayToPane('part1', p1Text);

		let newPos = otherPos + move;
		let totalZeroClicks = 0;
		if(otherPos === 0 && move < 0) totalZeroClicks--;
		while(newPos < 0) {
			newPos += 100;
			totalZeroClicks++;
		}
		if(newPos === 0) totalZeroClicks++;
		while(newPos > 99) {
			newPos -= 100;
			totalZeroClicks++;
		}
		secondZeros += totalZeroClicks;
		otherPos = newPos;
		let p2Text = (move < 0 ? `LEFT ` : `RIGHT`) + ` ${((Math.abs(move)).toString()).padStart(3, ' ')} -> ${otherPos.toString().padStart(2, '0')}`;
		if(totalZeroClicks !== 0) {
			p2Text += ` (${totalZeroClicks < 10 ? " " : ""}+${totalZeroClicks}) [${secondZeros}]`;
		}
		displayToPane('part2', p2Text);
	}
	if(otherPos === 0) secondZeros++;
	displayCaption(`The number of zeros is ${numZeros}.`);
	displayCaption(`The number of zeros using password method CLICK is ${secondZeros}.`);
	displayCaption(`The commands are displayed.`);
	displayCaption(`Click the buttons to switch between parts 1 and 2.`);
	displayCaption(`Numbers in [] indicate the total zeros so far.`);
	displayCaption(`Numbers in () indicate how many zeros were added in this command.`);
}