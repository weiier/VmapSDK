//这两个参数暂时写死，定位教三
var unit = "e9f6a2de-eadc-45af-a42e-c7458a401339";
var poi = "37961C5B-7CEA-4A39-912A-A3563B8C3D90";

var publicElement = (function () {
    this.ip = "10.103.242.71";
    this.port = "8888";
    return this;
})();

$(function(){

	var arr = location.search.split("?")[1].split("&");
	var fromx = arr[0].split("=")[1];
	var fromy = arr[1].split("=")[1];
	var fromfloor = arr[2].split("=")[1];
	var tox = arr[3].split("=")[1];
	var toy = arr[4].split("=")[1];
	var tofloor = arr[5].split("=")[1];
	//alert(fromx+" "+fromy+" "+fromfloor+" "+tox+" "+toy+" "+tofloor);

	getNavigationPath(fromx,fromy,fromfloor,tox,toy,tofloor);

});

function getNavigationPath(fromx,fromy,fromfloor,tox,toy,tofloor){
	
	$("#crossFloorResultTable tbody").empty();
	var tr = "";
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/VmapSDK/file!getXML?pointnum=2&fromx="+fromx+"&fromy="+fromy+"&fromfloor="+fromfloor+"&tox="+tox+"&toy="+toy+"&tofloor="+tofloor+"&poi="+poi+"&jsoncallback=?";
    $.getJSON(
        url,
        function(result){
            if(!result.success){
                alert("获取导航数据失败");
                return;
            }
                 
            var filename = result.fileName;
            var X = 0;
            var Y = 0;
            var FLOOR = "";
            $.get('./map/'+filename,function(data){
                if($(data).find('ROUTE')){
                    var ROADS = $(data).find('ROAD');
                    for(var i=0;i<ROADS.length;i++){

                    	var points = ROADS.eq(i).find('POINT');
                    	if(points.eq(0).children('FLOOR').text() != points.eq(1).children('FLOOR').text()){
                    		//坐电梯这种路线
                    		var info = "";//线路简介
                    		for(var j=0;j<points.length;j++){
                    			info += points.eq(j).children('NAME').text()+"·····>";
                    		}
                    		info = info.substring(0,info.length-6);
                    		tr = "<tr><td><span class='badge'>"+(i+1)+"</td><td>"+info+"</td><td><button disabled='disabled' type='button' class='btn btn-danger btn-lg'>乘坐电(楼)梯</button></td></tr>";
                    		$("#crossFloorResultTable tbody").append(tr);
                    	}else{
                    		//在某层的行走路线
                    		var floor = points.eq(0).children('FLOOR').text();
                    		var info = floor+"层行走路线";
                    		var point = "";
                    		var pointArray = new Array();
                    		for(var j=0;j<points.length;j++){

                    			point = points.eq(j).children('X').text()+","+points.eq(j).children('Y').text();
                    			pointArray.push(point);	
                    		}
                    		pointArray = pointArray.join("&");
                    		//alert(pointArray);
                    		tr = "<tr><td><span class='badge'>"+(i+1)+"</td><td>"+info+"</td><td><button floor='"+floor+"' point='"+pointArray+"' type='button' class='btn btn-warning btn-lg'>地图显示</button></td></tr>";
                    		$("#crossFloorResultTable tbody").append(tr);
                    	}
                    }
                }else{

                    alert("同层导航失败");
                    return;
                }
            });
		});
}

$("#crossFloorResultTable").on('click','button',function(){
	
	addCookie("PathPoints", $(this).attr('point')+"@"+$(this).attr('floor'));
	addCookie("BackTo",location.href);
	location.href = "http://"+publicElement.ip+":"+publicElement.port+"/VmapSDK/crossFloorMapInfo.html";
});

$(".btn-primary").bind('click',function(){

	location.href = getCookie("HomePage");
});
