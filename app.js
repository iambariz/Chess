const selected = false;

class Board {
    constructor() {
        const board = document.createElement('div');
        board.classList.add("board");
        document.body.appendChild(board);
        this.activeFigures = [];
    }
    generate() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        //white
                        this.createZone("#ccb083");
                    } else {
                        //black
                        this.createZone("#573a2e");
                    }
                } else {
                    if (j % 2 != 0) {
                        //white
                        this.createZone("#ccb083");
                    } else {
                        //black
                        this.createZone("#573a2e");
                    }
                }
            }
        }
    }

    createZone(color) {
        const board = document.querySelector('.board');
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.classList.add("zone");
        board.appendChild(div);
    }

    activeFigures = [];
}

class Figure {
    constructor(x, y, img, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.img = img;
        boardObj.activeFigures.push(this);
    }

    get position() {
        return (this.y - 1) * 8 + this.x;
    }

    move(lastPos, newX, newY) {

    }
    display() {
        const figure = document.createElement('i');
        figure.classList.add("fas", `fa-chess-${this.img}`, this.color);
        zones[this.position - 1].appendChild(figure);
    }


}

class Rook extends Figure {
    super(x, y, img, color) {

    }

    moveChecker(newX, newY) {
        if (this.color == "white") {
            if (this.x - 1 == newX) {
                return true;
            } else {
                return false;
            }
        }
        if (this.color == "black") {
            if (this.x + 1 == newX) {
                return true;
            } else {
                return false;
            }
        }
    }

}
const boardObj = new Board;
boardObj.generate();
const board = document.querySelector('.board');
const zones = board.childNodes;


const test = new Rook(2, 2, "rook", "white");
const test1 = new Rook(4, 8, "rook", "black");
const test2 = new Rook(2, 8, "rook", "white");
const test3 = new Rook(3, 2, "rook", "black");
const test4 = new Rook(2, 1, "rook", "white");
const test5 = new Rook(5, 2, "rook", "black");

console.log(boardObj.activeFigures);

boardObj.activeFigures.forEach(figure => {
    figure.display();
});