var Character = function()
{
	var walkRight = false;
	var walkLeft = false;
	var jumping = false;
		var maxSpeed = 10
		var jumpSpeed = 30;
	
var speedX = 0;
	var speedY = 0;
	
	var _image = new Image();
	_image.src = 'img/player.png';
	
	
	function _animate(map, camera, canvas, _level){
		
		
		
		//speed = speed/2;
		
		
			var speed = 5;	
			
			
		
	
			var playerTileX =	 Math.floor( (this.x + 20) / 40 );  
			var playerTileY =    Math.floor( (this.y + 20) / 40 );
			var playerTileYFalling =    Math.floor( (this.y + speed + 40) / 40 ) ;
		
			if(walkRight) {

			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Walking right
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(" y=" + playerTileY + " x=" +  playerTileX  + "  value="+map[  playerTileY  ][  playerTileX ]);
			if(map[  playerTileY  ][playerTileX + 1] == 0){
				if(speedX < maxSpeed){
					speedX += 1;
				}
			}else{
				if(speedX > 0){
					speedX = 0;
				}
			}
		}else{
			speedX *= .9;
		}	
		
		
		
		

		if(walkLeft) {
			
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Walking left
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(" y=" + playerTileY + " x=" +  playerTileX  + "  value="+map[  playerTileY  ][  playerTileX ]);
			if(map[ playerTileY ][playerTileX - 1] == 0){	
			
				if(speedX > -maxSpeed){
					speedX -= 1;
				}
			}else{
				if(speedX < 0){
					speedX = 0;
				}
			}

		}else{
			speedX *= .9;
		}
		
		
		
		if(jumping){
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Jumping
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			if(map[playerTileYFalling - 2][playerTileX] == 0){
				if(speedY > -(jumpSpeed)){
					speedY -= speed * 2;
				}else{
					jumping = false;
				}
			}else{
				if(speedY< 0){
					speedY =0;
				}
				
			}
			
			
		}
		
		
		
		
		
		if(map[playerTileYFalling][playerTileX] == 0){
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//Gravity
			//////////////////////////////////////////////////////////////////////////////////////////////////////////c
			//console.log(   " if("+ camera.y +" > "+ (-canvas.height) + ")"  )
			//console.log(camera.y  );
			
			
			if(speedY < maxSpeed){
				speedY +=5;
			}
		}else{
			
			if(speedY > 0){
				speedY =0;
			}
		}
			
			
			
			
			
	
			
			
		this.x+= speedX;
		this.y += speedY;
		

	}


	function _walkLeft(){
		
		walkLeft= true;
	}
	
	function _stopLeft(){
		walkLeft = false;
		
	}
	function _walkRight(){
		walkRight = true;
	}
	function _stopRight(){
		walkRight = false;
	}
	function _jump(){
		
		jumping = true;
	}
	function _stopJump(){
		jumping = false;
		
	}
	return{
		x: 120,
		y: 40,
		width: 40,
		height: 43,
		image: _image,
		animate: _animate,
		moveLeft: _walkLeft,
		moveRight: _walkRight,
		stopRight: _stopRight,
		stopLeft: _stopLeft,
		jump: _jump,
		stopJump: _stopJump
	}	
}