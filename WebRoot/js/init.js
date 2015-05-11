$(function(){
	
	$('.socials').mobilyblocks();
	
});


 var cPosition = {
        x : 0,
        y : 0
	}
 var position = {
        x : 0,
        y : 0
    }

var content = document.getElementById("content");
var hammer = new Hammer(content);

hammer.on("panstart",function(ev){
            if(ev.pointers.length > 1){
                
                return false;
            }
            cPosition.x = ev.deltaX;
            cPosition.y = ev.deltaY;
            console.log(ev.pointers);
            return false;
    });
        
    hammer.on("panmove",function(ev){
            if(ev.pointers.length > 1){
                
                return false;
            }
            var dx = ev.deltaX - cPosition.x;
            var dy = ev.deltaY - cPosition.y;
            cPosition.x = ev.deltaX;
            cPosition.y = ev.deltaY;
            position.x += dx;
            position.y += dy;
            move( position.x, position.y );
           
            return false;
    });
        
    hammer.on("panend",function(ev){
		
		return false;
    });


function move( x, y ) {
        
          content.style.left = x+"px";
          content.style.top = y+"px";
          return false;
}



