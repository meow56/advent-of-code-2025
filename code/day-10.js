"use strict";

function day10(input) {
// 	input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
// [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
// [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`
	// 21936 too low
	// 25903 too high
	// 26051 too high
	const FILE_REGEX = /\[([.#]+)\] ((?:\((?:\d+,?)+\) ?)+) {((?:\d+,?)+)}/g;
	let entry;
	let machines = [];
	while(entry = FILE_REGEX.exec(input)) {
		let target = entry[1];
		target = target.split("").map(e => +(e === "#")).toReversed().join("");
		target = parseInt(target, 2);
		let buttons = entry[2].split(" ");
		buttons = buttons.map(e => e.slice(1, -1));
		buttons = buttons.map(e => e.split(","));
		buttons = buttons.map(e => e.map(elem => 2 ** +elem));
		buttons = buttons.map(e => e.reduce((acc, val) => acc + val));
		let joltages = entry[3];
		joltages = joltages.split(",").map(e => +e);
		let buttons2 = buttons.map(e => e.toString(2).padStart(joltages.length, "0").split("").map(el => BigInt(el)).toReversed());
		machines.push([target, buttons, joltages, buttons2]);
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

	const ENABLE_DISPLAY = false;
	function displayMatrix(matrix, representsOne) {
		if(!ENABLE_DISPLAY) return;
		console.log();
		for(let row of matrix) {
			console.log(row.map(e => e.toString().padStart(4, " ")).join(" "));
		}
		console.log(`1 = ${representsOne}`);
	}

	function minSimplex(matrix, representsOne = 1n) {
		let visited = [];
		while(matrix[matrix.length - 1].some((e, index, arr) => e > 0n && index !== arr.length - 1)) {
			let mapKey = matrix[matrix.length - 1].slice();
			let mapGCF = gcf([...mapKey, representsOne]);
			mapKey = mapKey.map(e => e / mapGCF).join();
			if(visited.includes(mapKey)) break;
			visited.push(mapKey);
			displayMatrix(matrix, representsOne);
			let maxVal = 0n;
			let pivotColumn;
			for(let i = 0; i < matrix[0].length - 1; i++) {
				if(matrix[matrix.length - 1][i] > maxVal) {
					maxVal = matrix[matrix.length - 1][i];
					pivotColumn = i;
				}
			}

			let minQuotient = [10000000000n * representsOne, 1n];
			let pivotRow;
			for(let i = 0; i < matrix.length - 1; i++) {
				let quotient = [matrix[i][matrix[i].length - 1], matrix[i][pivotColumn]];
				if(quotient[1] <= 0n) continue;
				if(quotient[0] * minQuotient[1] < quotient[1] * minQuotient[0]) {
					minQuotient = quotient;
					pivotRow = i;
				}
			}

			let pivot = matrix[pivotRow][pivotColumn];
			if(ENABLE_DISPLAY) console.log(`Pivot (${pivotColumn}, ${pivotRow}): ${pivot}`);
			for(let i = 0; i < matrix.length; i++) {
				if(i === pivotRow) continue;
				let ratio = matrix[i][pivotColumn];
				matrix[i] = matrix[i].map(e => e * pivot);
				for(let j = 0; j < matrix[i].length; j++) {
					matrix[i][j] -= matrix[pivotRow][j] * ratio;
				}
			}
			representsOne *= pivot;
			for(let i = 0; i < matrix[pivotRow].length; i++) {
				matrix[pivotRow][i] *= representsOne / pivot;
			}

			let grandDivisor = gcf([...matrix.map(e => gcf(e.slice())), representsOne]);
			matrix = matrix.map(e => e.map(el => el / grandDivisor));
			representsOne /= grandDivisor;
		}
		if(matrix[matrix.length - 1].some((e, index, arr) => e > 0n && index !== arr.length - 1)) {
			// Unsolvable (probably).
			return [1n, false];
		}
		displayMatrix(matrix, representsOne);
		let grandDivisor = gcf([...matrix.map(e => gcf(e.slice())), representsOne]);
		matrix = matrix.map(e => e.map(el => el / grandDivisor));
		representsOne /= grandDivisor;
		displayMatrix(matrix, representsOne);
		return [representsOne, matrix];
	}

	function linearSolver(target, buttons, constraints = [], currentUpperBound = 1000000000000n) {
		let targetCopy = target.slice();
		let buttonsCopy = buttons.slice();
		let minSum = 0n;
		for(let i = 0; i < buttons.length; i++) {
			let lowerBounds = constraints.filter(e => e[0] === i && e[1] === ">=");
			let trueLowerBound = 0n;
			for(let bound of lowerBounds) {
				if(bound[2] > trueLowerBound) trueLowerBound = bound[2];
			}
			minSum += trueLowerBound;
		}
		if(minSum >= currentUpperBound) return 1000000000n;
		// Create the matrix/tableau that represents the minimization problem.
		let matrix = target.map(e => new Array());
		let numArtificial = 0;
		for(let i = 0; i < matrix.length; i++) {
			for(let button of buttons) {
				matrix[i].push(button[i]);
			}
		}
		for(let j = 0; j < constraints.length; j++) {
			// [Button, ">="|"<=", Value]
			let constraint = constraints[j];
			// Add a new constraint with the button variable.
			//matrix.push(matrix[0].map(e => 0n));
			for(let i = 0; i < matrix[matrix.length - 1].length; i++) {
				if(constraint[0] === i) {
					matrix[matrix.length - constraints.length + j][i] = 1n;
				} else {
					matrix[matrix.length - constraints.length + j][i] = 0n;
				}
			}
			// We always introduce a slack variable to turn this constraint into equality.
			for(let i = 0; i < matrix.length; i++) {
				if(i === matrix.length - constraints.length + j) {
					matrix[i].push(constraint[1] === ">=" ? -1n : 1n);
				} else {
					matrix[i].push(0n);
				}
			}
			if(constraint[1] === ">=") {
				// If it's >=, we need to add an artificial variable as well.
				// for(let i = 0; i < matrix.length; i++) {
				// 	if(i === matrix.length - constraints.length + j) {
				// 		matrix[i].push(1n);
				// 	} else {
				// 		matrix[i].push(0n);
				// 	}
				// }
			} 
		}
		matrix.push(matrix[0].map((e, index) => index < buttons.length ? -1n : 0n));

		// Yo, I heard you like simplex tableaus, so I put a
		// simplex tableau in your simplex tableau so you can
		// simplex while you simplex.

		// (We need a canonical simplex to solve the original
		// problem, and the way to do that is to solve
		// another simplex problem.)
		matrix.push(matrix[0].map(e => 0n));
		for(let i = 0; i < matrix.length - 2; i++) {
			for(let j = 0; j < matrix.length - 2; j++) {
				if(i === j) {
					numArtificial++;
					matrix[j].push(1n);
					matrix[matrix.length - 1].push(-1n);
					matrix[matrix.length - 2].push(0n);
				} else {
					matrix[j].push(0n);
				}
			}
		}
		matrix[matrix.length - 2].push(0n);
		matrix[matrix.length - 1].push(0n);

		// Add in the targets at the end.
		for(let i = 0; i < matrix.length - 2; i++) {
			matrix[i].push(BigInt(target[i]));
		}

		// Update the bottom row so the artificial vars aren't zero.
		for(let i = 0; i < matrix.length - 2; i++) {
			for(let j = 0; j < matrix[i].length; j++) {
				matrix[matrix.length - 1][j] += matrix[i][j];
			}
		}

		// Solve this matrix to obtain basic form of original problem.
		let representsOne;
		[representsOne, matrix] = minSimplex(matrix.map(e => e.slice()));
		if(!matrix) {
			return 1000000000n;
		}

		// Remove artificial variables so we can solve the original problem.
		for(let i = 0; i < matrix.length; i++) {
			matrix[i].splice(-1 - numArtificial, numArtificial);
		}
		matrix.pop();

		let grandDivisor = gcf([...matrix.map(e => gcf(e.slice())), representsOne]);
		matrix = matrix.map(e => e.map(el => el / grandDivisor));
		representsOne /= grandDivisor;
		displayMatrix(matrix, representsOne);

		// Actually solve the original problem.
		[representsOne, matrix] = minSimplex(matrix, representsOne);
		if(!matrix) {
			return 1000000000n;
		}

		displayMatrix(matrix, representsOne);
		let lastColumn = [];
		for(let row of matrix) {
			lastColumn.push(row[row.length - 1]);
		}
		let finalDivisor = gcf(lastColumn.slice());
		if(representsOne > finalDivisor) {
			// You thought we were done?
			// Sadly, something in the answer is a fraction.
			// (The last column contains the values of the vars and the minimum value.)
			// How do we fix this?
			// Of course, the answer is... more simplex!

			// For every fractional value n for button x_i, 
			// we split the simplex in two:
			// one where there is an extra constraint x_i <= floor(n),
			// and one where the extra constraint is  x_i >= ceil(n).
			// Then we just keep splitting until we find the optimal solution.
			for(let i = 0; i < lastColumn.length; i++) {
				if(gcf([lastColumn[i], representsOne]) !== representsOne) {
					// Fraction spotted. We need to know which button it is.
					let constrainedButton;
					for(let j = 0; j < matrix[i].length; j++) {
						if(matrix[i][j] === representsOne) {
							let isPivot = true;
							for(let k = 0; k < matrix.length; k++) {
								if(k === i) continue;
								if(matrix[k][j] !== 0n) isPivot = false;
							}
							if(isPivot) {
								constrainedButton = j;
								break;
							}
						}
					}
					if(constrainedButton >= buttons.length || constrainedButton === undefined) continue;
					let greaterConstraint = [constrainedButton, ">=", (lastColumn[i] / representsOne) + 1n];
					let greaterImpossible = constraints.some(e => 
						(e[0] === greaterConstraint[0] && e[1] === ">=" && e[2] >= greaterConstraint[2])
						|| (e[0] === greaterConstraint[0] && e[1] === "<=" && e[2] < greaterConstraint[2])
					);
					let lesserConstraint = [constrainedButton, "<=", lastColumn[i] / representsOne];
					let lesserImpossible = constraints.some(e => 
						(e[0] === lesserConstraint[0] && e[1] === "<=" && e[2] <= lesserConstraint[2])
						|| (e[0] === greaterConstraint[0] && e[1] === ">=" && e[2] > greaterConstraint[2]));
					let greaterMin = greaterImpossible ? 100000000000n : linearSolver([...targetCopy, greaterConstraint[2]], buttonsCopy, [...constraints, greaterConstraint], currentUpperBound);
					if(greaterMin < currentUpperBound) currentUpperBound = greaterMin;
					let lesserMin = lesserImpossible ? 100000000000n : linearSolver([...targetCopy, lesserConstraint[2]], buttonsCopy, [...constraints, lesserConstraint], currentUpperBound);
					if(greaterMin < lesserMin) {
						return greaterMin;
					} else {
						return lesserMin;
					}
				}
			}
		} 
		return lastColumn[lastColumn.length - 1] / representsOne;
	}
	function SoESolver(target, buttons) {
		// We have the system of equations p1(B1) + p2(B2) + p3(B3) + ... = target
		let matrix = target.map(e => new Array());
		for(let button of buttons) {
			for(let i = 0; i < button.length; i++) {
				matrix[i].push(button[i]);
			}
		}
		for(let i = 0; i < target.length; i++) {
			matrix[i].push(BigInt(target[i]));
		}
		wikipediaSolver(matrix);
		console.log(matrix.slice());

		return rowEchelonReduction(matrix);
	}

	// Thank you Wikipedia for having pseudocode on this thing.
	// I bet a lot of people are hitting that page now...
	function wikipediaSolver(matrix) {
		let pivotRow = 0;
		let pivotColumn = 0;
		while(pivotRow < matrix.length && pivotColumn < matrix[0].length) {
			let maxPivot = -Infinity;
			let maxPivotIndex;
			for(let i = pivotRow; i < matrix.length; i++) {
				let pivotVal = matrix[i][pivotColumn] < 0n ? -1n * matrix[i][pivotColumn] : matrix[i][pivotColumn];
				if(pivotVal > maxPivot) {
					maxPivot = pivotVal;
					maxPivotIndex = i;
				}
			}

			maxPivot = maxPivotIndex; // Refactoring, ho!

			if(matrix[maxPivot][pivotColumn] === 0n) {
				pivotColumn++;
				continue;
			}

			let temp = matrix[maxPivot];
			matrix[maxPivot] = matrix[pivotRow];
			matrix[pivotRow] = temp;
			for(let i = pivotRow + 1; i < matrix.length; i++) {
				let ratio = matrix[i][pivotColumn];
				matrix[i][pivotColumn] = 0n;
				for(let j = pivotColumn + 1; j < matrix[i].length; j++) {
					matrix[i][j] *= matrix[pivotRow][pivotColumn]
					matrix[i][j] -= matrix[pivotRow][j] * ratio;
				}
			}
			pivotRow++;
			pivotColumn++;
		}
		return matrix;
	}

	function rowEchelonReduction(matrix) {
		for(let i = 0; i < matrix.length; i++) {
			let leading = 0n;
			let leadIndex;
			for(let j = 0; j < matrix[i].length; j++) {
				if(matrix[i][j] !== 0n) {
					leading = matrix[i][j];
					leadIndex = j;
					break;
				}
			}
			if(leading === 0n) continue;
			for(let j = 0; j < i; j++) {
				let valThere = matrix[j][leadIndex];
				if(valThere === 0n) continue;
				let ratio = valThere;
				for(let k = 0; k < matrix[i].length; k++) {
					matrix[j][k] *= leading;
					matrix[j][k] -= matrix[i][k] * ratio;
				}
			}
		}

		for(let i = 0; i < matrix.length; i++) {
			let leading = 0n;
			for(let j = 0; j < matrix[i].length; j++) {
				if(matrix[i][j] !== 0n) {
					leading = matrix[i][j];
					break;
				}
			}
			let greatestDivisor = gcf(matrix[i].filter(e => e !== 0n));
			if(leading < 0n) greatestDivisor *= -1n;
			for(let j = 0; j < matrix[i].length; j++) {
				matrix[i][j] /= greatestDivisor;
			}
		}
		return matrix;
	}

	function gcf(values) {
		if(values.length < 2) return values[0] ?? 1n;
		if(values.length !== 2) values[1] = gcf(values.slice(1));
		let a = values[0] < 0 ? -values[0] : values[0];
		let b = values[1] < 0 ? -values[1] : values[1];
		while(b !== 0n) {
			let temp = b;
			b = a % b;
			a = temp;
		}
		return a;
	}

	let totalPresses = 0;
	let totalSecondPresses = 0n;
	for(let machine of machines) {
		console.log(`Doing ${machine[2]}`);
		let presses = BFS(machine[0], machine[1]);
		totalPresses += presses;

		//if(machine[2].join() !== "183,186,153,191,181,205,55,66,166,69") continue;
		let secondPresses = linearSolver(machine[2], machine[3]);
		console.log(secondPresses);
		totalSecondPresses += secondPresses;
		//break;
	}

	displayCaption(`The total number of presses is ${totalPresses}.`);
	displayCaption(`The total number of joltage presses is ${totalSecondPresses}.`);
}