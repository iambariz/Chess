class Board {
    constructor() {
        const board = document.createElement('div');
        board.classList.add("board");
        document.body.appendChild(board);
        this.activeFigures = [
            [],
            []
        ];
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
        const board = document.querySelector('.board');
        const display = document.createElement("div");
        display.classList.add("display");
        display.textContent = "White's turn";
        board.appendChild(display);
    }

    createZone(color, id) {
        const board = document.querySelector('.board');
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
                Board.toggleRound();
            } else {
                //Failed movement
                return
            }

        }
    }
    //Display, getting called straight away, and also 
    //Attaches the click event
    display() {
        const figure = document.createElement('i');
        figure.classList.add("fas", `fa-chess-${this.img}`, this.color);
        zones[this.position - 1].appendChild(figure);
        let obj = this;
        //Basic move handler below
        figure.addEventListener('click', function (e) {
            if (obj.color == turn) {
                if (selected == false) {
                    selected = true;
                    figure.classList.add("active");
                    this.active = true;
                    active = this.parentNode;
                    const zones = document.querySelectorAll('.zone');
                    //OBJ = Object, Active = Zone, Figure = Figure element
                    prefix = obj.move.bind(obj, active, figure);
                    zones.forEach(zone => {
                        zone.addEventListener('click', prefix);
                    });
                    //If player clicks on something, what's the same color as the last el
                } else if (e.currentTarget.classList.contains(obj.color)) {
                    active.childNodes[0].classList.remove('active');
                    zones.forEach(zone => {
                        zone.removeEventListener('click', prefix);
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
                                zones.forEach(zone => {
                                    zone.addEventListener('click', prefix);
                                });
                            }
                        }
                    } else if (obj.color == "black") {
                        for (let i = 0; i < boardObj.activeFigures[1].length; i++) {
                            const element = boardObj.activeFigures[1][i];
                            if (element.position == parseInt(active.dataset.id) + 1) {
                                prefix = element.move.bind(element, active, figure);
                                zones.forEach(zone => {
                                    zone.addEventListener('click', prefix);
                                });
                            }
                        }
                    }
                    // prefix = obj.move.bind(obj, active, figure); Not working currently
                }
            }
        })
    }

}

class Rook extends Figure {

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
            } else if (this.y - 1 == newY && this.x + 1 == newX || this.x - 1 == newX && this.y - 1 == newY) {
                if (target.childNodes[0].classList.contains("black")) {
                    let cordinate = e.currentTarget.dataset.id;
                    Board.removeFigure(parseInt(cordinate) + 1, boardObj.activeFigures[1]);
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
            } else if (this.y + 1 == newY && this.x + 1 == newX || this.y + 1 == newY && this.x - 1 == newX) {
                if (target.childNodes[0].classList.contains("white")) {
                    let cordinate = e.currentTarget.dataset.id;
                    Board.removeFigure(parseInt(cordinate) + 1, boardObj.activeFigures[0]);
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

    moveChecker(newX, newY, e) {
        let cordinate = e.currentTarget.dataset.id;
        let avaliableZones = [];
        let newX = cordinate % 8 + 1;
        let newY = 0;
        if (Math.floor(cordinate / 8) == 0) {
            newY = 1;
        } else {
            newY = Math.floor(cordinate / 8) + 1;
        }
        if (this.color == "white") {

        }

        if (this.color == "black") {

        }

    }
}


const boardObj = new Board;
boardObj.generate();
const board = document.querySelector('.board');
const zones = board.childNodes;
let prefix = undefined; //Easy way to clear the event listener, unfortunately otherwise it's impossible
let selected = false;
let active = undefined;
let turn = "white";


//x - y - type - color
const test1 = new Rook(1, 4, "rook", "black");
const test3 = new Rook(3, 4, "rook", "black");
const test2 = new Rook(2, 5, "rook", "white");
const test4 = new Rook(4, 5, "rook", "white");
const test11 = new Rook(5, 4, "rook", "black");
const test33 = new Rook(7, 4, "rook", "black");
const test22 = new Rook(6, 5, "rook", "white");
const test55 = new Bishop(8, 5, "bishop", "white");




//black
boardObj.activeFigures[1].forEach(figure => {
    figure.display();
});
//white
boardObj.activeFigures[0].forEach(figure => {
    figure.display();
});