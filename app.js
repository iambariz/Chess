class Board {
	constructor() {
		const board = document.createElement("div");
		board.classList.add("board");
		document.body.appendChild(board);
		this.activeFigures = [[], []];
	}
	generate() {
		let counter = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (i % 2 == 0) {
					if (j % 2 == 0) {
						//white
						this.createZone("#ccb083", counter);
					} else {
						//black
						this.createZone("#573a2e", counter);
					}
				} else {
					if (j % 2 != 0) {
						//white
						this.createZone("#ccb083", counter);
					} else {
						//black
						this.createZone("#573a2e", counter);
					}
				}
				counter++;
			}
		}
		const board = document.querySelector(".board");
		const display = document.createElement("div");
		display.classList.add("display");
		display.textContent = "White's turn";
		board.appendChild(display);
	}

	createZone(color, id) {
		const board = document.querySelector(".board");
		const div = document.createElement("div");
		div.style.backgroundColor = color;
		div.dataset.id = id;
		div.classList.add("zone");
		board.appendChild(div);
	}

	static removeFigure(cordinate, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (cordinate == arr[i].position) {
				arr.splice(i, 1);
			}
		}
	}

	static toggleRound() {
		const display = document.querySelector(".display");
		if (turn == "white") {
			display.textContent = "Black's turn";
			turn = "black";
		} else {
			display.textContent = "White's turn";
			turn = "white";
		}
	}

	//activeFigures = [];
}

class Figure {
	constructor(x, y, img, color) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.img = img;
		this.active = false;
		if (this.color == "white") {
			boardObj.activeFigures[0].push(this);
		} else {
			boardObj.activeFigures[1].push(this);
		}
	}

	get position() {
		return (this.y - 1) * 8 + this.x;
	}

	//Check if array contains the targeted zone
	exists(arr, search) {
		let excist = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][0] == search[0] && arr[i][1] == search[1]) {
				excist = true;
				break;
			}
		}
		return excist;
	}

	move(active, element, e) {
		e.stopPropagation();
		//Prevent multiple listeners
		if (e.currentTarget == active) {
			return;
		} else {
			//The magic happens here
			let cordinate = e.currentTarget.dataset.id;
			let newX = (cordinate % 8) + 1;
			let newY = 0;
			if (Math.floor(cordinate / 8) == 0) {
				newY = 1;
			} else {
				newY = Math.floor(cordinate / 8) + 1;
			}
			const checker = this.moveChecker(newX, newY, e);
			if (checker == true) {
				this.x = newX;
				this.y = newY;
				zones[this.position - 1].appendChild(element);
				element.classList.remove("active");
				zones.forEach((zone) => {
					zone.removeEventListener("click", prefix);
				});
				selected = false;
				Board.toggleRound();
			} else {
				//Failed movement
				return;
			}
		}
	}
	//Display, getting called straight away, and also
	//Attaches the click event
	display() {
		const figure = document.createElement("i");
		figure.classList.add("fas", `fa-chess-${this.img}`, this.color);
		zones[this.position - 1].appendChild(figure);
		let obj = this;
		//Basic move handler below
		figure.addEventListener("click", function (e) {
			if (obj.color == turn) {
				if (selected == false) {
					selected = true;
					figure.classList.add("active");
					this.active = true;
					active = this.parentNode;
					const zones = document.querySelectorAll(".zone");
					//OBJ = Object, Active = Zone, Figure = Figure element
					prefix = obj.move.bind(obj, active, figure);
					zones.forEach((zone) => {
						zone.addEventListener("click", prefix);
					});
					//If player clicks on something, what's the same color as the last el
				} else if (e.currentTarget.classList.contains(obj.color)) {
					active.childNodes[0].classList.remove("active");
					zones.forEach((zone) => {
						zone.removeEventListener("click", prefix);
					});
					active = e.currentTarget.parentNode;
					let figure = e.currentTarget;
					figure.classList.add("active");
					//When changing figures, it re binds the moving functionn
					if (obj.color == "white") {
						for (let i = 0; i < boardObj.activeFigures[0].length; i++) {
							const element = boardObj.activeFigures[0][i];
							if (element.position == parseInt(active.dataset.id) + 1) {
								prefix = element.move.bind(element, active, figure);
								zones.forEach((zone) => {
									zone.addEventListener("click", prefix);
								});
							}
						}
					} else if (obj.color == "black") {
						for (let i = 0; i < boardObj.activeFigures[1].length; i++) {
							const element = boardObj.activeFigures[1][i];
							if (element.position == parseInt(active.dataset.id) + 1) {
								prefix = element.move.bind(element, active, figure);
								zones.forEach((zone) => {
									zone.addEventListener("click", prefix);
								});
							}
						}
					}
					// prefix = obj.move.bind(obj, active, figure); Not working currently
				}
			}
		});
	}
}

class Pawn extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
	}

	moveChecker(newX, newY, e) {
		const target = e.currentTarget;
		//Move functions
		if (this.color == "white") {
			if (this.y - 1 == newY && this.x == newX) {
				if (target.childNodes.length < 1) {
					return true;
				}
			} else if (
				(this.y - 1 == newY && this.x + 1 == newX) ||
				(this.x - 1 == newX && this.y - 1 == newY)
			) {
				if (target.childNodes[0].classList.contains("black")) {
					let cordinate = e.currentTarget.dataset.id;
					Board.removeFigure(
						parseInt(cordinate) + 1,
						boardObj.activeFigures[1]
					);
					target.removeChild(target.childNodes[0]);
					selected = false;
					return true;
				}
			} else {
				return false;
			}
		}
		if (this.color == "black") {
			if (this.y + 1 == newY && this.x == newX) {
				if (target.childNodes.length < 1) {
					return true;
				}
			} else if (
				(this.y + 1 == newY && this.x + 1 == newX) ||
				(this.y + 1 == newY && this.x - 1 == newX)
			) {
				if (target.childNodes[0].classList.contains("white")) {
					let cordinate = e.currentTarget.dataset.id;
					Board.removeFigure(
						parseInt(cordinate) + 1,
						boardObj.activeFigures[0]
					);
					target.removeChild(target.childNodes[0]);
					return true;
				}
			} else {
				return false;
			}
		}
	}
}

class Bishop extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
	}

	//Get avaliable zones
	avaliableZones() {
		let avaliableSteps = [];
		//X+ Y-
		let xCounter = this.x;
		let yCounter = this.y;
		// console.log(this.x, this.y);
		while (xCounter < 8 && yCounter > 1) {
			xCounter++;
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X+ Y+
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter < 8 && yCounter < 8) {
			xCounter++;
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X- Y-
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter > 1 && yCounter > 1) {
			xCounter--;
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X- Y+
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter > 1 && yCounter < 8) {
			xCounter--;
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		return avaliableSteps;
	}

	//Check the amount of zones between the current and target
	checkZone(current, target) {
		// let zonesBetween = Math.abs(Math.abs(current[0]) - Math.abs(target[0])) - 1;
		let xDir;
		let yDir;
		let scanZone = [current[0], current[1]];
		let succesFull = true;

		if (target[0] > current[0]) {
			xDir = "plus";
		} else {
			xDir = "minus";
		}
		if (target[1] > current[1]) {
			yDir = "plus";
		} else {
			yDir = "minus";
		}
		// console.log("in");
		if (xDir == "plus" && yDir == "plus") {
			while (true) {
				scanZone[0]++;
				scanZone[1]++;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}

		if (xDir == "minus" && yDir == "minus") {
			while (true) {
				scanZone[0]--;
				scanZone[1]--;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		if (xDir == "minus" && yDir == "plus") {
			while (true) {
				scanZone[0]--;
				scanZone[1]++;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		if (xDir == "plus" && yDir == "minus") {
			while (true) {
				scanZone[0]++;
				scanZone[1]--;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		return succesFull;
	}

	//Moving engine
	moveChecker(newX, newY, e) {
		const target = e.currentTarget;
		let zones = this.avaliableZones();
		let cordinate = e.currentTarget.dataset.id;
		let targetPos = [newX, newY];
		//Prefix
		if (Math.floor(cordinate / 8) == 0) {
			newY = 1;
		} else {
			newY = Math.floor(cordinate / 8) + 1;
		}
		//Check if move is legal, bassed on an array of [x,y]
		if (this.exists(zones, targetPos)) {
			//We need to determine first which direction is the piece going
			let currPos = [this.x, this.y];
			// console.log(currPos);
			//Get's inside if there's no obsticle in between
			if (this.checkZone(currPos, targetPos)) {
				//If it's white
				if (this.color == "white") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("black")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[1]
						);
						target.removeChild(target.childNodes[0]);
						selected = false;
						return true;
					} else {
						return true;
					}
				}
				//If it's black
				if (this.color == "black") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("white")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[0]
						);
						target.removeChild(target.childNodes[0]);
						return true;
					} else {
						return true;
					}
				}
			} else {
				// console.log("Yikes");
				return;
			}
		}
	}
}
class Rook extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
	}

	//Get avaliable zones
	avaliableZones() {
		let avaliableSteps = [];
		let xCounter = this.x;
		let yCounter = this.y;
		//X+
		while (xCounter < 8) {
			xCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X-
		xCounter = this.x;
		while (xCounter > 1) {
			xCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//Y+
		xCounter = this.x;
		while (yCounter < 8) {
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X-
		yCounter = this.y;
		while (yCounter > 1) {
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		return avaliableSteps;
	}

	//Check the amount of zones between the current and target
	checkZone(current, target) {
		let dir;
		let scanZone = [current[0], current[1]];
		let succesFull = true;

		if (target[0] != current[0]) {
			if (target[0] > current[0]) {
				dir = "right";
			} else {
				dir = "left";
			}
		} else {
			if (target[1] > current[1]) {
				dir = "up";
			} else {
				dir = "down";
			}
		}
		if (dir == "up") {
			while (true) {
				scanZone[1]++;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		if (dir == "down") {
			while (true) {
				scanZone[1]--;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[1] == target[1]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		if (dir == "right") {
			while (true) {
				scanZone[0]++;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[0] == target[0]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}
		if (dir == "left") {
			while (true) {
				scanZone[0]--;
				// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
				if (scanZone[0] == target[0]) {
					break;
				} else if (
					zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
				) {
					succesFull = false;
					break;
				} else {
					// console.log("Not found");
				}
			}
		}

		return succesFull;
	}

	//Moving engine
	moveChecker(newX, newY, e) {
		const target = e.currentTarget;
		let zones = this.avaliableZones();
		let cordinate = e.currentTarget.dataset.id;
		let targetPos = [newX, newY];
		//Prefix
		if (Math.floor(cordinate / 8) == 0) {
			newY = 1;
		} else {
			newY = Math.floor(cordinate / 8) + 1;
		}
		//Check if move is legal, bassed on an array of [x,y]
		if (this.exists(zones, targetPos)) {
			//We need to determine first which direction is the piece going
			let currPos = [this.x, this.y];
			// console.log(currPos);
			//Get's inside if there's no obsticle in between
			if (this.checkZone(currPos, targetPos)) {
				//If it's white
				if (this.color == "white") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("black")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[1]
						);
						target.removeChild(target.childNodes[0]);
						selected = false;
						return true;
					} else {
						return true;
					}
				}
				//If it's black
				if (this.color == "black") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("white")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[0]
						);
						target.removeChild(target.childNodes[0]);
						return true;
					} else {
						return true;
					}
				}
			} else {
				// console.log("Yikes");
				return;
			}
		}
	}
}

class Knight extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
	}

	//Get avaliable zones
	avaliableZones() {
		let avaliableSteps = [];
		//X+ Y-
		let xCounter = this.x;
		let yCounter = this.y;

		avaliableSteps.push(
			[xCounter - 1, yCounter + 2],
			[xCounter + 1, yCounter + 2],
			[xCounter + 2, yCounter + 1],
			[xCounter + 2, yCounter - 1],
			[xCounter - 1, yCounter - 2],
			[xCounter + 1, yCounter - 2],
			[xCounter - 2, yCounter - 1],
			[xCounter - 2, yCounter + 1]
		);
		console.log(avaliableSteps);
		return avaliableSteps;
	}

	//Moving engine
	moveChecker(newX, newY, e) {
		const target = e.currentTarget;
		let zones = this.avaliableZones();
		let cordinate = e.currentTarget.dataset.id;
		let targetPos = [newX, newY];
		//Prefix
		if (Math.floor(cordinate / 8) == 0) {
			newY = 1;
		} else {
			newY = Math.floor(cordinate / 8) + 1;
		}
		//Check if move is legal, bassed on an array of [x,y]
		if (this.exists(zones, targetPos)) {
			//We need to determine first which direction is the piece going
			let currPos = [this.x, this.y];
			// console.log(currPos);
			//If it's white
			if (this.color == "white") {
				//Check if there's a figure on the target zone
				if (target.childNodes.length < 1) {
					return true;
				}
				//If there's a figure, capture it
				if (target.childNodes[0].classList.contains("black")) {
					let cordinate = e.currentTarget.dataset.id;
					Board.removeFigure(
						parseInt(cordinate) + 1,
						boardObj.activeFigures[1]
					);
					target.removeChild(target.childNodes[0]);
					selected = false;
					return true;
				} else {
					return true;
				}
			}
			//If it's black
			if (this.color == "black") {
				//Check if there's a figure on the target zone
				if (target.childNodes.length < 1) {
					return true;
				}
				//If there's a figure, capture it
				if (target.childNodes[0].classList.contains("white")) {
					let cordinate = e.currentTarget.dataset.id;
					Board.removeFigure(
						parseInt(cordinate) + 1,
						boardObj.activeFigures[0]
					);
					target.removeChild(target.childNodes[0]);
					return true;
				} else {
					return true;
				}
			}
		} else {
			// console.log("Yikes");
			return;
		}
	}
}

class Queen extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
	}

	//Get avaliable zones
	avaliableZones() {
		//Diagonal
		let avaliableSteps = [];
		//X+ Y-
		let xCounter = this.x;
		let yCounter = this.y;
		// console.log(this.x, this.y);
		while (xCounter < 8 && yCounter > 1) {
			xCounter++;
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X+ Y+
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter < 8 && yCounter < 8) {
			xCounter++;
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X- Y-
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter > 1 && yCounter > 1) {
			xCounter--;
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X- Y+
		xCounter = this.x;
		yCounter = this.y;
		while (xCounter > 1 && yCounter < 8) {
			xCounter--;
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//Horizontal
		xCounter = this.x;
		yCounter = this.y;
		//X+
		while (xCounter < 8) {
			xCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X-
		xCounter = this.x;
		while (xCounter > 1) {
			xCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//Y+
		xCounter = this.x;
		while (yCounter < 8) {
			yCounter++;
			avaliableSteps.push([xCounter, yCounter]);
		}
		//X-
		yCounter = this.y;
		while (yCounter > 1) {
			yCounter--;
			avaliableSteps.push([xCounter, yCounter]);
		}

		return avaliableSteps;
	}

	//Check the amount of zones between the current and target
	checkZone(current, target) {
		// let zonesBetween = Math.abs(Math.abs(current[0]) - Math.abs(target[0])) - 1;
		let xDir;
		let yDir;
		let dir;
		let scanZone = [current[0], current[1]];
		let succesFull = true;

		//Decide if it's Diagonal or Horizontal / Vertical
		if (
			(current[0] == target[0] && current[1] != target[1]) ||
			(current[0] != target[0] && current[1] == target[1])
		) {
			//Horizontal or Vertical
			if (target[0] != current[0]) {
				if (target[0] > current[0]) {
					dir = "right";
				} else {
					dir = "left";
				}
			} else {
				if (target[1] > current[1]) {
					dir = "up";
				} else {
					dir = "down";
				}
			}
			// console.log("in");
			if (dir == "up") {
				while (true) {
					scanZone[1]++;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			if (dir == "down") {
				while (true) {
					scanZone[1]--;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			if (dir == "right") {
				while (true) {
					scanZone[0]++;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[0] == target[0]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			if (dir == "left") {
				while (true) {
					scanZone[0]--;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[0] == target[0]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			console.log("Horizontal");

			return succesFull;
		} else {
			//Diagonal
			if (target[0] > current[0]) {
				xDir = "plus";
			} else {
				xDir = "minus";
			}
			if (target[1] > current[1]) {
				yDir = "plus";
			} else {
				yDir = "minus";
			}
			// console.log("in");
			if (xDir == "plus" && yDir == "plus") {
				while (true) {
					scanZone[0]++;
					scanZone[1]++;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}

			if (xDir == "minus" && yDir == "minus") {
				while (true) {
					scanZone[0]--;
					scanZone[1]--;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			if (xDir == "minus" && yDir == "plus") {
				while (true) {
					scanZone[0]--;
					scanZone[1]++;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			if (xDir == "plus" && yDir == "minus") {
				while (true) {
					scanZone[0]++;
					scanZone[1]--;
					// console.log(zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1]);
					if (scanZone[1] == target[1]) {
						break;
					} else if (
						zones[(scanZone[1] - 1) * 8 + scanZone[0] - 1].childNodes.length > 0
					) {
						succesFull = false;
						break;
					} else {
						// console.log("Not found");
					}
				}
			}
			return succesFull;
		}
	}

	//Moving engine
	moveChecker(newX, newY, e) {
		const target = e.currentTarget;
		let zones = this.avaliableZones();
		let cordinate = e.currentTarget.dataset.id;
		let targetPos = [newX, newY];
		//Prefix
		if (Math.floor(cordinate / 8) == 0) {
			newY = 1;
		} else {
			newY = Math.floor(cordinate / 8) + 1;
		}
		//Check if move is legal, bassed on an array of [x,y]
		if (this.exists(zones, targetPos)) {
			//We need to determine first which direction is the piece going
			let currPos = [this.x, this.y];
			// console.log(currPos);
			//Get's inside if there's no obsticle in between
			if (this.checkZone(currPos, targetPos)) {
				//If it's white
				if (this.color == "white") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("black")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[1]
						);
						target.removeChild(target.childNodes[0]);
						selected = false;
						return true;
					} else {
						return true;
					}
				}
				//If it's black
				if (this.color == "black") {
					//Check if there's a figure on the target zone
					if (target.childNodes.length < 1) {
						return true;
					}
					//If there's a figure, capture it
					if (target.childNodes[0].classList.contains("white")) {
						let cordinate = e.currentTarget.dataset.id;
						Board.removeFigure(
							parseInt(cordinate) + 1,
							boardObj.activeFigures[0]
						);
						target.removeChild(target.childNodes[0]);
						return true;
					} else {
						return true;
					}
				}
			} else {
				// console.log("Yikes");
				return;
			}
		}
	}
}

const boardObj = new Board();
boardObj.generate();
const board = document.querySelector(".board");
const zones = board.childNodes;
let prefix = undefined; //Easy way to clear the event listener, unfortunately otherwise it's impossible
let selected = false;
let active = undefined;
let turn = "white";

//x - y - type - color
const test221 = new Pawn(1, 4, "pawn", "black");
const test3 = new Pawn(3, 4, "pawn", "black");
// const test2 = new Pawn(2, 5, "pawn", "white");
// const test4 = new Pawn(4, 5, "pawn", "white");
// const test11 = new Pawn(5, 4, "pawn", "black");
// const test33 = new Pawn(7, 4, "pawn", "black");
// const test22 = new Pawn(6, 5, "pawn", "white");
const test55 = new Bishop(4, 5, "bishop", "white");
const test56 = new Bishop(5, 6, "bishop", "white");
const test57 = new Bishop(6, 5, "bishop", "black");
const test58 = new Bishop(4, 7, "bishop", "black");
const test1 = new Knight(3, 5, "knight", "black");
const test2 = new Knight(8, 7, "knight", "white");
const test4 = new Rook(2, 7, "rook", "white");
const test34 = new Queen(1, 1, "queen", "white");

//black
boardObj.activeFigures[1].forEach((figure) => {
	figure.display();
});
//white
boardObj.activeFigures[0].forEach((figure) => {
	figure.display();
});
