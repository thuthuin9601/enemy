const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = 500;
canvas.width = 800;
let worm = document.getElementById('worm');
let ghost = document.getElementById('ghost');
let spider = document.getElementById('spider');

class Game {
    constructor(ctx, width, height){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.enemyInterval = 100;
        this.enemyTimer = 0;
        // this.#addNewEnemy() //khi gọi class Game thì nó cũng đi theo luôn
        this.enemyTypes = ['worm', 'ghost', 'spider'];
    }
    update(deltaTime){ //áp dụng cho tất cả
        this.enemies =  this.enemies.filter(object => !object.markedForDeletion)   
        if(this.enemyTimer>this.enemyInterval){
            this.#addNewEnemy();
            this.enemyTimer = 0;
            // console.log(this.enemies);
        }
        else {
            this.enemyTimer+=deltaTime;
        }
        
        this.enemies.forEach(object => object.update(deltaTime));
    }
    draw(){
        this.enemies.forEach(object => object.draw(this.ctx));
    }
    #addNewEnemy(){ //'#' nghĩa là function chỉ áp dụng trong class
        let randomEnemy = this.enemyTypes[Math.floor(Math.random()*this.enemyTypes.length)]
        if (randomEnemy == 'worm'){
            this.enemies.push(new Worm(this));
        }
        else if (randomEnemy == 'ghost'){
            this.enemies.push(new Ghost(this));
        }
        else if (randomEnemy == 'spider'){
            this.enemies.push(new Spider(this));
        }
        // this.enemies.sort(function(a, b){
        //     return a.y - b.y;
        // });
    }
}

class Enemy {
    constructor(game){
        this.game = game;
        // console.log(this.game); // lấy biến this. của game vào class Enemy
        this.markedForDeletion = false;
        this.frameX;
        this.maxFrame = 5;
        this.frameInterval = 100;
        this.frameTimer = 0;
    }
    update(deltaTime){ //áp dụng cho mỗi enemies
        this.x -= this.speed*deltaTime; 
        //remove enemies
        if (this.x + this.width < 0){
            this.markedForDeletion = true;
        }
        if (this.frameTimer > this.frameInterval){
            if (this.frameX < this.maxFrame){
                this.frameX++
            }
            else {
                this.frameX = 0;
            }
        }
        else {
            this.frameTimer += deltaTime;
        }
    }
    draw(ctx){
        ctx.drawImage(this.image, this.frameX* this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Worm extends Enemy {
    constructor(game){
        super(game);
        this.spriteWidth = 229;
        this.spriteHeight = 171;
        this.x = this.game.width;
        this.y =this.game.height - this.spriteHeight/2;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.speed = Math.random()*0.1 + 0.1;
        this.image = worm;
        console.log(this.height);
    }
};

class Ghost extends Enemy {
    constructor(game){
        super(game);
        this.spriteWidth = 261;
        this.spriteHeight = 209;
        this.x = this.game.width;
        this.y = this.game.height *Math.random() *0.6;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.speed = Math.random()*0.1 + 0.1;
        this.image = ghost;
        this.angle = 0;
        this.curve = Math.random() * 3;
    }
    update(deltaTime){
        super.update(deltaTime);
        this.y += Math.sin(this.angle)* this.curve;
        this.angle += 0.1;
    }
};
class Spider extends Enemy {
    constructor(game){
        super(game);
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.x = Math.random() * this.game.width;
        this.y = 0 - this.spriteHeight/2;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.speed = 0;
        this.image = spider;
        console.log(this.x);
        this.vx = 0;
        this.vy = 1;
        this.maxLength = Math.random() * this.game.height
    }
    update(deltaTime){
        super.update(deltaTime);
        this.y += this.vy
        if (this.y > this.maxLength){
            this.vy *= -1;
        }
    }; 
};

const game = new Game(ctx, canvas.width, canvas.height);
let lastTime = 0;
function animate(timeStamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
}
animate(0);