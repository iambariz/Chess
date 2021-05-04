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
    }

    get position() {
        return (this.y - 1) * 8 + this.x
    }

    move(newX, newY) {

    }
    display() {

    }
}

class Rook extends Figure {
    super(x, y, img, color) {

    }

}
const board = new Board;
board.generate();

const test = new Rook(2, 2, "&#xf447", "white");
console.log(board);
console.log(test);