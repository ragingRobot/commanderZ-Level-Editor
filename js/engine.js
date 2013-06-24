$(document).ready(function() {

	var myEngine = new Engine();
	myEngine.load();
	
	var binding = new KeyBindings();
	binding.setup(myEngine);
	
	
	var currentTool = 0;

	$(".tileList.tools li").each(function(i){
		
		
		var tilesize = 40;
		var rowlength = 13;
	
		var x = Math.floor((i % rowlength)) * tilesize;
		var y = Math.floor((i / rowlength)) * tilesize;
				
		$(this).css({"background-position": "-"+ x +"px -"+ y + "px" });
		
		$(this).click(function(){
			currentTool = i;
			$(".active").removeClass("active");
			$(this).addClass("active");
			console.log("current tool:"+ currentTool);
		});
	});
	
	

	$("#tutorial").click(function(e){
		var x = Math.floor(e.offsetX / 40);
		var y= Math.floor(e.offsetY/40);
		console.log(e);
		
		
		myEngine.changeTile(x,y, currentTool); 
	});
	
	
	
	var down = false;
	
	$("#tutorial").on("mousedown",function(e){
		down = true;
	});
	
	
	$("#tutorial").on("mousemove",function(e){
		if(down){
			var x = Math.floor(e.offsetX / 40);
			var y= Math.floor(e.offsetY/40);
			console.log(e);
			myEngine.changeTile(x,y, currentTool); 
		}
	});
	
	
	$("#tutorial").on("mouseup",function(e){
		down = false;
	});
	
	$(".save").click(function(){
		myEngine.save();
	});
	
	
	$("#tutorial").mousemove(function(e){
		
		var x = Math.floor(e.offsetX / 40);
		var y= Math.floor(e.offsetY/40);
		$(".x-display").text(x);
		$(".y-display").text(y);
		$(".value-display").text(myEngine.getValue(x,y));
		
	});
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
	var dataToSend;
	var deathTiles = [13,14, 15, 16, 17, 18];
	var nextTile = 25;
	var startTile = 24;
	var switchTile =4;
	var switchDownTile =5;
	var levelfile = "levels/1.json";
	var nextLevel =  "http://www.jmilstead.com/commanderz/levels/new.json" ;
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
		
		
		
		if(getParameterByName("level") != ""){
			
			levelfile =  getParameterByName("level"); 
		}
		getLevel();
		
		canvas = document.getElementById('tutorial');
		_level = document.createElement('canvas');
		_characters = new Array();
		
		//_characters.push(player);
		if(canvas.getContext) {
			ctx = canvas.getContext('2d');
			canvas.width = 1320;//$("body").width();
			canvas.height = 1500;

			_level.width = 40 * tiles[0].length;
			_level.height = 1500;
			_levelContext = _level.getContext('2d');

			$(window).resize(function() {
				canvas.width = 1320;//$("body").width();
				canvas.height = 1500;//$("body").height() - 100;
				_drawTiles();
			});
			// drawing code here
		} else {
			// canvas-unsupported code here
		}

		_tileSheet = new Image();
		_tileSheet.src = 'img/tilestitle.png';
		_tileSheet.onload = function() {
			_drawTiles();
			animate();
		}
	}

	
	
	
	
	function getLevel(){
		
		$.ajax({
		  url: levelfile ,
		  dataType: 'json',
		  data: "",
		  success:function(e){
		  	
		  	console.log(e);
			dataToSend = e;
		  	tiles = e.map;
		  	
		  	for( var i =0 ; i < e.triggers.length ; i++){
		  		
		  		if(e.triggers[i].type == "nextLevel"){
		  			var nextLevel = e.triggers[i].url;
		  			$("#nextLevel").val( nextLevel);
		  		}
		  		
		  		
		  		if(e.triggers[i].type == "switch"){
		  			
		  	var html = "<div class='switch-options'><h4>these tiles change when map[<span class='y'>"+ e.triggers[i].y +"</span>][<span class='x'>"+ e.triggers[i].x +"</span>] is triggered:</h4><div class='tile-option-container'>";
		  	//html += "<div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div>";
		  	
		  	for(var j = 0; j < e.triggers[i].tilesToChange.length ; j++)
		  	{
		  		html += "<div class=\"effected-tile\"><label>x</label><input type=\"test\" class=\"tile-to-change-x\" value=\""+ e.triggers[i].tilesToChange[j].x +"\"><label>y</label><input type=\"test\" class=\"tile-to-change-y\" value=\""+ e.triggers[i].tilesToChange[j].y +"\"><label>value</label><input type=\"text\" class=\"tile-to-change-value\" value=\""+ e.triggers[i].tilesToChange[j].value +"\"></div>";
		  	}
		  	
		  	html += "</div></div>";
			
			
			$(".switches").append(html);
			
		  	
		  		}
		  	}
		  	
		  	
		  	
		
		  	
		  	
		  	
		  	
		  }
		});
		
		
		$("#updateLevelLink").click(function(e){
			e.preventDefault();
			nextLevel = $("#nextLevel").val();
		});
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
		
		
			
			player.animate(tiles, camera, canvas, _level);
			
			
		//////////////////////////////////////////////////////////////////////////////////////////////////////////c
		//drawing everything to the screen
		//////////////////////////////////////////////////////////////////////////////////////////////////////////c	
		//_drawTiles();
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.clearRect ( 0 , 0 , 1320 , 1000);
	
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
		var tilesize = 40;
		var rowlength = 13;
		_levelContext.clearRect ( 0 , 0 , 1320 , 1000);
		
		for(var i = 0; i < tiles.length; i++) {
			for(var j = 0; j < tiles[0].length; j++) {
				var tile = tiles[i][j];
				
		   
				var x =  Math.floor((tile % rowlength)) * tilesize;
				var y =  Math.floor((tile / rowlength)) * tilesize;
				_levelContext.drawImage(_tileSheet, x, y, tilesize, tilesize, j * tilesize, i * tilesize, tilesize, tilesize);
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


	 function _changeTile(x, y, val)
	 {
	 	tiles[y][x] = val;
	 	
	 	//this adds trigger options for switches
		if(val == switchTile){
			//the html to add to the menu for input
			var html = "<div class='switch-options'><h4>these tiles change when map[<span class='y'>"+ y +"</span>][<span class='x'>"+ x +"</span>] is triggered:</h4><div class='tile-option-container'><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div><div class='effected-tile'><label>x</label><input type='test' class='tile-to-change-x' /><label>y</label><input type='test' class='tile-to-change-y' /><label>value</label><input type='test' class='tile-to-change-value' /></div></div></div>";
			$(".switches").append(html);
		}else if(val == nextTile){
			//the html to add to the menu for input
			var html = "<div class='switch-options'><h4>you are taken here when map[<span class='y'>"+ y +"</span>][<span class='x'>"+ x +"</span>] is triggered:</h4><div class='tile-option-container'><div class='next-url'><label>URL</label><input type='text' class='url' /></div></div></div>";
			$(".switches").append(html);
		}
	 	
	 		console.log(tiles);
	 	_drawTiles();
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

	function _save(){
		
		
		dataToSend.map = tiles;
		
		
		
		setTriggers();
		
		$.ajax({
		  url: "ajax/saveLevel.php",
		  type: 'POST',
		  dataType: "json",
		  data: {
		  	"file": "../" + levelfile ,
		  	"data": JSON.stringify(dataToSend)
		  },
		  success:function(e){
		  	
		  	console.log(e);
		  }
		});
	}
	
	function setTriggers(){
		dataToSend.triggers = [];
		for( var i = 0 ; i< dataToSend.map.length ; i++){
			for(var j =0 ; j < dataToSend.map[i].length ; j++){
				
					for( var d = 0 ; d < deathTiles.length ; d++){
						if(dataToSend.map[i][j] == deathTiles[d]){
							dataToSend.triggers.push({"type" : "death", "x": j , "y" : i });
								
						}
					}
					
					if(dataToSend.map[i][j] == nextTile){
							dataToSend.triggers.push({"type" : "nextLevel",  "url":nextLevel, "x": j , "y" : i});
							
					}
					
					if( dataToSend.map[i][j] == startTile ){
						dataToSend.character.x = j * 36.61;
						dataToSend.character.y = i * 36.61;
					}
					
					
					if( dataToSend.map[i][j] == switchTile || dataToSend.map[i][j] == switchDownTile){
						
						var value;
						
						if(dataToSend.map[i][j] == switchTile){
							
							value = switchDownTile;
						}else{
							value = switchTile;
						}
					
						dataToSend.triggers.push({
							"type" : "switch",  
							"tilesToChange":[
								{
								"x":j,
								"y":i,
								"value": value
								}
							],
							 "x": j ,
							 "y" : i
						});
					}
					
					
			}
		}
		
		
		
		
		
		$(".switch-options").each(function(){
			
			var tileList = [];
			var obj;
			
			$(this).find(".effected-tile").each(function(){
				if( $(this).find(".tile-to-change-value").val() != ""){
				 obj = {
									"x": parseInt($(this).find(".tile-to-change-x").val()),
									"y":  parseInt($(this).find(".tile-to-change-y").val()),
									"value": parseInt($(this).find(".tile-to-change-value").val())
								};
				tileList.push(obj);
				}
			});
			
			dataToSend.triggers.push({
							"type" : "switch",  
							"tilesToChange":tileList,
							 "x": parseInt($(this).find(".x").text()) ,
							 "y" : parseInt($(this).find(".y").text())
						});
		});
		
		
		
		
	}
	
	
	function _getValue(xx,yy){
		
		return tiles[yy][xx];
	}



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//MAKE STUFF PUBLIC
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return {
		load : _load,
		player: player,
		changeTile: _changeTile,
		jump : _jump,
		save: _save,
		stopJump : _stopjump,
		getValue : _getValue
	}

}


function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}



