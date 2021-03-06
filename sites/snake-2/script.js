/* Big thanks to 
 * http://thecodeplayer.com/
 * for their tutorials.
 */

$(document).ready(function() {
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	var score = 0;
	var speed = 1;
	var high_score = 0;
	var gameInProgress = false;

	//Game paint interval
	var game_loop;
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake
	
	function init()
	{
		score = 0; //reset the score
		var delay = 110 - 10 * speed;
		d = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the score
		game_loop = setInterval(paint, delay);
	}

	showTitleScreen();

	function showTitleScreen() {
		if (score > high_score) high_score = score;
		$('#high-score').text(high_score);
		$('#score').text(score);
		$('#speed').text(speed);
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		//Create listeners for speed control buttons
		if (typeof game_loop == "undefined") {
			$('.btn-speed-up').click(function(event) {
				if (speed < 7 && !gameInProgress)
					$('#speed').text(++speed);
			});
			$('.btn-speed-down').click(function(event) {
				if (speed > 1 && !gameInProgress)
					$('#speed').text(--speed);
			});
		}
		//Show title screen and create one click listener for OK button
		$('.title-screen').fadeIn('slow', function() {
			$('.btn-ok').one('click', function(event) {
				gameInProgress = true;
				$('.title-screen').fadeOut('400');
				init();
			});
		});
	}
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "lightgreen";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "#25262d";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			gameInProgress = false;
			showTitleScreen();
			//Lets organize the code a bit now.
			return;
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score += speed;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}
		
		//Lets paint the food
		paint_cell(food.x, food.y);
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
		ctx.fillStyle = "#25262d";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "lightgreen";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}
	
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//The snake is now keyboard controllable
	})

	//This is additional phone keyboard controls
	$('.btn-left').click(function(event) {
		if (d != "right") d = "left";
	});

	$('.btn-up').click(function(event) {
		if (d != "down") d = "up";
	});

	$('.btn-right').click(function(event) {
		if (d != "left") d = "right";
	});

	$('.btn-down').click(function(event) {
		if (d != "up") d = "down";
	});
})