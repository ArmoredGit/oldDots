
var dots = [];
var gameSize = 0;
var nodes = [];
var Hlines = [];
var Vlines = [];
var counter =0;
var currentPlayer = 0;
var P1Score = 0;
var P0Score = 0;
var playerNumber = 2;
var difficulty = 0;
var AIexist = [];

function setup() {
	// createCanvas must be the first statement
  createCanvas(500, 500);
  gameSize = parseInt(prompt("game size?"))+1;
  playerNumber = parseInt(prompt("How many players? (1-2)"));
  P1Score = 0;
  P0Score = 0;
  background(0);
  dotsSet();
  lineSet();
  nodeSet();
  stroke(255);
  frameRate(30);
}


function AImove(){
  if(difficulty == 0){
    var pick = random(AIexist);
    var pickLine = findLineByIndex(pick);
    remove(AIexist, pick);
    if(pick.on == false){
      if (pick != null){
        pick.on = true;
      }
      if(trackNodes() == false){
        currentPlayer = currentPlayer == 0 ? 1 : 0;
      }
    }
  }
}

// places the "location" of all dots
function dotsSet(){
   for(var i=0;i<gameSize;i++){
     dots[i] = [];
    for(var j=0;j<gameSize;j++){
      var x = (width / (gameSize+1))*(i+1);
      var y = (height / (gameSize+1))*(j+1);
      dots[i][j] = createVector(x,y);
    }
   }
}


function remove(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

// places the "location" of all lines
function lineSet(){
  HlineSet();
  VlineSet();
}


function HlineSet(){
  for(var i=0;i<gameSize-1;i++){
    Hlines[i] = [];
    for(var j=0;j<gameSize;j++){
      Hlines[i][j] = {
        "origin": dots[i][j],
        "dest": dots[i+1][j],
        "on": false,
        "index": counter
        }
        AIexist.push(counter);
        counter++;
    }
   }
}


function VlineSet(){
  for(var i=0;i<gameSize;i++){
    Vlines[i] = [];
    for(var j=0;j<gameSize-1;j++){
      Vlines[i][j] = {
        "origin": dots[i][j],
        "dest": dots[i][j+1],
        "on": false,
        "index": counter
        }
        AIexist.push(counter);
        counter++;
    }
   }
}

// places the "location" of all boxes
function nodeSet(){
  for(var i=0;i<gameSize-1;i++){
    nodes[i] = [];
    for(var j=0;j<gameSize-1;j++){
      nodes[i][j] = {
        "top": findLine(dots[i][j].x, dots[i][j].y, dots[i+1][j].x, dots[i+1][j].y).index,
        "left": findLine(dots[i][j].x, dots[i][j].y, dots[i][j+1].x, dots[i][j+1].y).index,
        "bottom": findLine(dots[i][j+1].x, dots[i][j+1].y, dots[i+1][j+1].x, dots[i+1][j+1].y).index,
        "right": findLine(dots[i+1][j].x, dots[i+1][j].y, dots[i+1][j+1].x, dots[i+1][j+1].y).index,        
        "on": false,
        "owner":-1
        }
    }
   }
}

// tracks the status of all boxes
function trackNodes(){
  var newBox = false;
  for(var i=0;i<gameSize-1;i++){
    for(var j=0;j<gameSize-1;j++){
      var topLine = findLineByIndex(nodes[i][j].top);
      var rightLine = findLineByIndex(nodes[i][j].right);
      var bottomLine = findLineByIndex(nodes[i][j].bottom);
      var leftLine = findLineByIndex(nodes[i][j].left);
      if (topLine.on && rightLine.on && bottomLine.on && leftLine.on)
      {
        if(nodes[i][j].on == false){
          nodes[i][j].on = true;
          nodes[i][j].owner = currentPlayer;
          newBox = true;
          if(currentPlayer == 0){
            P0Score++;
          } else {
            P1Score++;
          }
        }
      }
    }
  }
  return newBox;
}

//xyxy - indexing number
function findLineByIndex(idx)
{
  for(var i=0;i<gameSize;i++){
    for(var j=0;j<gameSize-1;j++){
        if (Vlines[i][j].index == idx)
        return Vlines[i][j];
      }
    }
    for(var i=0;i<gameSize-1;i++){
      for(var j=0;j<gameSize;j++){
          if (Hlines[i][j].index == idx)
          return Hlines[i][j];
        }
      }
      return null;
  }

//confirms the existece of line xyxy
function findLine(x1,y1,x2,y2){
  for(var i=0;i<gameSize;i++){
    for(var j=0;j<gameSize-1;j++){
      if(x1==Vlines[i][j].origin.x && y1==Vlines[i][j].origin.y &&
        x2==Vlines[i][j].dest.x && y2==Vlines[i][j].dest.y){
          return Vlines[i][j];
      }
    }
   }

   for(var i=0;i<gameSize-1;i++){
    for(var j=0;j<gameSize;j++){
      if(x1==Hlines[i][j].origin.x && y1==Hlines[i][j].origin.y &&
        x2==Hlines[i][j].dest.x && y2==Hlines[i][j].dest.y){
          return Hlines[i][j];
      }
    }
   }
   return null;
}

function isLineSet(x1,y1,x2,y2){
  for(var i=0;i<gameSize;i++){
     for(var j=0;j<gameSize-1;j++){
       if(x1==Vlines[i][j].origin.x && y1==Vlines[i][j].origin.y &&
          x2==Vlines[i][j].dest.x && y2==Vlines[i][j].dest.y){
          return Vlines[i][j].on;
        }
      }
    }
  for(var i=0;i<gameSize-1;i++){
    for(var j=0;j<gameSize;j++){
      if(x1==Hlines[i][j].origin.x && y1==Hlines[i][j].origin.y &&
        x2==Hlines[i][j].dest.x && y2==Hlines[i][j].dest.y){
        return Hlines[i][j].on;
      }
    }
  }
  return false;
}

  function mouseClicked() { 
  var bounds = gameSize - 1;
  var gutter = 5;
   for(var i=0; i<gameSize; i++){
    for(var j=0; j<gameSize; j++){

      var x1 = dots[i][j].x;
      var y1 = dots[i][j].y;

      var x2 = x1;
      if (i < bounds)
      {
        x2 = dots[i+1][j].x;
      }

      var y2 = y1;
      if (j < bounds)
      {
        y2 = dots[i][j+1].y;
      }

      // did they click on a horizontal line?
      if (  (mouseX > x1) && 
            (mouseX < x2) && 
            (mouseY >= (y1 - gutter)) && 
            (mouseY <= (y1 + gutter)) &&
            isLineSet(x1,y1,x2,y1)==false)
      {
        var theline = findLine(x1,y1,x2,y1);
        if (theline != null)
        {
          theline.on = true;
        }
        if(trackNodes()==false){
          currentPlayer = currentPlayer == 0 ? 1 : 0 ;
          
        }
        return false;
      }

     // did they click on a vertical line?
     if ( (mouseY > y1) && 
          (mouseY < y2) && 
          (mouseX >= (x1 - gutter)) &&
          (mouseX <= (x1 + gutter)) &&
          isLineSet(x1,y1,x1,y2)==false)
     {
        var theline = findLine(x1,y1,x1,y2);
        if (theline != null)
        {
          theline.on = true;
        }
        if(trackNodes()==false){
          currentPlayer = currentPlayer == 0 ? 1 : 0 ;
          
        }
        return false;
     }
    }
   }
  return false;
}


function draw() {
  background(0);
  if(currentPlayer == 0){
    fill(255,0,0);
  } else {
    fill(0,0,255);
  }

  rect(0,0,width/(gameSize+1),height/(gameSize+1)/2);
   for(var i=0;i<gameSize;i++){
    for(var j=0;j<gameSize;j++){
      ellipse(dots[i][j].x, dots[i][j].y, 4, 4);
      fill(255);
    }
   }

//lines
   for(var i=0;i<gameSize;i++){
    for(var j=0;j<gameSize-1;j++){
      if(Vlines[i][j].on == true) {
        line(Vlines[i][j].origin.x,Vlines[i][j].origin.y,Vlines[i][j].origin.x,Vlines[i][j].dest.y);        
        stroke(255);
      }
    }
   }

   for(var i=0;i<gameSize-1;i++){
    for(var j=0;j<gameSize;j++){
      if(Hlines[i][j].on == true) {
        line(Hlines[i][j].origin.x,Hlines[i][j].origin.y,Hlines[i][j].dest.x,Hlines[i][j].origin.y);        
        stroke(255);
      }
    }
   }

//box
   for(var i=0;i<gameSize-1;i++){
    for(var j=0;j<gameSize-1;j++){
        if(nodes[i][j].on == true){
          if(nodes[i][j].owner == 0){
              fill(255,0,0);
              var topLine = findLineByIndex(nodes[i][j].top);
              rect(topLine.origin.x, topLine.origin.y, width / (gameSize+1), height / (gameSize+1));
            } 
            else if(nodes[i][j].owner == 1){
              fill(0,0,255);
              var topLine = findLineByIndex(nodes[i][j].top);
              rect(topLine.origin.x, topLine.origin.y, width / (gameSize+1), height / (gameSize+1));
            }
        }
      }
    }
    if(playerNumber == 1 && currentPlayer == 1){
      AImove();
    }
//score
   stroke(0);
   fill(255,0,0);
   text("player 1: " + P0Score, 10 + (width/(gameSize+1)), 20);
   fill(0,0,255);
   text("player 2: " + P1Score, 10 + (width/(gameSize+1))*3, 20);
   stroke(255);
   fill(255);
} 
