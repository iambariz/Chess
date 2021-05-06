class Board {
    constructor() {
        const board = document.createElement('div');
        board.classList.add("board");
        document.body.appendChild(board);
    }
    generate() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        this.createZone("white");
                    } else {
                        this.createZone("black");
                    }
                } else {
                    if (j % 2 != 0) {
                        this.createZone("white");

                    } else {
                        this.createZone("black");
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
        zones[this.position - 1].innerHTML = "&#xf447";

        zones[this.position - 1].appendChild(figure);
    }


}

class Rook extends Figure {
    super(x, y, img, color) {

    }

}
const boardObj = new Board;
boardObj.generate();
const board = document.querySelector('.board');
const zones = board.childNodes;


const test = new Rook(2, 2, "f447", "white");
const test1 = new Rook(2, 2, "f447", "white");
const test2 = new Rook(2, 2, "f447", "white");
const test3 = new Rook(2, 2, "f447", "white");
const test4 = new Rook(2, 2, "f447", "white");
const test5 = new Rook(2, 2, "f447", "white");
console.log(test.position);
console.log(test.display());
console.log(boardObj.activeFigures);
console.log(test);