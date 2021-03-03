//********* GLOBAL DATA *********//

const screen = [768,630];
const pixel = [screen[0]/256, screen[1]/240];

const bd = new Object; // board setup
    bd.x = 40;
    bd.y = 50;
    bd.p = 18;
    bd.color = (0,0,255);
    bd.bg = [0,0,0];

const pacman = new Object;
    pacman.x = bd.x + bd.p * 13.5;
    pacman.y = bd.y + bd.p * 23;
    pacman.rad = 13;
    pacman.color = [255,255,0];
    pacman.mounth = 0.3;
    pacman.open = true;
    pacman.side = 0;
    pacman.score = 0;

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
    ghost();
    move();

}

function keyPressed() {

  
    let pos = ([(pacman.x - bd.x) % bd.p,(pacman.y - bd.y) % bd.p])

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
        pacman.side = 0;
        horizontal();
    } else if (keyCode === UP_ARROW) {
        pacman.side = 1;
        vertical();

    } else if (keyCode === LEFT_ARROW) {
        pacman.side = 2;
        horizontal();

    } else if (keyCode === DOWN_ARROW) {
        pacman.side = 3;
        vertical();
    }
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
//        rect(screen[0]-x-w,y,w,h,R);
    }

}

function drawDots(diam = 2){
    noFill();

    for(let y=0; y<dots.length; y++){
        for(let x=0; x<dots[y].length;x++){
            circle(bd.x + dots[y][x] * bd.p , bd.y + y* bd.p,diam);
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

function move(){

    const edge = [[pacman.x + pacman.rad,pacman.y],[pacman.x , pacman.y - pacman.rad],[pacman.x - pacman.rad,pacman.y],[pacman.x , pacman.y + pacman.rad]]
    let wall;
    let x = 0;
    let y = 0;
    switch (pacman.side) {
        case 0:
            x = 1;
        break;
        case 1:
            y = -1;
        break;
        case 2:
            x = -1;
        break;
        case 3:
            y = 1;
        break;
    }

    if(get(edge[pacman.side][0],edge[pacman.side][1])[2] == 0){
        wall = false;
    }else{
        wall = true;
    }
  
    if(!wall){
        pacman.x += x;
        pacman.y += y;

        let pos = [Math.floor((pacman.x - bd.x) / bd.p),Math.floor((pacman.y - bd.y) / bd.p)]
        const found = dots[pos[1]].indexOf(pos[0]);

        if(found >= 0){
            pacman.score += 10;
            dots[pos[1]].splice(found,1);
        }
    }

    if(pacman.x <= bd.x){
        pacman.x = bd.x + bd.p * 27;
    }else if(pacman.x >= bd.x + bd.p * 27){
        pacman.x = bd.x;
    }

//    stroke(255,0,0);
//    circle(edge[pacman.side][0],edge[pacman.side][1],3);


}

const phanton = [
    [0,0,20,20],[5,-10,15,15],[10,-15,10,10]


];


function ghost(){

    const clyde = [247,155,0];
    const blinky = [230,38,35];
    const pink = [247,179,215];
    const inky = [0,247,216];

    function drawGhost(color){
        fill(color);
        noStroke();

        let x = 600;
        let y = 350


        for(let i=0; i<phanton.length; i++){
            mirror("R",[x+phanton[i][0],y+phanton[i][1],phanton[i][2],phanton[i][3]],0,x+15);
        }


    }

    drawGhost(clyde);


}