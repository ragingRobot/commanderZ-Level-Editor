$(document).ready(function() {

	var myEngine = new Engine();
	myEngine.load();
	
	var binding = new KeyBindings();
	binding.setup(myEngine);
	
});


var Engine = function() {
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//STUFF I WILL NEED LATER
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var _timeOut, _tileSheet, ctx, canvas, _level, _levelContext;
	var walkLeft = false, walkRight = false;
	var _jumping = false;
	var jumpstart = true;
	var player = new Character();
	var camera = {x : 0, y : 0};
	var tiles = LevelManager.getInstance().level;
	
	
   // requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    
	//var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame, startTime = window.mozAnimationStartTime || Date.now();
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//SETUP STUFF
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function _load() {
		/**************************************************************************************************************************************
		 *This sets up all the stuff needed for the engine 
		 **************************************************************************************************************************************/
		canvas = document.getElementById('tutorial');
		_level = document.createElement('canvas');
		_characters = new Array();
		
		_characters.push(player);
		if(canvas.getContext) {
			ctx = canvas.getContext('2d');
			canvas.width = $("body").width();
			canvas.height = $("body").height() - 100;

			_level.width = 40 * tiles[0].length;
			_level.height = 1000;
			_levelContext = _level.getContext('2d');

			$(window).resize(function() {
				canvas.width = $("body").width();
				canvas.height = $("body").height() - 100;
				_drawTiles();
			});
			// drawing code here
		} else {
			// canvas-unsupported code here
		}

		_tileSheet = new Image();
		_tileSheet.src = 'img/tiles.jpg';
		_tileSheet.onload = function() {
			_drawTiles();
			animate();
		}
	}


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//GAME LOOP
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function animate() {
    requestAnimFrame( animate );
    draw();

}


	function draw(timestamp) {

		//calculate difference since last repaint
		var drawStart = (timestamp || Date.now()), diff = 1;//drawStart - startTime;

		//use diff to determine correct next step
		var jumpspeed = 0;
		var speed = 5;
		var cameraFallSpeed = speed * 2;
		//speed = speed/2;
		
		var playerTileX =	 Math.floor( (player.x - camera.x + 20) / 40 );  
		var playerTileY =    Math.floor( (player.y - camera.y) / 40 );
		var playerTileYFalling =    Math.floor( (player.y - camera.y + speed + 40) / 40 ) ;
		
		/*
		
		if(walkRight) {

			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Walking right
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(" y=" + playerTileY + " x=" +  playerTileX  + "  value="+tiles[  playerTileY  ][  playerTileX ]);
			if(tiles[  playerTileY  ][playerTileX + 1] == 0){
				if(camera.x > canvas.width - _level.width + speed) {
					camera.x -= speed * 2;
				} 	
				player.x += speed;
			}
		}
		
		
		
		

		if(walkLeft) {
			
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Walking left
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(" y=" + playerTileY + " x=" +  playerTileX  + "  value="+tiles[  playerTileY  ][  playerTileX ]);
			if(tiles[ playerTileY ][playerTileX - 1] == 0){	
				if(camera.x < -speed) {
					camera.x += speed * 2;
				} 
				player.x -= speed;
			}

		}
		
		
		
		if(_jumping){
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Jumping
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			if(jumpspeed == 0 && jumpstart)
			{
				jumpspeed = speed * 8;
				jumpstart = false;
				
				setTimeout(function(){ jumpstart = true;},300);
				
			}
			
			
			if(tiles[ playerTileYFalling - 1][playerTileX] == 0){
				if(camera.y < -speed) {
					camera.y += jumpspeed * 2;		
				} 
				player.y -= jumpspeed;
				jumpspeed = jumpspeed  * .2;
			}	
			
			
			if(jumpspeed < 1){
				jumpspeed = 0;
				_jumping = false;
			}
			
			
		}
		
		
		
		
		
		
		if(tiles[playerTileYFalling ][playerTileX] == 0){
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Gravity
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(   " if("+ camera.y +" > "+ (-canvas.height) + ")"  )
			//console.log(camera.y  );
			
			
			if(camera.y > (canvas.height - _level.height )) {
				
				camera.y -= cameraFallSpeed;		
			} 
			player.y += speed;
		}else{
			//player.y = playerTileY * player.height; 
		}
			
			
			
			
			
			
			*/
			
			player.animate(tiles, camera, canvas, _level);
			
			
		//////////////////////////////////////////////////////////////////////////////////////////////////////////c
		//drawing everything to the screen
		//////////////////////////////////////////////////////////////////////////////////////////////////////////c	
		//_drawTiles();
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(_level, 0, 0, _level.width, _level.height, camera.x, camera.y, _level.width, _level.height);
		drawCharacters();

		//reset startTime to this repaint
		startTime = drawStart;

	}










	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//RENDERING FUNCIONS
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function _drawTiles() {
		//_levelContext.clearRect(0, 0, _level.width, _level.height);

		for(var i = 0; i < tiles.length; i++) {
			for(var j = 0; j < tiles[0].length; j++) {
				var tile = tiles[i][j];

				_levelContext.drawImage(_tileSheet, tile * 40, 0, 40, 40, j * 40, i * 40, 40, 40);
			}
		}
	}
		

	
	function drawCharacters()
	{
		for(var i = 0; i < _characters.length; i++) {
			
			
				ctx.drawImage(_characters[i].image, 0, 0, _characters[i].width	, _characters[i].height, _characters[i].x, _characters[i].y, _characters[i].width	, _characters[i].height);
		}
	}




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//UTILITY STUFF
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function createContext(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//MOVING STUFF
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function _moveRight() {
		walkRight = true;
	}

	function _stopRight() {

		walkRight = false;
	}





	function _moveLeft() {
		walkLeft = true;
	}

	function _stopLeft() {

		walkLeft = false;
	}



	
	function _jump()
	{
		
		_jumping = true;
		
	}
	
	function _stopjump()
	{
		
		_jumping = false;
		
	}





	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//MAKE STUFF PUBLIC
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return {
		load : _load,
		player: player,
		jump : _jump,
		stopJump : _stopjump
	}

}



