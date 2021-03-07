//********* GLOBAL DATA *********//

const screen = [768,630];
const pixel = [screen[0]/256, screen[1]/240];

const bd = new Object; // board setup
    bd.x = 40;
    bd.y = 50;
    bd.p = 18;
    bd.color = (0,0,255);
    bd.bg = [0,0,0];
    bd.cell = [255,255,0];
    bd.pill = [255,0,0];

const pacman = new Object;
    pacman.x = bd.x + bd.p * 13.5;
    pacman.y = bd.y + bd.p * 23;
    pacman.mov_x = 0;
    pacman.mov_y = 0;
    pacman.rad = 13;
    pacman.color = [255,255,0];
    pacman.mounth = 0.3;
    pacman.open = true;
    pacman.side = 0;
    pacman.score = 0;
    pacman.speed = 1;

class Enemy{
    constructor(x,y,n){
        this.x = x;
        this.y = y;
        this.mov_x = 0;
        this.mov_y = 0;
        this.rad = 13;
        this.atack = true;
        this.num = n;
        this.speed = 1;
        this.side = 0;
        this.move = true;
        this.count = 0;
    }
}

Enemy.prototype.run = function(){
    
    const walls = wall(this);
    const turn = turnpoint(this);

    if(this.atack){
        if(this.mov_y == 0 && turn[0]){
            if(pacman.y > this.y && !walls[3]){
                this.mov_x = 0;
                this.mov_y = this.speed;
            }else if(pacman.y < this.y && !walls[1]){
                this.mov_x = 0;
                this.mov_y = -this.speed;
            }

        }else if(this.mov_x == 0 && turn[1]){
            if(pacman.x > this.x && !walls[0]){
                this.mov_x = this.speed;
                this.mov_y = 0;
            }else if(pacman.x < this.x && !walls[2]){
                this.mov_x = -this.speed;
                this.mov_y = 0;
            }
        }
    }


    this.x += this.mov_x;
    this.y += this.mov_y;

}

const squares = [[13,0,1,4],
    [2,2,3,2],[7,2,4,2],
    [2,6,3,1],[7,6,1,7],[10,6,7,1],[13,7,1,3],
    [0,9,5,4],[8,9,3,1],
    [10,12,7,4],
    [0,15,5,4],[7,15,1,4],
    [10,18,7,1],[13,19,1,3],
    [2,21,3,1],[7,21,4,1],[4,22,1,3],
    [0,24,2,1],[10,24,7,1],[13,25,1,3],
    [2,27,9,1],[7,24,1,3]];

let dots;

let hiscore = 0;

const phanton = {
    body:[[-12,0,12,9],[-9,-6,9,6],[-6,-9,6,3]],
    skirt1: [[-9,9,3,3],[-3,9,3,3]],
    skirt2: [[-12,9,3,3],[-6,9,3,3]],
    eye :[[-9,-3,3,6]],
    look : [[0,0,3,3]]
};

const enemy_colors = [[247,155,0],[230,38,35],[247,179,215],[0,247,216]];

const enemys = [];

for(let i=0; i<1; i++){ // qtd enemys
    enemys.push(new Enemy(bd.x + bd.p * (12 + i) ,bd.y + bd.p * 13,i));
}

//********* FUNCTIONS **********//

function preload(){
    font = loadFont('press_start.ttf');
}

function setup() {
    createCanvas(screen[0],screen[1]);
    textSize(20);
//    frameRate(30)
    textAlign(10, 10);
    textFont(font);
    fillBoard();
}

function draw() {
    background(bd.bg);
    placar();
    drawBord(10);
    drawPacman();
    drawDots();
    drawGhost();
    move();
    
//    enemys[0].run();

    moveGhosts();
}

function keyPressed() {

    let pos = ([(pacman.x - bd.x) % bd.p,(pacman.y - bd.y) % bd.p]);
    const walls = wall(pacman);

//    alert(turnpoint(enemys[0]))

    function horizontal(){
        if(pos[1] > 8){
            pacman.y += 18 - pos[1];
        }else if(pos[1] > 0){
            pacman.y -= pos[1];
        }

    }
    function vertical(){
        if(pos[0] > 8){
            pacman.x += 18 - pos[0];
        }else if(pos[1] > 0){
            pacman.x -= pos[0];
        }
    }
    
    if (keyCode === RIGHT_ARROW) {
        if(!walls[0]){
            pacman.side = 0;
            horizontal();
            pacman.mov_x = pacman.speed;
            pacman.mov_y = 0;
        }

    } else if (keyCode === UP_ARROW) {
        if(!walls[1]){
            pacman.side = 1;
            vertical();
            pacman.mov_x = 0;
            pacman.mov_y = -pacman.speed;
        }

    } else if (keyCode === LEFT_ARROW) {
        if(!walls[2]){
            pacman.side = 2;
            horizontal();
            pacman.mov_x = -pacman.speed;
            pacman.mov_y = 0;
        }

    } else if (keyCode === DOWN_ARROW) {
        if(!walls[3]){
            pacman.side = 3;
            vertical();
            pacman.mov_x = 0;
            pacman.mov_y = pacman.speed;
        }

    }
  }

function turnpoint(obj){
    let pos = ([(obj.x - bd.x) % bd.p,(obj.y - bd.y) % bd.p]);
    let edges = [false,false];

    if(pos[0] == 0){        
        edges[0] = true;
    }
    if(pos[1] == 0){
        edges[1] = true;
    }

    return edges;
}

function drawBord(weigth=pixel, filler=false, rad=10){

    if(filler){
        fill(bd.color);
    }else{
        noFill();
    }
    stroke(0,0,255);
    strokeWeight(weigth);

    for(let i=0; i<squares.length; i++){
        mirror("R",[ bd.x + squares[i][0] * bd.p , bd.y + squares[i][1] * bd.p, squares[i][2] * bd.p, squares[i][3] * bd.p],rad,bd.x + bd.p * 13.5 );
    }

    if(!filler){
        fill(0);
        stroke(0);
        mirror("R",[bd.x,bd.y + bd.p * 13.5,100,18],0,bd.x + bd.p * 13.5);
    }    

}

function fillBoard(){
    background(0, 0, 0);
    squares.push([7,9,13,10]);
    squares.push([0,9,5,10]);
    squares.push([13,23,2,2]);
    drawBord(6,true,0);
    squares.splice(squares.length-3,3);
    squares.push([0,0,27,30]);
    dots = [[]];
    for(let y=1; y<=29; y++){
        dots.push([]);
        for(let x=1; x<=26;x++){
            let color = get(bd.x + x * bd.p , bd.y + y * bd.p);
            if(color[2] == 0){
                dots[y].push(x);
            }
        }
    }
    
}

function placar(){

    const zeroPad = (num, places) => String(num).padStart(places, '0');

    noStroke();
    fill(255,155,0);
    text("HI SCORE", 550, 100, 200, 150);
    text("1P"      , 550, 200, 200, 150);

    fill(255,255,255);
    text(zeroPad(hiscore,8)     , 550, 130, 200, 150);
    text(zeroPad(pacman.score,8), 550, 230, 200, 150);
}

function mirror(T,D,R,C){

    R = 0

    const x = D[0];
    const y = D[1];
    const w = D[2];
    const h = D[3];

    if(T == "L"){
        line(x,y,w,h);
        line(screen[0]-x,y,screen[0]-w,h);
    }else if(T == "R"){
        rect(x,y,w,h,R);        
        rect(2*C-x-w, y, w, h, R);
    }

}

function drawDots(diam = 2){
    noFill();
 
    for(let y=0; y<dots.length; y++){
        for(let x=0; x<dots[y].length;x++){
            circle(bd.x + dots[y][x] * bd.p , bd.y + y* bd.p,diam);

            if(y == 3 || y == 28){
                if(dots[y][x] == 1 || dots[y][x] == 26){
                    stroke(bd.pill);
                    circle(bd.x + dots[y][x] * bd.p , bd.y + y* bd.p,diam*5);
                    stroke(bd.cell);
                }
            }
        }
    }
}

function drawPacman(){

    fill(pacman.color);
    stroke(255,255,0);
    strokeWeight(pixel);
    ellipseMode(CENTER);
    
    arc(pacman.x,pacman.y, pacman.rad, pacman.rad, (pacman.mounth*PI) - (PI/2 * pacman.side), 2*PI - (pacman.mounth*PI) - (PI/2 * pacman.side)  , PIE);
    noFill();

    if(pacman.open){
        pacman.mounth += 0.03;
    }else{
        pacman.mounth -= 0.03;
    }

    if(pacman.mounth >=0.4){
        pacman.open = false;
    }
    if(pacman.mounth <=0.13){
        pacman.open = true;
    }
}

function wall(obj){
    const offset = 0.5;
    const edges = [[obj.x + (obj.rad + offset),obj.y],[obj.x , obj.y - (obj.rad + offset)],[obj.x - (obj.rad + offset),obj.y],[obj.x , obj.y + (obj.rad + offset)]];
    let response = [];

    for(let i=0; i<edges.length; i++){
        if(get(edges[i][0],edges[i][1])[2] != 0){
            response.push(true);
        }else{
            response.push(false);
        }
    }
    
    return response;
}


function move(){
    
    const walls = wall(pacman);

    if(!walls[pacman.side]){
        pacman.x += pacman.mov_x;
        pacman.y += pacman.mov_y;    
        eat();
    }

    if(pacman.x <= bd.x){ // secret pass
        pacman.x = bd.x + bd.p * 27;
    }else if(pacman.x >= bd.x + bd.p * 27){
        pacman.x = bd.x;
    }
    
}

function moveGhosts(){
    for(let i=0; i<enemys.length; i++){
        enemys[i].run();
    }

}

function eat(){

    let pos = [Math.floor((pacman.x - bd.x) / bd.p),Math.floor((pacman.y - bd.y) / bd.p)]
    const found = dots[pos[1]].indexOf(pos[0]);

    if(found >= 0){
        pacman.score += 10;
        dots[pos[1]].splice(found,1);

        if(pos[0] == 1){
            if(pos[1] == 3){
                alert(1)

            }else if(pos[1] == 28){
                alert(2)
            }
        }else if(pos[0] == 26){
            if(pos[1] == 3){
                alert(3)
            }else if(pos[1] == 28){
                alert(4)
            }
        }        
    }
}

function drawGhost(){

    function showghost(ght){

        let color = enemy_colors[ght.num];

        fill(color);
        noStroke();
    
        for(let i=0; i<phanton.body.length; i++){
            mirror("R",[ght.x+phanton.body[i][0],ght.y+phanton.body[i][1],phanton.body[i][2],phanton.body[i][3]],0,ght.x);
        }
    
        for(let i=0; i<phanton.skirt1.length; i++){
            if(ght.move){
                mirror("R",[ght.x+phanton.skirt1[i][0],ght.y+phanton.skirt1[i][1],phanton.skirt1[i][2],phanton.skirt1[i][3]],0,ght.x);
            }else{
                mirror("R",[ght.x+phanton.skirt2[i][0],ght.y+phanton.skirt2[i][1],phanton.skirt2[i][2],phanton.skirt2[i][3]],0,ght.x);
            }

            ght.count++;
            if(ght.count ==10){
                ght.count = 0;
                ght.move = !ght.move;
            }

        }
    
        fill(255);
    
        for(let i=0; i<phanton.eye.length; i++){
            mirror("R",[ght.x+phanton.eye[i][0],ght.y+phanton.eye[i][1],phanton.eye[i][2],phanton.eye[i][3]],0,ght.x-3);
        }
    
        fill(0);
    
        for(let i=0; i<phanton.look.length; i++){
            mirror("R",[ght.x+phanton.look[i][0],ght.y+phanton.look[i][1],phanton.look[i][2],phanton.look[i][3]],0,ght.x-3);
        }
    
    }

    for(let i=0; i<enemys.length; i++){

        showghost(enemys[i]);

    }

}