
var KeyBindings = function(){
		function _setup( myEngine ){
				$(".right-button").bind("touchstart", function() {
					myEngine.player.moveRight();
				});
			
				$(".right-button").bind("touchend", function() {
					myEngine.player.stopRight();
				});
			
				$(".left-button").bind("touchstart", function() {
					myEngine.player.moveLeft();
				});
			
				$(".left-button").bind("touchend", function() {
					myEngine.player.stopLeft();
				});
				
				
				
				
				
				
				
				
				$(".circle-button").bind("touchstart", function() {
					myEngine.player.jump();
				
				}); 
			
				$(".circle-button").bind("touchend", function() {
					myEngine.player.stopJump();
				});
				
				
				
				
				
				
				$("body").keyup(function(e) {
				  
				    var code = (e.keyCode ? e.keyCode : e.which);
				    if (code==37) {
				    	myEngine.player.stopLeft();
				        e.preventDefault();
				    }
				    
				    if (code==39) {
				    	myEngine.player.stopRight();
				        e.preventDefault();
				    }
				    
				    if (code==32) {
				    	myEngine.player.stopJump();
				        e.preventDefault();
				    }
			
			  
				});
				
				
				
				$("body").keydown(function(e) {
				    
				    var code = (e.keyCode ? e.keyCode : e.which);
				    if (code==37) {
				    	myEngine.player.moveLeft();
				        e.preventDefault();
				    }
				    
				    if (code==39) {
				    	myEngine.player.moveRight();
				        e.preventDefault();
				    }
				    
				    if (code==32) {
				    	myEngine.player.jump();
				        e.preventDefault();
				    }
			
			  
				});
	}
	return {
		setup : _setup	
	}				

}