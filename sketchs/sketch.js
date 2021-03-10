//********* GLOBAL DATA *********//

const screen = [768,630];
const pixel = [screen[0]/256, screen[1]/240];
const enemy_colors = [[247,155,0],[230,38,35],[247,179,215],[0,247,216]];
const enemys = [];
let dots;
let last_dots = 0;
let next_life = 10000;

let pause = false;
let new_hiscore = false;

const squares = [[13,0,1,4],
    [2,2,3,2],[7,2,4,2],
    [2,6,3,1],[7,6,1,7],[10,6,7,1],[13,7,1,3],
    [0,9,5,4],[8,9,3,1],
    [10,12,7,4],
    [0,15,5,4],[7,15,1,4],
    [10,18,7,1],[13,19,1,3],
    [2,21,3,1],[7,21,4,1],[4,22,1,3],
    [0,24,2,1],[10,24,7,1],[13,25,1,3],
    [2,27,9,1],[7,24,1,3],
    [0,0,27,30]];

const phanton = {
    body:[[-12,0,12,9],[-9,-6,9,6],[-6,-9,6,3]],
    skirt1: [[-9,9,3,3],[-3,9,3,3]],
    skirt2: [[-12,9,3,3],[-6,9,3,3]],
    eye :[[-9,-3,3,6]],
    look : [[0,0,3,3]],
};

//*********  CLASSES  *********//

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
    pacman.lifes = 2;
    pacman.die = false;
    pacman.count = 0;

class Enemy{
    constructor(x,y,n){
        this.x = x;
        this.y = y;
        this.mov_x = 0;
        this.mov_y = 0;
        this.rad = 13;
        this.mode = "atack";
        this.num = n;
        this.speed = 1;
        this.side = 0;
        this.move = true;
        this.count = 0;
        this.die = false;
    }
}

Enemy.prototype.run = function(){
    
    const pos = ([Math.round((this.x - bd.x) / bd.p),Math.round((this.y - bd.y) / bd.p)]);
    
    if(pos[0] >10 && pos[0] < 17 && pos[1] > 10 && pos[1] < 16 ){
        this.mode = "born";
        this.die = false;
    }

    if(this.mode == "atack"){ // em ataque
        this.goto(pacman.x,pacman.y)
    }else if(this.mode == "born"){
        switch(this.num){
            case 0:
                this.turn_left();
            break;
            case 1:
                this.turn_up();
            break;
            case 2:
                this.turn_down();
            break;
            case 3:
                this.turn_rigth();
        }
        this.mode = "atack";
    }else if(this.mode == "runaway"){
        this.goto(bd.x + 13 * bd.p, bd.y + 13 * bd.p); // foge para a base
    }

    this.x += this.mov_x;
    this.y += this.mov_y;
    secretPass(this);
}

Enemy.prototype.goto = function(X,Y){

    const walls = wall(this);
    const turn = turnpoint(this);

    if(this.mov_y == 0 && turn[0]){ // movendo em X e esquina em Y
        if(Y > this.y && !walls[3]){ // pacman abaixo e caminho aberto abaixo
            this.turn_down();                
        }else if(Y < this.y && !walls[1]){ // pacman acima e caminho aberto acima
            this.turn_up();
        }else{
            if(this.mov_x > 0 && walls[0]){ // movendo p/ direira e encontrou parede
                this.force("V",walls);
            }else if(this.mov_x < 0 && walls[2]){ // movendo p/ esquerda e encontrou parede
                this.force("V",walls);
            }
        }

    }else if(this.mov_x == 0 && turn[1]){
        if(X > this.x && !walls[0]){
            this.turn_rigth();
        }else if(X < this.x && !walls[2]){
            this.turn_left();
        }else{
            if(this.mov_y > 0 && walls[3]){ // movendo p/ baixo e encontrou parede
                this.force("H",walls);
            }else if(this.mov_y < 0 && walls[1]){ // movendo p/ cima e encontrou parede
                this.force("H",walls);
            }                
        }
    }
}

Enemy.prototype.force = function(axis,walls){
    if(axis == 'H'){
        if(!walls[0]){ //não tem parede a direita
            this.turn_rigth();
        }else if(!walls[2]){ // não tem parede a esquerda
            this.turn_left();
        }
    }else{
        if(!walls[3]){ //não tem parede abaixo
            this.turn_down();
        }else if(!walls[1]){ // não tem parede acima
            this.turn_up();
        }        
    }
}

Enemy.prototype.turn_rigth = function(){
    this.mov_x = this.speed;
    this.mov_y = 0;
}
Enemy.prototype.turn_up = function(){
    this.mov_x = 0;
    this.mov_y = -this.speed;    
}
Enemy.prototype.turn_left = function(){
    this.mov_x = -this.speed;    
    this.mov_y = 0;
}
Enemy.prototype.turn_down = function(){
    this.mov_x = 0;
    this.mov_y = this.speed;    
}

//********* FUNCTIONS **********//

function preload(){
    font = loadFont('press_start.ttf');
    hi = loadJSON('hiscore.json');
}

function setup() {
    createCanvas(screen[0],screen[1]);
    textSize(20);
    textAlign(10, 10);
    textFont(font);
    fillBoard();
    for(let i=0; i<4; i++){ // fill enemys
        enemys.push(new Enemy(bd.x + bd.p * (12 + i) , bd.y + bd.p * 13,i));
    }

}

function draw() {
    background(bd.bg);
    placar();
    drawBord(10);
    drawDots();
    drawGhost();
    drawPacman();
    if(!pause){
        move();
        moveGhosts();    
    }    
}

function keyPressed() {

    let pos = ([(pacman.x - bd.x) % bd.p,(pacman.y - bd.y) % bd.p]);
    const walls = wall(pacman);

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

    } else if(keyCode == ENTER){
        pause = !pause;
    }
  }

function restart(){
    if(pacman.lifes >= 0){
        pacman.x = bd.x + bd.p * 13.5;
        pacman.y = bd.y + bd.p * 23;
        pacman.die = false;
        pacman.count = 0;
        pacman.side = 0;
        for(let i=0; i<4; i++){ // fill enemys
            enemys[i].x = bd.x + bd.p * (12 + i);
            enemys[i].y = bd.y + bd.p * 13;
            enemys[i].mode = "born";
            enemys[i].die = false;
        }
        pause = false;
    }else{
        fill(255,0,0);
        text("GAME OVER", bd.x + bd.p * 8.6, bd.y + bd.p * 14.6, 200, 150);
        save_hiscore();
    }

}

function save_hiscore(){
    if(new_hiscore){
        new_hiscore = false;
        const data = new URLSearchParams();
        data.append('key','senha123');
        data.append('scores',JSON.stringify(hi));
        const myRequest = new Request('save_hiscores.php',{
            method: 'POST',
            body: data
        });                
        fetch(myRequest);
    }
}

function hit(N){
    if((pacman.x + pacman.rad >= enemys[N].x - enemys[N].rad/2) && (pacman.x - pacman.rad <= enemys[N].x + enemys[N].rad/2)){
        if((pacman.y + pacman.rad >= enemys[N].y - enemys[N].rad/2) && (pacman.y - pacman.rad <= enemys[N].y + enemys[N].rad/2)){
            if(enemys[N].mode != "runaway"){
                pacman.die = true;
                pacman.mov_x = 0;
                pacman.mov_y = 0;        
            }else{
                if(!enemys[N].die){
                    enemys[N].die = true;
                    pacman.score += 300;
                }
            }
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

function drawBord(weigth=pixel, filler=false){

    if(filler){
        fill(bd.color);
    }else{
        noFill();
    }
    stroke(0,0,255);
    strokeWeight(weigth);

    for(let i=0; i<squares.length; i++){
        mirror("R",[ bd.x + squares[i][0] * bd.p , bd.y + squares[i][1] * bd.p, squares[i][2] * bd.p, squares[i][3] * bd.p],bd.x + bd.p * 13.5 );
    }

    if(!filler){
        fill(0);
        stroke(0);
        mirror("R",[bd.x,bd.y + bd.p * 13.5,100,18],bd.x + bd.p * 13.5);
    }    

}

function fillBoard(){
    background(0, 0, 0);
    last_dots = 0;
    squares.splice(squares.length-1,1); // deleta o quadrado da borda
    squares.push([7,9,13,10]);  // adiciona os quadrados de limpeza do centro do tabuleiro
    squares.push([0,9,5,10]);
    squares.push([13,23,2,2]);
    drawBord(6,true);
    squares.splice(squares.length-3,3); // remove os quadrados de limpeza do centro do tabuleiro
    squares.push([0,0,27,30]); // coloca novamente o quadrado da borda
    dots = [[]];
    for(let y=1; y<=29; y++){
        dots.push([]);
        for(let x=1; x<=26;x++){
            let color = get(bd.x + x * bd.p , bd.y + y * bd.p);
            if(color[2] == 0){
                dots[y].push(x);
                last_dots += 1;
            }
        }
    }
    
}

function placar(){

    const zeroPad = (num, places) => String(num).padStart(places, '0');

    noStroke();
    fill(255,155,0); // VERMELHO
    text("HI SCORE", 550, 100, 200, 150);
    text("1P"      , 550, 200, 200, 150);
    text("LIFES"      , 550, 300, 200, 150);

    fill(255,255,255); // BRANCO
    text(zeroPad(hi.score,8)     , 550, 130, 200, 150);
    text(zeroPad(pacman.score,8), 550, 230, 200, 150);
    
    if(parseInt(pacman.score) >= next_life){
        pacman.lifes +=1;
        next_life += 10000;
    }

    if(parseInt(pacman.score) > parseInt(hi.score)){
        hi.score = pacman.score;
        new_hiscore = true;
    }

    fill(255,255,0); // AMARELO
    for(let i=0; i<pacman.lifes; i++){
        arc(560 + (i * 25),330, 20, 20, 0.5, PI * 1.8  , PIE);
    }
}

function mirror(T,D,C){
    const x = D[0];
    const y = D[1];
    const w = D[2];
    const h = D[3];

    if(T == "L"){
        line(x,y,w,h);
        line(screen[0]-x,y,screen[0]-w,h);
    }else if(T == "R"){
        rect(x,y,w,h);
        rect(2*C-x-w, y, w, h);
    }

}

function drawDots(diam = 1){
    noFill();
    stroke(255,255,0);
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

function drawPacman(){

    fill(pacman.color);
    stroke(255,255,0);
    strokeWeight(pixel);
    ellipseMode(CENTER);
    if(pacman.die){
        if(pacman.count < 1){
            pacman.count += 0.01;
            arc(pacman.x,pacman.y, pacman.rad, pacman.rad, (1.5 + pacman.count) * PI  , (1.5 - pacman.count) * PI  , PIE);
        }else{ // restart
            pacman.lifes -= 1;
            restart();
        }
    }else{
        arc(pacman.x,pacman.y, pacman.rad, pacman.rad, (pacman.mounth*PI) - (PI/2 * pacman.side), 2*PI - (pacman.mounth*PI) - (PI/2 * pacman.side)  , PIE);
    }
    noFill();

    if(pacman.open){
        pacman.mounth += 0.03;
    }else{
        pacman.mounth -= 0.03;
    }

    if(pacman.mounth >=0.4){
        pacman.open = false;
    }else if(pacman.mounth <=0.13){
        pacman.open = true;
    }
}

function move(){    
    const walls = wall(pacman);
    if(!walls[pacman.side]){
        pacman.x += pacman.mov_x;
        pacman.y += pacman.mov_y;    
        eat();
    }
    secretPass(pacman);    
}

function secretPass(obj){
    if(obj.x <= bd.x){ // secret pass
        obj.x = bd.x + bd.p * 27;
    }else if(obj.x >= bd.x + bd.p * 27){
        obj.x = bd.x;
    }
}

function moveGhosts(){
    for(let i=0; i<enemys.length; i++){
        enemys[i].run();
    }
}

function eat(){

    let pos = [Math.floor((pacman.x - bd.x) / bd.p),Math.floor((pacman.y - bd.y) / bd.p)] // pega a linha 
    const found = dots[pos[1]].indexOf(pos[0]); // procura o indice da posição na linha se ela existir

    if(found >= 0){
        pacman.score += 10;
        dots[pos[1]].splice(found,1);
        last_dots -= 1;
        if((pos[0] == 1 || pos[0] == 26) && (pos[1] == 3 || pos[1] == 28)){ // pill      
            pacman.score += 40;
            for(let i=0; i<enemys.length; i++){ 
                enemys[i].mode = "runaway" ;
            }
        }
        if(last_dots <= 0){            
            fillBoard();
            restart();
            save_hiscore();
        }
    }
}

function drawGhost(){

    function showghost(ght){
        let color;
        if(ght.mode == "runaway"){
            color = [0,0,255];
        }else{
            color = enemy_colors[ght.num];
        }

        fill(color);
        noStroke();
    
        if(!ght.die){

            for(let i=0; i<phanton.body.length; i++){
                mirror("R",[ght.x+phanton.body[i][0],ght.y+phanton.body[i][1],phanton.body[i][2],phanton.body[i][3]],ght.x);
            }
        
            for(let i=0; i<phanton.skirt1.length; i++){
                if(ght.move){
                    mirror("R",[ght.x+phanton.skirt1[i][0],ght.y+phanton.skirt1[i][1],phanton.skirt1[i][2],phanton.skirt1[i][3]],ght.x);
                }else{
                    mirror("R",[ght.x+phanton.skirt2[i][0],ght.y+phanton.skirt2[i][1],phanton.skirt2[i][2],phanton.skirt2[i][3]],ght.x);
                }
    
                ght.count++;
                if(ght.count ==10){
                    ght.count = 0;
                    ght.move = !ght.move;
                }
    
            }
        
            fill(255);        
            for(let i=0; i<phanton.eye.length; i++){
                mirror("R",[ght.x+phanton.eye[i][0],ght.y+phanton.eye[i][1],phanton.eye[i][2],phanton.eye[i][3]],ght.x-3);
            }
        
        }

        fill(255);    
        for(let i=0; i<phanton.eye.length; i++){
            mirror("R",[ght.x+phanton.eye[i][0],ght.y+phanton.eye[i][1],phanton.eye[i][2],phanton.eye[i][3]],ght.x-3);
        }

        fill(0);        
        for(let i=0; i<phanton.look.length; i++){
            mirror("R",[ght.x+phanton.look[i][0],ght.y+phanton.look[i][1],phanton.look[i][2],phanton.look[i][3]],ght.x-3);
        }
    }

    for(let i=0; i<enemys.length; i++){
        showghost(enemys[i]);
        hit(i);
    }

}