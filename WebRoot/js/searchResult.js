var publicElement = (function () {
	this.serverIp = "123.57.46.160";
	this.serverPort = "8080";
    return this;
})();


$(function(){
	
	var spotname = decodeURIComponent(location.search.split("?")[1].split("&")[0].split("=")[1]);
    var unitId = decodeURIComponent(location.search.split("?")[1].split("&")[1].split("=")[1]);
	//alert(spotname);
	var spot_name = "";
	var unit_id = "";
	var unit_name = "";
	var floor_id = "";
	var x = 0;
	var y = 0;
	var resultNum = 1;
	var tr = "";
	var val = "";
	var url = "http://"+publicElement.serverIp+":"+publicElement.serverPort+"/beacon/place!fuzzyQuery?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&spotname="+spotname+"&unitId="+unitId+"&jsoncallback=?";
		
	$.getJSON(
		url,
		function(result){
				
			if(!result.success || result.total == 0){
				alert("搜索失败，无此地点相关信息");
                location.href = decodeURIComponent(location.search.split("backTo=")[1]);
				return;
			}
			//alert("here");
			$("#resultTable tbody").empty();
				
			for(var i=0;i<result.total;i++){
				//alert("here");
				spot_name = result.spots[i].spotname;
				//alert(spot_name);
				unit_id = result.spots[i].unit_id;
				//alert(unit_id);
				unit_name = result.spots[i].unit_name;
				//alert(unit_name);
				floor_id = result.spots[i].floor_id;
				//alert(floor_id);
				x = result.spots[i].x;
				y = result.spots[i].y;
				//alert(x+"--"+y);
				val = encodeURIComponent("x="+x+"&y="+y+"&spotname="+spot_name+"&floor="+floor_id+"&unit="+unit_id);
				//alert(val);
				tr = "<tr><td><span class='badge'>"+resultNum+"</span></td><td>"+spot_name+"</td><td>"+unit_name+"</td><td>"+floor_id+"</td><td><button floor='"+floor_id+"' id='checkSpot' type='button' class='btn btn-info btn-lg' spotVal='"+val+"'>导航</button><button type='button' id='saveSpot' class='btn btn-success btn-lg' spotVal='"+val+"'>保存</button></td></tr>";
          		//alert(tr);
          			
          		$("#resultTable tbody").append(tr);
          		resultNum++;
			}
		}
	);
});
	
$("#resultTable").on('click','button',function(){

    var originFloor = decodeURIComponent(location.search.split("backTo=")[1]).split("floor=")[1].split("&")[0];
	if($(this).hasClass('btn-info')){

		//alert($(this).attr('spotVal'));
        if($(this).attr("floor") == originFloor){
            addCookie("BeaconMarker", $(this).attr('spotVal'));
            location.href = decodeURIComponent(location.search.split("backTo=")[1]);
            //alert(decodeURIComponent(location.search.split("backTo=")[1]));
            //console.log(decodeURIComponent(location.search.split("?")[1].split("&")[1].split("=")[1]));
        }else{
            
            var arr = decodeURIComponent(location.search.split("backTo=")[1]).split("?")[1].split("&");
            var fromx = arr[0].split("=")[1];
            var fromy = arr[1].split("=")[1];
            var fromfloor = arr[3].split("=")[1];

            var arr2 = decodeURIComponent($(this).attr('spotVal')).split("&");
            var tox = arr2[0].split("=")[1];
            var toy = arr2[1].split("=")[1];
            var tofloor = arr2[3].split("=")[1];
            
            location.href = "./crossFloorNavigation.html?fromx="+fromx+"&fromy="+fromy+"&fromfloor="+fromfloor+"&tox="+tox+"&toy="+toy+"&tofloor="+tofloor;
        }
		
	
	}else if($(this).hasClass('btn-success')){

		var spotVal = $(this).attr('spotVal');
		var storage = window.localStorage;
    	for (var i=0, len = storage.length; i < len; i++){
   
        	var key = $.trim(storage.key(i));
        	var value = $.trim(storage.getItem(key));
        	if(value == spotVal){
        		
        		alert("该地点之前已保存过");
            	return;
        	}
    	}

    	var strCookie = document.cookie; 
    	var arrCookie = strCookie.split(";"); 
    	for(var i=0;i<arrCookie.length;i++){ 
       
        	var arr = arrCookie[i].split("=");
        	if(unescape(arr[1]) == spotVal){
          	  
          	  	alert("该地点之前已保存过");
          	  	return;
        	}
    	}
    	
    	//未存储过
    	var capacity = haveCapacity();
        if(capacity){

            var date = new Date();
            var time = date.getTime();
            var key = "Beacon_" + time;

            var ls_amount = localStorage.getItem("BeaconAmount");
            var cookie_amount = getCookie("BeaconAmount");
            if(ls_amount || cookie_amount){

                if(ls_amount){
                
                    ls_amount = parseInt($.trim(ls_amount)) + 1;
                    localStorage.setItem("BeaconAmount",ls_amount);
                    localStorage.setItem(encodeURIComponent(key),unescape(encodeURIComponent(spotVal)));            
                }
                if(cookie_amount){

                    cookie_amount = parseInt($.trim(cookie_amount)) + 1;
                    addCookie("BeaconAmount",cookie_amount,30);
                    addCookie(encodeURIComponent(key),encodeURIComponent(spotVal),30);
                }
            }
            else{

                localStorage.setItem("BeaconAmount",1);
                localStorage.setItem(encodeURIComponent(key),unescape(encodeURIComponent(spotVal)));
                addCookie("BeaconAmount",1,30);
                addCookie(encodeURIComponent(key),encodeURIComponent(spotVal),30);
            }
            alert("存储成功");
        }else{
            
            //已存满
            if(confirm("已达存储容量上限，请在已存地点中删除若干\n是否进行删除操作?")){

                location.href="./checkSavedBeacon.html?backTo="+encodeURIComponent(location.href);
            }else{

                return;
            }
        }

	}
});
$("#back").bind('click',function(){

	location.href = decodeURIComponent(location.search.split("backTo=")[1]);
});
