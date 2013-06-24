$(document).ready(function(){
	ui.init();
});
var ui = function(){
	
	function _init(){
		_loadLevelOptions();
		
		
		$(".toggle").click(function(){
			$(this).parent().find(".toggleable").toggleClass("on");	
		});
	}
	
	function _loadLevelOptions(){
		
		$.ajax({
		  url: "levels/index.php" ,
		  dataType: 'html',
		  data: "",
		  success:function(e){
		  	
		  	$(".levels").html(e);
			
		  }
		});
	}
	
	return{
		init: _init
	}
	
}();
