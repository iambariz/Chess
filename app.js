class Board {
    constructor() {
        const board = document.createElement('div');
        board.classList.add("board");
        document.body.appendChild(board);
        this.activeFigures = [];
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
    }

    createZone(color, id) {
        const board = document.querySelector('.board');
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.dataset.id = id;
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
        this.active = false;
        boardObj.activeFigures.push(this);
    }

    get position() {
        return (this.y - 1) * 8 + this.x;
    }

    move(active, element, e) {
        e.stopPropagation();
        //Prevent multiple listeners
        if (e.currentTarget == active) {
            return
        } else {
            //The magic happens here
            let cordinate = e.currentTarget.dataset.id;
            let newX = cordinate % 8 + 1;
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
                zones.forEach(zone => {
                    zone.removeEventListener('click', prefix);
                });
                selected = false;
            } else {
                //Failed movement
                return
            }

        }
    }

    display() {
        const figure = document.createElement('i');
        figure.classList.add("fas", `fa-chess-${this.img}`, this.color);
        zones[this.position - 1].appendChild(figure);
        let obj = this;
        figure.addEventListener('click', function (e) {
            if (selected == false) {
                selected = true;
                figure.classList.add("active");
                this.active = true;
                const active = this.parentNode;
                const zones = document.querySelectorAll('.zone');
                prefix = obj.move.bind(obj, active, figure);
                zones.forEach(zone => {
                    zone.addEventListener('click', prefix);
                });
            } else if (e.currentTarget.classList.contains(obj.color)) {
                //If the player want to switch characters
            }
        })
    }

}

class Rook extends Figure {

    constructor(x, y, img, color) {
        super(x, y, img, color);
    }


    moveChecker(newX, newY, e) {
        console.log(e.currentTarget.childNodes)
        //Move functions
        if (this.color == "white") {
            if (this.y - 1 == newY && this.x == newX) {
                return true;
            } else if (this.y - 1 == newY && this.x + 1 == newX || this.x - 1 == newX) {
                if (e.currentTarget.childNodes[0].classList.contains("black")) {

                }
            } else {
                return false;
            }
        }
        if (this.color == "black") {
            if (this.y + 1 == newY && this.x == newX) {
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
let prefix = undefined; //Easy way to clear the event listener, unfortunately otherwise it's impossible
let selected = false;

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