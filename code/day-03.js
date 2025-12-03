"use strict";

function day03(input) {
	const FILE_REGEX = /(\d+)/g;
	let entry;
	let lines = [];
	while(entry = FILE_REGEX.exec(input)) {
		lines.push(entry[1]);
	}

	function maxNum(line, numDigits = 12, number = "", indices = [], offset = 0) {
		if(numDigits === 0) return [number, indices];
		for(let i = 9; i >= 0; i--) {
			let firstIndex = line.indexOf(i);
			if(firstIndex !== -1 && firstIndex <= line.length - numDigits) {
				return maxNum(line.slice(firstIndex + 1), numDigits - 1, number + i, [...indices, firstIndex + offset], offset + firstIndex + 1);
			}
		}
	}

	assignPane('p1', 'Normal Joltage');
	assignPane('p2', '"Yes, I\'m Sure" Joltage');
	function styleLine(line, indices) {
		let returnVal = `<span class='invert'>`;
		for(let i = 0; i < line.length; i++) {
			if(indices.includes(i)) {
				returnVal += `</span><span class='yellow'>${line[i]}</span><span class='invert'>`;
			} else {
				returnVal += line[i];
			}
		}
		returnVal += `</span>`;
		return returnVal;
	}

	let totalJoltage = 0;
	let totalOverJoltage = 0;
	for(let line of lines) {
		let result = maxNum(line, 2);
		totalJoltage += +result[0];
		let styledLine = styleLine(line, result[1]);
		displayToPane('p1', `${styledLine}: ${result[0]}`);

		let yeahSureResult = maxNum(line);
		let styledSureLine = styleLine(line, yeahSureResult[1]);
		totalOverJoltage += +yeahSureResult[0];
		displayToPane('p2', `${styledSureLine}: ${yeahSureResult[0]}`);
	}

	displayCaption(`The total joltage you can get is ${totalJoltage}.`);
	displayCaption(`The total super safe joltage you can get is ${totalOverJoltage}.`);
	displayCaption(`The battery banks are shown.`);
	displayCaption(`The banks to turn on are highlighted in yellow.`);
	displayCaption(`Switch between parts 1 and 2 using the pane swap buttons.`);
}