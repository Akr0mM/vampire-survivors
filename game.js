import stats from "./stats.json" assert {type: 'json'};

class Map {
    constructor() {
        this.bonus = [{x: 1, y: 1}, {x: cw, y: 1}, {x: Math.floor(cw / 2), y: ch}]
    }

    drawBG() {
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(0, 0, cw, ch);

        // player weapons and items
        // weapons
        // player hold weapons
        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(5 + i * 50, 5, 40, 40);
        }
        // weapons icons

        // supports
        // player hold items 
        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(5 + i * 50, 50, 40, 40);
        }
        // support icons

    }
}

class Player {
    constructor(name) {
        this.name = name || 'Player 1';
        this.width = 60;
        this.height = 100;
        this.x = 720;
        this.y = 450;
        this.direction = 1
        this.health = 100;
        this.maxHealth = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.ms = 2.5;
        this.level = 1;
        this.luck = 1;
        this.greedMultiplicator = 0;
        this.armor = 0;
        this.isCursed = false;
        this.weapons = [];
        this.items = [];
        this.experience = 0;
        this.experienceNeeded = stats.experienceGrade[0];
        this.globalExperience = this.experience + '/' + this.experienceNeeded;
    }

    draw() {
        // player 
        ctx.fillStyle = '#ccc';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // player health
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x, this.y + this.height + 8, this.width / this.maxHealth * this.health, 8);

        // player name
        ctx.font = "18px Montserrat";
        ctx.fillStyle = '#fff';
        ctx.fillText(this.name, this.x - 3, this.y - 5);
    }
}

class Ennemy {
    constructor(level) {
        this.stats = stats.ennemies[level];
        this.x = 100;
        this.y = 100;
    }

    draw() {
        ctx.fillStyle = this.stats.bgcolor;
        ctx.fillRect(this.x, this.y, this.stats.width, this.stats.height);
    }
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let cw = window.innerWidth;
let widthOffset = cw % 5;
if (widthOffset != 0) cw -= widthOffset;
let ch = window.innerHeight;
let heightOffset = ch % 5;
if (heightOffset != 0) ch -= heightOffset;

canvas.width = cw;
canvas.height = ch;

let map;
let player;
let keys = {
    ArrowUp: { isPressed: false },
    ArrowDown: { isPressed: false },
    ArrowLeft: { isPressed: false },
    ArrowRight: { isPressed: false },
    space: { isPressed: false }
};
let ennemies = [];
let clock = {
    time: 0,
    timer: setInterval(() => {
        clock.time += 1;
    }, 1000),
    drawTimer: () => {
        ctx.font = "48px Montserrat";
        ctx.fillStyle = '#fff';
        ctx.fillText(clock.renderTime(clock.time), Math.floor(cw / 2) - 55, 50);
    },
    renderTime: (time) => {
        let sec = time % 60;
        let min = Math.floor(time / 60);
        if (sec < 10) sec = '0' + sec;
        let timer = `${min}:${sec}`;
        return timer;
    }
};

let game = {
    weapons: [],
};


window.onload = function main() {
    // let name = prompt('Enter your name.')
    map = new Map();
    player = new Player(name);


    ennemies.push(new Ennemy(0));


    let weaponsTimer = setInterval(() => {
        console.log('gang');
        player.weapons.forEach(weapon => {
            animateWeapon(weapon);
        });
    }, 1000 * 0.5);
    animate();
};

function animate() {
    requestAnimationFrame(animate);

    update();
    draw();
}

function update() {
    // update velocity by keys pressed
    player.velocityX = 0;
    player.velocityY = 0;
    if (keys.ArrowUp.isPressed) player.velocityY = -1;
    if (keys.ArrowDown.isPressed) player.velocityY = 1;
    if (keys.ArrowLeft.isPressed) player.velocityX = -1;
    if (keys.ArrowRight.isPressed) player.velocityX = 1;

    // player moves by velocity and border
    if (player.x + player.velocityX * player.ms > -1 && player.x + player.velocityX * player.ms + player.width < cw + 1) {
        player.x += player.velocityX * player.ms;
    }
    if (player.y + player.velocityY * player.ms > -1 && player.y + player.velocityY * player.ms + player.height < ch + 1) {
        player.y += player.velocityY * player.ms;
    }
}

function draw() {
    // bg
    map.drawBG();

    // ennemies
    ennemies.forEach(ennemy => {
        ennemy.draw();
    });

    // player
    player.draw();

    // timer 
    clock.drawTimer();
}

function animateWeapon(weapon) {

}

window.addEventListener('keydown', function move(e) {
    let keysAccepted = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
    if (!keysAccepted.includes(e.key)) return;

    if (e.key === 'ArrowUp') {
        keys.ArrowUp.isPressed = true;
    } else if (e.key === 'ArrowDown') {
        keys.ArrowDown.isPressed = true;
    } else if (e.key === 'ArrowLeft') {
        keys.ArrowLeft.isPressed = true;
    } else if (e.key === 'ArrowRight') {
        keys.ArrowRight.isPressed = true;
    } else if (e.key === ' ') {
        keys.space.isPressed = true;
    }
});

window.addEventListener('keyup', function move(e) {
    let keysAccepted = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
    if (!keysAccepted.includes(e.key)) return;

    if (e.key === 'ArrowUp') {
        keys.ArrowUp.isPressed = false;
    } else if (e.key === 'ArrowDown') {
        keys.ArrowDown.isPressed = false;
    } else if (e.key === 'ArrowLeft') {
        keys.ArrowLeft.isPressed = false;
    } else if (e.key === 'ArrowRight') {
        keys.ArrowRight.isPressed = false;
    } else if (e.key === ' ') {
        keys.space.isPressed = false;
    }
});

