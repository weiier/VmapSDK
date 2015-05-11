//这两个参数暂时写死，定位教三
var unit = "e9f6a2de-eadc-45af-a42e-c7458a401339";
var poi = "37961C5B-7CEA-4A39-912A-A3563B8C3D90";

$(function(){

	var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var m = document.getElementById("map");
    if(m){
        m.style.width = (width-40)+"px";
        m.style.height = (height-40)+"px";
        
        document.body.addEventListener("touchmove",function(){
		  event.preventDefault();
        });
    

        var points = unescape(getCookie("PathPoints"));
        //alert(points);
        var floorId= points.split("@")[1];
        var pointArray = points.split("@")[0].split("&");
        var x = 0;
        var y = 0;
        var Points = new Array();
		map = new Vmap(document.getElementById('map'),unit,floorId);

       /* $("#big").bind("click",map.zoomIn);
        $("#small").bind("click",map.zoomOut);*/

        map.onFloorChange = function(){
            
            map.clearOverlays();

        	for(var i=0;i<pointArray.length;i++){

        		x = pointArray[i].split(",")[0];
        		y = pointArray[i].split(",")[1];
        		point = new VPoint(x,y,floorId);
            	Points.push(point);
        	}
        	line = new VPolyline(Points);
        	map.addOverlay(line);
        }
    }
     
        //deleteCookie("PathPoints");
});

$("#back").bind('click',function(){

	//alert("sadsad");
	var back = unescape(getCookie("BackTo"))
	//deleteCookie("BackTo");
	location.href = back;
});