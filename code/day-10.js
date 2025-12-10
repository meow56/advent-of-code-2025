"use strict";

function day10(input) {
	const FILE_REGEX = /\[([.#]+)\] ((?:\((?:\d+,?)+\) ?)+) {((?:\d+,?)+)}/g;
	let entry;
	let machines = [];
	while(entry = FILE_REGEX.exec(input)) {
		let buttons = entry[2].split(" ");
		buttons = buttons.map(e => e.slice(1, -1));
		buttons = buttons.map(e => e.split(","));
		buttons = buttons.map(e => e.map(elem => 2 ** +elem));
		buttons = buttons.map(e => e.reduce((acc, val) => acc + val));
		let target = entry[1];
		target = target.split("").map(e => +(e === "#")).toReversed().join("");
		target = parseInt(target, 2);
		machines.push([target, buttons]);
	}

	function BFS(target, buttons) {
		let startPos = 0;
		let toExplore = [[startPos, 0]];
		let explored = [];
		while(toExplore.length !== 0) {
			let next = toExplore.shift();
			if(next[0] === target) return next[1];
			if(explored.includes(next[0])) continue;
			for(let button of buttons) {
				let neighbor = next[0] ^ button;
				toExplore.push([neighbor, next[1] + 1]);
			}
			explored.push(next[0]);
		}
	}

	let totalPresses = 0;
	for(let machine of machines) {
		console.log(`Doing ${machine}`);
		let presses = BFS(...machine);
		totalPresses += presses;
	}

	displayCaption(`The total number of presses is ${totalPresses}.`);
}