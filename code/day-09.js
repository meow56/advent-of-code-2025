"use strict";

function day09(input) {
	const FILE_REGEX = /(\d+),(\d+)/g;
	let entry;
	let redTiles = [];
	while(entry = FILE_REGEX.exec(input)) {
		redTiles.push([+entry[1], +entry[2]]);
	}

	let maxArea = 0;
	for(let tile1 of redTiles) {
		for(let tile2 of redTiles) {
			let area = Math.abs(tile1[0] - tile2[0] + 1) * Math.abs(tile1[1] - tile2[1] + 1);
			if(area > maxArea) maxArea = area;
		}
	}

	displayCaption(`The max area is ${maxArea}.`);
}