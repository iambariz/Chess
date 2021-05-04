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
                        this.createDiv("white");
                    } else {
                        this.createDiv("black");
                    }
                } else {
                    if (j % 2 != 0) {
                        this.createDiv("white");

                    } else {
                        this.createDiv("black");

                    }
                }
            }
        }
    }

    createDiv(color) {
        const board = document.querySelector('.board');
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.classList.add("zone");
        board.appendChild(div);
    }

}

const board = new Board;
board.generate();

console.log(board);