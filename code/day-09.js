"use strict";

function day09(input) {
	const FILE_REGEX = /(\d+),(\d+)/g;
	let entry;
	let redTiles = [];
	while(entry = FILE_REGEX.exec(input)) {
		redTiles.push([+entry[1], +entry[2]]);
	}

	let horizLines = [];
	let vertLines = [];
	for(let i = 0; i < redTiles.length; i++) {
		let thisOne = redTiles[i];
		let nextOne = redTiles[(i + 1) % redTiles.length];
		if(thisOne[0] === nextOne[0]) {
			let minY = Math.min(thisOne[1], nextOne[1]);
			let maxY = Math.max(thisOne[1], nextOne[1]);
			vertLines.push([thisOne[0], minY, maxY]);
		} else {
			let minX = Math.min(thisOne[0], nextOne[0]);
			let maxX = Math.max(thisOne[0], nextOne[0]);
			horizLines.push([thisOne[1], minX, maxX]);
		}
	}

	let maxArea = 0;
	let maxGreenArea = 1;
	for(let tile1 of redTiles) {
		for(let tile2 of redTiles) {
			let area = Math.abs(tile1[0] - tile2[0] + 1) * Math.abs(tile1[1] - tile2[1] + 1);
			if(area > maxArea) maxArea = area;

			let minX = Math.min(tile1[0], tile2[0]);
			let maxX = Math.max(tile1[0], tile2[0]);
			let minY = Math.min(tile1[1], tile2[1]);
			let maxY = Math.max(tile1[1], tile2[1]);
			let greenArea = (maxX - minX + 1) * (maxY - minY + 1);
			if(greenArea <= maxGreenArea) continue;

			let aboveCheck = vertLines.filter(v => v[0] > minX && v[0] < maxX);
			let aboveOK = true;
			for(let vert of aboveCheck) {
				if((maxY > vert[1] && maxY < vert[2]) || maxY === vert[2]) {
					aboveOK = false;
					break;
				}
			}
			if(!aboveOK) continue;

			let belowCheck = vertLines.filter(v => v[0] > minX && v[0] < maxX);
			let belowOK = true;
			for(let vert of belowCheck) {
				if((minY > vert[1] && minY < vert[2]) || minY === vert[1]) {
					belowOK = false;
					break;
				}
			}
			if(!belowOK) continue;

			let leftCheck = horizLines.filter(h => h[0] > minY && h[0] < maxY);
			let leftOK = true;
			for(let hori of leftCheck) {
				if((minX > hori[1] && minX < hori[2]) || minX === hori[1]) {
					leftOK = false;
					break;
				}
			}
			if(!leftOK) continue;

			let rightCheck = horizLines.filter(h => h[0] > minY && h[0] < maxY);
			let rightOK = true;
			for(let hori of rightCheck) {
				if((maxX > hori[1] && maxX < hori[2]) || maxX === hori[2]) {
					rightOK = false;
					break;
				}
			}
			if(!rightOK) continue;
			
			let insidePoint = [minX + 1, minY + 1];
			let insideHoris = horizLines.filter(h => h[0] < insidePoint[1] && h[1] <= insidePoint[0] && h[2] >= insidePoint[0]);
			insideHoris.sort((a, b) => b[0] - a[0]);
			let intersections = 0;
			let lastIntersection = undefined;
			for(let hori of insideHoris) {
				if(insidePoint[0] === hori[1]) {
					if(lastIntersection) {
						if(lastIntersection !== 1) intersections++;
						lastIntersection = undefined;
					} else {
						lastIntersection = 1;
					}
				} else if(insidePoint[0] === hori[2]) {
					if(lastIntersection) {
						if(lastIntersection !== 2) intersections++;
						lastIntersection = undefined;
					} else {
						lastIntersection = 2;
					}
				} else {
					intersections++;
				}
			}

			if(intersections % 2 === 0) continue;
			maxGreenArea = greenArea;
		}
	}

	displayCaption(`The max area is ${maxArea}.`);
	displayCaption(`The max green area is ${maxGreenArea}.`);
}