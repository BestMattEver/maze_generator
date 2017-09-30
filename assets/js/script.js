console.log("is js working?");

//this sets up the canvas
var gameCanvas1 = $("#gameCanvas1")[0];
var context1 = gameCanvas1.getContext("2d");
var width1 = gameCanvas1.width;
var height1 = gameCanvas1.height;

//this captures the click on the makeMaze button
$("body").on('click',"#makeMaze", function(){
	console.log("we clicked");
	var cellsX = $("#cellsX").val();
	var cellsY = $("#cellsY").val();
	var cellSize = $("#cellSize").val();

	console.log(cellsX+","+cellsY+","+cellSize);
var grid;
if(!cellsX || !cellsY || !cellSize)
{//if nothing is entered, use default values
	//initialize the grid
	grid = girdInit(20,25,25);
}
else
{//otherwise use whatever they entered
	//initialize the grid
	grid = girdInit(cellSize,cellsX,cellsY);
}

	//draw the gird
	drawGrid(grid, '#ff00ff', "#0b175b", "#2b43c6", 0,0);
//start carving...
carve(grid, 0, 0, 20, -1, -1, false);

//drawGrid(grid, '#ff00ff', "#0b175b", "#2b43c6",0,0);
//drawGrid(grid, '#ff00ff', "#0b175b", "#2b43c6");

});//end makeMaze click

function carve(grid, sX, sY, speed, prevX, prevY, debugsOn)
{
	//this checks if the previous cell's x and y are -1 (meaning this is the starting cell), and if yes we just make them match.
	if(prevX == -1 || prevY == -1)
	{
		prevX = sX;
		prevY = sY;
	}

  grid[sX][sY].beenTo = true; //we're in this square

  if(debugsOn){console.log("---------------------------- im in: ["+sX+"],["+sY+"] ------------------------------");}
  if(debugsOn){console.log("previous cell: ["+prevX+"],["+prevY+"]");}
    var unvisitedNeighbors =[];

    //check for unvisited neighbors
    if(sX-1<0)
    {
        if(debugsOn){console.log("west neighbor is off the side.");}
        //if its undefined, we're off the edge of the array so do nothing.
    }
    else
    {
      if(!grid[sX-1][sY].beenTo)
      {//if the western neighbor isnt visited
        unvisitedNeighbors.push(grid[sX-1][sY]);
      }
      if(debugsOn){console.log("have i been to the western Neighbor? : "+grid[sX-1][sY].beenTo);}
    }//end west neighbor check


    if(sX+1>grid.length-1)
    {
        if(debugsOn){console.log("east neighbor is off the side.");}
        //if its undefined, we're off the edge of the array so do nothing.
    }
    else
    {
      if(!grid[sX+1][sY].beenTo)
      {//if the eastern neighbor isnt visited
        unvisitedNeighbors.push(grid[sX+1][sY]);
      }
      if(debugsOn){console.log("have i been to the eastern Neighbor? : "+grid[sX+1][sY].beenTo);}
    }//end east neighbor check


    if(sY-1<0)
    {
        if(debugsOn){console.log("north neighbor is off the side.");}
        //if its undefined, we're off the edge of the array so do nothing.
    }
    else
    {
      if(!grid[sX][sY-1].beenTo)
      {//if the northern neighbor isnt visited
        unvisitedNeighbors.push(grid[sX][sY-1]);
      }
      if(debugsOn){console.log("have i been to the northern Neighbor? : "+grid[sX][sY-1].beenTo);}
    }//end north neighbor check

    if(sY+1>grid[0].length-1)
    {
        if(debugsOn){console.log("south neighbor is off the side.");}
        //if its undefined, we're off the edge of the array so do nothing.
    }
    else
    {
      if(!grid[sX][sY+1].beenTo)
      {//if the southern neighbor isnt visited
        unvisitedNeighbors.push(grid[sX][sY+1]);
      }
      if(debugsOn){console.log("have i been to the southern Neighbor? : "+grid[sX][sY+1].beenTo);}
    }//end north neighbor check

    if(debugsOn){console.log("my unvisited neighbors are:");}
    if(debugsOn){console.log(unvisitedNeighbors);}

    if(unvisitedNeighbors.length === 0)
    {//if we dont have any unvisited neighbors...
		if(debugsOn){console.log("NO UNVISITED NEIGHBORS!");}
		var anyUnvisited = false;

		//check for any unvisited cells...
		for(var i=0; i<grid.length; i++)
		{
			for(var f=0; f<grid[i].length; f++)
			{
				if(grid[i][f].beenTo == false)
				{
					anyUnvisited = true;
					if(debugsOn){console.log("still some unvisited on the board");}
				}
			}
		}

		if(anyUnvisited)//if any are found, go to the previous cell, and try carving again
		{
			var last = carve.path.pop(); //this pops the last cell off of the path stack to use as the previous cell in the carve call.

			try{//honestly not sure why i need this. but without it the thing throws an error
				carve(grid, prevX, prevY, 1, last.indexX, last.indexY, debugsOn);
			}
			catch(e){
				console.log(e);
				//return
			}
		}
		else//if no unvisited cells are found, end recursion. we're done!
		{return;}
    }
    else
    {//if we have unvisited neighbors, choose one and carve it!
      var rand = Math.floor(Math.random() * (unvisitedNeighbors.length - 1 + 1)) + 1;
      rand = rand - 1; //this accounts for the difference between .length and 0 indexing on arrays.
      if(debugsOn){console.log("we're going to the "+rand+" element in our unvisited neighbors");}

      var next = unvisitedNeighbors[rand];

      //now we figure out where in relation to the current cell the next cell is and destroy the walls between them
      if(next.indexX>sX)
      {
        if(debugsOn){console.log("we're going east to: ["+next.indexX+"],["+next.indexY+"]");}
        grid[sX][sY].wallE = false;
        //grid[(next.indexX)][(next.indexY)].wallW = false;
		next.wallW = false;
      }
      else if(next.indexX<sX)
      {
        if(debugsOn){console.log("we're going west to: ["+next.indexX+"],["+next.indexY+"]");}
        grid[sX][sY].wallW = false;
        //grid[(next.indexX)][(next.indexY)].wallE = false;
		next.wallE = false;
	  }
      else if(next.indexY>sY)
      {
        if(debugsOn){console.log("we're going south to: ["+next.indexX+"],["+next.indexY+"]");}
        grid[sX][sY].wallS = false;
        //grid[(next.indexX)][(next.indexY)].wallN = false;
		next.wallN = false;
	  }
      else if(next.indexY<sY)
      {
        if(debugsOn){console.log("we're going north to: ["+next.indexX+"],["+next.indexY+"]");}
        grid[sX][sY].wallN = false;
        //grid[(next.indexX)][(next.indexY)].wallS = false;
		next.wallS = false;
	  }
    }//end the else that makes sure we have unvisited neighbors.

      if(debugsOn){console.log("the walls in current cell ["+sX+"]["+sY+"]:");}
      if(debugsOn){console.log("wallE: "+grid[sX][sY].wallE);}
      if(debugsOn){console.log("wallN: "+grid[sX][sY].wallN);}
      if(debugsOn){console.log("wallS: "+grid[sX][sY].wallS);}
      if(debugsOn){console.log("wallW: "+grid[sX][sY].wallW);}


      drawGrid(grid, '#ff00ff', "#0b175b", "#2b43c6", sX, sY);


	//im using a trick of JS here to keep track of info between calls to this function. usually I would just use a static variable.
	//js functions are ALSO objects. so I am defining an array that is part of that object and using it to keep track of where we've been in the grid.
	if(typeof carve.path == 'undefined')
	{ carve.path = [];}
	carve.path.push(grid[sX][sY]); //this pushes the current cell onto the path stack. but only if we're moving forward. not if we have to carve back to the previous cell

    carve(grid, next.indexX, next.indexY, 1, sX, sY, debugsOn);


}//end carve

//  _
// |_|


function girdInit(size, cellsX, cellsY)
{//size is the width and height of the square cells
 //cellsx is the number of horizontal cells in the grid
 //cellsy is the number of vertical cells in the grid
 console.log("initializing grid...");
  var gameGrid=[];//initializes the grid array

  for(var i=0; i<cellsX; i++)
  {
    //console.log("building col: "+i);
    gameGrid[i]=[]; //initializes each column in the grid array
    for(var f=0; f<cellsY; f++)
    {
      //console.log("building cell: "+"["+i+","+f+"]");
      gameGrid[i][f] = new Cell(size*i, size*f, size, size, i, f);
      //console.log(gameGrid[i][f]);
    }//end x for loop
  }//end y for loop

  return gameGrid;
}//end gridInit


//this function just draws the grid, wall by wall
function drawGrid(grid, color, color2, color3, sX, sY)
{//grid is a grid array generated by the gridInit function.

  context1.clearRect(0, 0, width1, height1);//clear the grid
  //console.log("drawing grid...");
  context1.strokeStyle = color;

  for(var i=0; i<grid.length; i++)
  {
    for(var f=0; f<grid[i].length; f++)
    {
      if((i===sX)&&(f===sY))
      {
       // console.log(grid[i][f]);
      }

      //draw a background for this cell.
      if(grid[i][f].beenTo)
      {
      //  console.log("drawing the beenTo background");
        context1.fillStyle = color2;
        context1.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
      }
      else
      {
        //console.log("drawing the regular background");
        context1.fillStyle = color3;
        context1.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
      }

      var wallSTruth = grid[i][f].wallS;
      var wallNTruth = grid[i][f].wallN;
      var wallETruth = grid[i][f].wallE;
      var wallWTruth = grid[i][f].wallW;

      //draw northwall
      //console.log("drawing north wall of cell: ["+i+","+f+"]");
      if(wallNTruth)
      { context1.strokeStyle = color;
        context1.beginPath();
        context1.moveTo(grid[i][f].x, grid[i][f].y);
        context1.lineTo((grid[i][f].x+grid[i][f].w),grid[i][f].y);
        context1.stroke();
        context1.closePath();
      }//end draw north wall

      //draw eastwall
      //console.log("drawing east wall of cell: ["+i+","+f+"]");
      if(wallETruth)
      {
        //console.log("wallE: "+grid[i][f].wallE);
        context1.strokeStyle = color;
        context1.beginPath();
        context1.moveTo((grid[i][f].x+grid[i][f].w), grid[i][f].y);
        context1.lineTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
        context1.stroke();
        context1.closePath();
      }//end draw east wall

      //draw southwall
      //console.log("drawing south wall of cell: ["+i+","+f+"]");
      if(wallSTruth)
      { context1.strokeStyle = color;
        context1.beginPath();
        context1.moveTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
        context1.lineTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
        context1.stroke();
        context1.closePath();
      }//end draw south wall

      //draw westwall
      //console.log("drawing west wall of cell: ["+i+","+f+"]");
      if(wallWTruth)
      {
        //console.log("wallW: "+grid[i][f].wallW);
        context1.strokeStyle = color;
        context1.beginPath();
        context1.moveTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
        context1.lineTo(grid[i][f].x,grid[i][f].y);
        context1.stroke();
        context1.closePath();
      }//end draw west wall

    }//end x for loop
  }//end y for loop
}//end drawGrid

//this is the cell constructor. it represents the info for each cell on our grid.
function Cell(x, y, h, w, indexX, indexY)
{
  this.x = x; //this is the x pixel location of the top left corner of this cell on the canvas object
  this.y = y; //this is the y pixel location of the top left corner of this cell on the canvas object
  this.h = h; //how tall the cell is
  this.w = w; // how wide the cell is
  this.indexY = indexY; //this is the Y index of this cell on the grid
  this.indexX = indexX; //this is the X index of this cell on the Grid

  this.wallN = true; //is this cell's north wall up?
  this.wallE = true; //is this cell's east wall up?
  this.wallS = true; //is this cell's south wall up?
  this.wallW = true; //is this cell's west wall up?
  this.beenTo = false; //have we been to this cell before?
}//end constructor
