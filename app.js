class Board {
	constructor() {
		const board = document.createElement("div");
		board.classList.add("board");
		document.body.appendChild(board);
		this.activeFigures = [[], []];
		this.moves = [];
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
				removedFigure = arr[i].img;
				console.log(removedFigure);
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
				boardObj.moves.push([this.img, this.x, this.y]);
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

	avaliableZones() {
		let avaliableSteps = [];
		//X+ Y-
		if (this.color == "white") {
			if (this.y == 7) {
				avaliableSteps.push([this.x, this.y - 2]);
			}
			avaliableSteps.push([this.x, this.y - 1]);
			avaliableSteps.push([this.x - 1, this.y - 1]);
			avaliableSteps.push([this.x + 1, this.y - 1]);
		} else {
			if (this.y == 2) {
				avaliableSteps.push([this.x, this.y + 2]);
			}
			avaliableSteps.push([this.x, this.y + 1]);
			avaliableSteps.push([this.x - 1, this.y + 1]);
			avaliableSteps.push([this.x + 1, this.y + 1]);
		}
		return avaliableSteps;
	}

	//Check the amount of zones between the current and target
	checkZone(current, target, e) {
		// let zonesBetween = Math.abs(Math.abs(current[0]) - Math.abs(target[0])) - 1;
		let succesFull = true;
		let capture = true;
		if (target[1] == current[1] + 2 || target[1] == current[1] - 2) {
			//Double move
			if (this.color == "black") {
				if (zones[(current[1] + 2) * 8 + current[0] + 1].hasChildNodes()) {
					succesFull = false;
				}
			}
			if (this.color == "white") {
				if (zones[(current[1] - 2) * 8 + current[0] - 1].hasChildNodes()) {
					succesFull = false;
				}
			}

			if (target[0] == current[0]) {
				capture = false;
			}
			if (capture == false) {
				if (e.currentTarget.childNodes.length > 0) {
					succesFull = false;
				}
			} else {
				//if this exist then go to the if statement else failure
				if (e.currentTarget.hasChildNodes()) {
					if (e.currentTarget.childNodes[0].classList == this.color) {
						succesFull = false;
					}
				} else {
					succesFull = false;
				}
			}
			return succesFull;
		} else {
			//Single move
			if (target[0] == current[0]) {
				capture = false;
			}
			if (capture == false) {
				if (e.currentTarget.childNodes.length > 0) {
					succesFull = false;
				}
			} else {
				//if this exist then go to the if statement else failure
				if (e.currentTarget.hasChildNodes()) {
					if (e.currentTarget.childNodes[0].classList == this.color) {
						succesFull = false;
					}
				} else {
					succesFull = false;
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
			if (this.checkZone(currPos, targetPos, e)) {
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
		this.moved = false;
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
					this.moved = true;
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
					this.moved = true;
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
		// console.log(avaliableSteps);
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
						this.moved = true;
						console.log(this.moved);
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

class King extends Figure {
	constructor(x, y, img, color) {
		super(x, y, img, color);
		this.moved = false;
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
				//Short castling
				if (newX - this.x == 2) {
					if (this.color == "white") {
						zones[wRook1.position - 3].appendChild(
							zones[wRook1.position - 1].childNodes[0]
						);
						wRook1.x = 6;
					}
					if (this.color == "black") {
						zones[bRook1.position - 3].appendChild(
							zones[bRook1.position - 1].childNodes[0]
						);
						bRook1.x = 6;
					}
				}
				//Long castling
				if (this.x - newX == 2) {
					console.log("in");
					if (this.color == "white") {
						zones[wRook2.position + 2].appendChild(
							zones[wRook2.position - 1].childNodes[0]
						);
						wRook2.x = 4;
					}
					if (this.color == "black") {
						zones[bRook2.position + 2].appendChild(
							zones[bRook2.position - 1].childNodes[0]
						);
						bRook2.x = 4;
					}
				}
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

	//Get avaliable zones
	avaliableZones() {
		let avaliableSteps = [];

		if (this.moved == false) {
			if (this.castlingChecker() == true) {
				let shortCastling = true;
				let longCastling = true;

				for (let i = 1; i < 3; i++) {
					if (zones[this.y * 7 + this.x - 1 + i].childNodes.length > 0) {
						shortCastling = false;
					}
				}
				for (let i = 2; i > 0; i--) {
					if (zones[this.y * 7 + this.x - 1 - i].childNodes.length > 0) {
						longCastling = false;
					}
				}
				if (shortCastling == true) {
					avaliableSteps.push([this.x + 2, this.y]);
				}
				if (longCastling == true) {
					avaliableSteps.push([this.x - 2, this.y]);
				}
			}
		}

		avaliableSteps.push(
			[this.x + 1, this.y + 1],
			[this.x + 1, this.y - 1],
			[this.x - 1, this.y + 1],
			[this.x - 1, this.y - 1],
			[this.x, this.y - 1],
			[this.x, this.y + 1],
			[this.x - 1, this.y],
			[this.x + 1, this.y]
		);
		return avaliableSteps;
	}

	castlingChecker() {
		if (this.moved == false) {
			let succesed = true;
			if (this.color == "white") {
				for (let i = 0; i < boardObj.activeFigures[0].length; i++) {
					if (boardObj.activeFigures[0][i].img == "rook") {
						if ((boardObj.activeFigures[0][i].moved = false)) {
							succesed = false;
						}
					}
				}
			}
			return succesed;
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
			// console.log(currPos);
			//If it's white
			if (this.color == "white") {
				this.moved = true;
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
				this.moved = true;
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

const boardObj = new Board();
boardObj.generate();
const board = document.querySelector(".board");
const container = document.querySelector(".container");
container.append(board);

const zones = board.childNodes;
let prefix = undefined; //Easy way to clear the event listener, unfortunately otherwise it's impossible
let selected = false;
let active = undefined;
let removedFigure = undefined;
let turn = "white";

//x - y - type - color

//White
const wPawn1 = new Pawn(1, 7, "pawn", "white");
const wPawn2 = new Pawn(2, 7, "pawn", "white");
const wPawn3 = new Pawn(3, 7, "pawn", "white");
const wPawn4 = new Pawn(4, 7, "pawn", "white");
const wPawn5 = new Pawn(5, 7, "pawn", "white");
const wPawn6 = new Pawn(6, 7, "pawn", "white");
const wPawn7 = new Pawn(7, 7, "pawn", "white");
const wPawn8 = new Pawn(8, 7, "pawn", "white");
//Short side rook
const wRook1 = new Rook(8, 8, "rook", "white");
const wRook2 = new Rook(1, 8, "rook", "white");
const wBish1 = new Bishop(3, 8, "bishop", "white");
const wBish2 = new Bishop(6, 8, "bishop", "white");
const wKnight1 = new Knight(2, 8, "knight", "white");
const wKnight2 = new Knight(7, 8, "knight", "white");
const wKing = new King(5, 8, "king", "white");
const wQueen = new Queen(4, 8, "queen", "white");

//Black
const bPawn1 = new Pawn(1, 2, "pawn", "black");
const bPawn2 = new Pawn(2, 2, "pawn", "black");
const bPawn3 = new Pawn(3, 2, "pawn", "black");
const bPawn4 = new Pawn(4, 2, "pawn", "black");
const bPawn5 = new Pawn(5, 2, "pawn", "black");
const bPawn6 = new Pawn(6, 2, "pawn", "black");
const bPawn7 = new Pawn(7, 2, "pawn", "black");
const bPawn8 = new Pawn(8, 2, "pawn", "black");
//Short side rook
const bRook1 = new Rook(8, 1, "rook", "black");
const bRook2 = new Rook(1, 1, "rook", "black");
const bBish1 = new Bishop(3, 1, "bishop", "black");
const bBish2 = new Bishop(6, 1, "bishop", "black");
const bKnight1 = new Knight(2, 1, "knight", "black");
const bKnight2 = new Knight(7, 1, "knight", "black");
const bKing = new King(5, 1, "king", "black");
const bQueen = new Queen(4, 1, "queen", "black");

//black
boardObj.activeFigures[1].forEach((figure) => {
	figure.display();
});
//white
boardObj.activeFigures[0].forEach((figure) => {
	figure.display();
});
