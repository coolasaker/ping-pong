const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 50;
canvas.width = canvas.height * 2;

function RB(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var array2D = (y,x) => {
    var array = [];
    for(let i = 0 - y; i < y + y; i++) {
        array[i] = [];
        for(let j = 0 - x; j < x + x; j++) {
            array[i][j] = 0;
        }
    }
    return array;
}
var map = array2D(canvas.height,canvas.width);

class player {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.speedY = 0;
		this.points = 0;
	}
	update() {
		this.y += this.speedY;
		if(this.y > canvas.height) {
			this.y = 0;
		} else if(this.y < 0) this.y = canvas.height;

	}
}
class ball {
	constructor() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = 0.5;
		this.speedY = 1;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		if(this.y > canvas.height || this.y < 0) {
			this.speedY *= -1;
		}
	}
}
class enemy {
	constructor() {
		this.x = canvas.width - 1;
		this.y = canvas.height / 2;
		this.speedY = 0;
		this.points = 0;
	}
	update(y,speedX,x) {
		if(speedX > 0 && x > canvas.width / 3 * 2) {
		if(y > this.y) {
			this.speedY = 1;
		} else if(y < this.y) {
			this.speedY = -1;
		}
		} else if(RB(1,15) == 1){
			let f = () => {if(RB(1,2) == 1) {return 1} else return -1};
			this.speedY = f();
		}
		if(this.y < 0) {
			this.speedY = 1;
		} else if(this.y > canvas.height) this.speedY = -1;
		this.y += this.speedY;
	}
}
var keys = [];
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';
        if(keys[87] || keys[38]) {//w and up arrrow and space
                player1.speedY = -1;
                keys[87] = 0;
                keys[38] = 0;
                keys[32] = 0;
        } else if(keys[83] || keys[40]) { //s and down arrow
		player1.speedY = 1;
		keys[83] = 0;
		keys[40] = 0;
	} else player1.speedY = 0;
}

var drawing = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillText(player1.points,canvas.width / 10, canvas.height / 2);
	ctx.fillText(enemy1.points,canvas.width / 10 * 9, canvas.height / 2);
	for(let i = 0; i < canvas.height; i++) {
		for(let j = 0; j < canvas.width; j++) {
			if(map[i][j] == 1) {
				ctx.fillStyle = "white";
				ctx.fillRect(j,i,1,1);
				map[i][j] = 0;
			} else if(map[i][j] == 3) {
				ctx.fillStyle = "white";
				ctx.fillRect(j,i,1,1);
				map[i][j] = 0;
			} else if(j == Math.floor(canvas.width / 2)) {
				ctx.fillStyle = "white";
				ctx.fillRect(j,i,1,1);
			}
		}
	}
}

var player1 = new player(1, Math.floor(canvas.height / 2));
var ball1 = new ball();
var enemy1 = new enemy();
var game = () => {
	player1.update();
	ball1.update();
	enemy1.update(ball1.y,ball1.speedX,ball1.x);
	for(let i = -3; i < 3; i++) {
		map[player1.y + i][player1.x] = 1;
		map[enemy1.y + i][enemy1.x] = 1; 
	}
	let bounce = 0;
	for(let i = -3; i < 3; i++) {
		for(let j = -3; j < 3; j++) {
			if(map[Math.floor(i + ball1.y)][Math.floor(j + ball1.x)] == 1 && bounce == 0 && ((ball1.speedX > 0 && j == 2) || (ball1.speedX < 0 && j == -3))) {
				ball1.speedX *= -1.1;
				if(ball1.speedX > 1) {
					ball1.speedX = 1;
				} else if(ball1.speedX < -1) ball1.speedX = -1;
				bounce = 1;
			}
			map[Math.floor(i + ball1.y)][Math.floor(j + ball1.x)] = 3;
		}
	}
	if(ball1.x < 0) {
		enemy1.points++;
		ball1.x = canvas.width / 2;
		ball1.speedX = 0.5;
	} else if(ball1.x > canvas.width) {
		player1.points++;
		ball1.x = canvas.width / 2;
		ball1.speedX = 0.5;
	}
	setTimeout(() => {
		drawing();
		game();
	},1000/30);
}
game();






