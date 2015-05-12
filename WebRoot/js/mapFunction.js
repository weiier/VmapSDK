var MaxSaved = 10;
var UrlSearch = location.search.split("?")[1];


window.onload = function () {

    //alert(document.cookie);
    //deleteCookie("BeaconMarker");
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var m = document.getElementById("map");
    if(m){
        m.style.width = (width-40)+"px";
        m.style.height = (height-40)+"px";
        
        document.body.addEventListener("touchmove",function(){
		  event.preventDefault();
        });
    
        makeMarker();
    }
     
     //alert(encodeURIComponent(UrlSearch));
    //alert(decodeURIComponent(unencodeURIComponent(encodeURIComponent(location.search.split("?")[1]))));
    $("#saveSpot").bind("click",saveSpot);
    $("#checkSaved").bind("click",checkSaved);
    $("#navigation").bind("click",navigation);
    /*$("#search").bind("click",search);*/
    $(".search_btn").bind("click",search);
}

$("#search").bind('keypress',function(e){

    if(e.keyCode == 13){
        e.preventDefault();
        search();
    }
});

function search(){
	
	var spotname = $("#search").val();
	//spotname = spotname.replace(/\s/ig,'');//去除所有空格
	spotname = $.trim(spotname);
    unitId = UrlSearch.split("&")[4].split("=")[1]; 


	if(!spotname){
		
		$("#search").val("").attr("placeholder","搜索");
		return;
	}else{
		spotname = encodeURIComponent(spotname);
        unitId = encodeURIComponent(unitId);
        addCookie("HomePage",location.href);
		location.href="./searchResult.html?spotname="+spotname+"&unitId="+unitId+"&backTo="+encodeURIComponent(location.href);
	}
}

 function makeMarker(){

    var map;
    var pointer;
    var marker;
    var BeaconMarker = '';
    var args = getQueryStringArgs(UrlSearch);
    var unit = '';
    var floorId = '';
    var poi = '37961C5B-7CEA-4A39-912A-A3563B8C3D90';//教三的poi_id(暂时写死)

    if(args) {

        $("#spotName").text("当前位置:" + args["spotname"]);

        unitId1 = args["unit"];
        floorId1 = args["floor"];

        map = new Vmap(document.getElementById('map'),unitId1,floorId1);
        map.onFloorChange = function(){
            
        map.clearOverlays();
        //导航接口所用变量
        var fromx = args["x"];
        var fromy = args["y"];
        var fromfloor = floorId1;

        pointer = new VPoint(fromx, fromy, fromfloor);
        marker = new VMarker(pointer,1);
        map.addOverlay(marker);
            //alert(document.cookie);
            //alert("BeaconMarker:"+getCookie("BeaconMarker"));
        if(BeaconMarker = getCookie("BeaconMarker")){
                //alert(BeaconMarker);
            args = getQueryStringArgs(decodeURIComponent(BeaconMarker));
                //alert(UrlSearch+"----------"+BeaconMarker);
                //alert(args["x"]+" "+args["y"]+" "+args["unit"]+" "+args["floor"]);               
            if(args){

                unitId2 = args["unit"];
                floorId2 = args["floor"];
                
                //导航接口所用变量
                var tox = args["x"];
                var toy = args["y"];
                var tofloor = floorId2;

                /*if((unitId1.toLowerCase() != unitId2.toLowerCase()) || (floorId1.toLowerCase() != floorId2.toLowerCase())){
                    map.destory();
                    map = new Vmap(document.getElementById('map'),unitId2,floorId2);
                    map.onFloorChange = function(){

                        pointer = new VPoint(tox, toy, tofloor);
                        marker = new VMarker(pointer,2);
                        map.addOverlay(marker);
                        navigationPath(fromx,fromy,fromfloor,tox,toy,tofloor,poi,map);
                        deleteCookie("BeaconMarker");
                    }
                }else{*/

                    pointer = new VPoint(args["x"], args["y"], floorId2);
                    marker = new VMarker(pointer,2);
                    map.addOverlay(marker);
                    navigationPath(fromx,fromy,fromfloor,tox,toy,tofloor,poi,map);
                    deleteCookie("BeaconMarker");
                /*}*/
                 
                
            }
        }
        }
    }
    
 }  

function saveSpot(){

    //alert("saveSpot");
    var saved = alreadySaved();
    if(saved){
        //已存
        alert("之前已经存储过");
    }else{
        //未存
        //alert("未存");
        var capacity = haveCapacity();
        if(capacity){
            //未存满
            //alert("未存满");
            var date = new Date();
            var time = date.getTime();
            var key = "Beacon_" + time;

            var ls_amount = localStorage.getItem("BeaconAmount");
            var cookie_amount = getCookie("BeaconAmount");
            if(ls_amount || cookie_amount){

                if(ls_amount){
                
                    ls_amount = parseInt($.trim(ls_amount)) + 1;
                    localStorage.setItem("BeaconAmount",ls_amount);
                    localStorage.setItem(encodeURIComponent(key),encodeURIComponent(UrlSearch));
                    //addCookie("BeaconAmount",ls_amount,30);
                }
                if(cookie_amount){

                    cookie_amount = parseInt($.trim(cookie_amount)) + 1;
                    //localStorage.setItem("BeaconAmount",cookie_amount);
                    addCookie("BeaconAmount",cookie_amount,30);
                    addCookie(encodeURIComponent(key),encodeURIComponent(UrlSearch),30);
                }
            }
            else{

                localStorage.setItem("BeaconAmount",1);
                localStorage.setItem(encodeURIComponent(key),encodeURIComponent(UrlSearch));
                addCookie("BeaconAmount",1,30);
                addCookie(encodeURIComponent(key),encodeURIComponent(UrlSearch),30);
            }
            alert("存储成功");
        }else{
            
            //已存满
            if(confirm("已达存储容量上限，请在已存地点中删除若干\n是否进行删除操作?")){
                addCookie("HomePage",location.href);
                location.href="./checkSavedBeacon.html?backTo="+encodeURIComponent(location.href);
            }else{

                return;
            }
        }

    }

}

function checkSaved(){

    //alert("checkSaved");
    var ls_amount = localStorage.getItem("BeaconAmount");
    if(ls_amount){
        //alert(ls_amount);
        if(ls_amount > 0){
            //alert("ls大于零");
            addCookie("HomePage",location.href);
            location.href="./checkSavedBeacon.html?backTo="+encodeURIComponent(location.href);
            //alert(location.href);
        }else{

            alert("尚未保存任何地点");
        }        
    }else{

        var cookie_amount = parseInt(getCookie("BeaconAmount"));
        if(cookie_amount){
            //alert(cookie_amount);
            if(cookie_amount > 0){
                //alert("cookie大于零");
                addCookie("HomePage",location.href);
                location.href="./checkSavedBeacon.html?backTo="+encodeURIComponent(location.href);
                //alert(location.href);
            }else{

                alert("尚未保存任何地点");
            }            
        }
        else{

            alert("尚未保存任何地点");
        }
    }
}

function navigation(){

    //alert("navigation");
    if(getCookie("BeaconAmount")>0 || localStorage.getItem("BeaconAmount")>0){
        addCookie("HomePage",location.href);
        location.href = "./checkSavedBeacon.html?backTo="+encodeURIComponent(location.href);
    }else{

        alert("请搜索目标点或通过微信摇一摇保存Beacon位置");
        return;
    }   
}

function navigationPath(fromx,fromy,fromfloor,tox,toy,tofloor,poi,map){
//alert(fromx+ " "+fromy+ " "+fromfloor+ " "+tox+ " "+toy+ " "+tofloor)

    var unit = 'e9f6a2de-eadc-45af-a42e-c7458a401339';//教三的unitId(暂时写死)

    var url = "./file!getXML?pointnum=2&fromx="+fromx+"&fromy="+fromy+"&fromfloor="+fromfloor+"&tox="+tox+"&toy="+toy+"&tofloor="+tofloor+"&poi="+poi+"&jsoncallback=?";
        $.getJSON(
            url,
            function(result){
                if(!result.success){
                    alert("获取导航数据失败");
                    return;
                }else if(fromfloor == tofloor){
                    //alert("这里是同层导航开始");

                    var filename = result.fileName;
                    //同楼层导航
                    //var count = 0;//计数器，每遍历2个点画一条线
                    var X = 0;
                    var Y = 0;
                    var FLOOR = "";
                    var point;
                    var points = new Array();//存储线路上的点
                    var line;

                    $.get('./map/'+filename,function(data){
                        if($(data).find('ROUTE')){
                            $(data).find('ROAD').each(function(i){
                                $(this).find('POINT').each(function(i){
                                    //var unit=$(this).attr('unit');
                                    X=$(this).children('X').text();
                                    Y=$(this).children('Y').text();
                                    //var NAME=$(this).children('NAME').text();
                                    FLOOR=$(this).children('FLOOR').text(); 
                                    point = new VPoint(X,Y,FLOOR);
                                    points.push(point);                                           
                                });
                                line = new VPolyline(points);
                                map.addOverlay(line);     
                            });
                        }else{

                            alert("同层导航失败");
                            return;
                        }
                    });
                }/*else{

                    alert("这里是跨楼层导航开始");
                    //跨楼层导航
                }*/
                
            });
}

function alreadySaved(){

    var val = $.trim(encodeURIComponent(UrlSearch));
    //alert("val:"+val);

    //检查localStorage中是否已存
    var storage = window.localStorage;
    for (var i=0, len = storage.length; i < len; i++){
        //alert("进入ls");
        var key = $.trim(storage.key(i));
        var value = $.trim(storage.getItem(key));
        if(value === val){
            return true;
        }
    }

    ////检查cookie中是否已存
    var strCookie = document.cookie; 
    
    var arrCookie = strCookie.split(";"); 
    //alert("cookie:"+arrCookie);
    for(var i=0;i<arrCookie.length;i++){ 
        //alert("进入cookie循环遍历");
        var arr = arrCookie[i].split("=");
        //alert(unescape(arr[1]) + " -------------------- "+ val);
        if(unescape(arr[1]) == val){
            //alert("same one");
            return true;
        }
    }
    return false;
}

function haveCapacity(){

    var ls_amount = localStorage.getItem("BeaconAmount");

    //console.log(ls_amount);
    if(ls_amount){

        if((ls_amount < MaxSaved)){
            return true;
        }else{

            return false;
        }
    }else{

        var cookie_amount = getCookie("BeaconAmount");
        //console.log(cookie_amount);
        if((!cookie_amount) || (cookie_amount < MaxSaved)){
            
            //localStorage.setItem("BeaconAmount",cookie_amount);
            return true;
        }else{
            //localStorage.setItem("BeaconAmount",MaxSaved);
         
            return false;
        }
    }
 
}


function getQueryStringArgs(search){
   
    var args = {};
    if(search){

        var items = search.length?search.split("&"):[];
        var item = null;
        var name = null;
        var value = null;

        var i = 0;
        var len = items.length;

        for(i = 0;i<len;i++){

            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            //alert("name:"+name);
            value = decodeURIComponent(item[1]);
            //alert("val:"+value);

            if(name.length){
                args[name] = value;
            }
        }
        return args;
    }
    
}

function addCookie(cname,cvalue,exdays){

    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = encodeURIComponent(cname) + "=" + encodeURIComponent(cvalue) + ";" + expires;
}

function getCookie(name){ 
    //alert(name);
    var strCookie = document.cookie; 
    var arrCookie = strCookie.split(";"); 
    for(var i=0;i<arrCookie.length;i++){ 
        var arr = arrCookie[i].split("=");
        //alert("key:"+arr[0]+" --" +name); 
        if(arr[0].indexOf(name) > -1) {

            return decodeURIComponent(arr[1]); 
        }
    } 
    return ""; 
} 

function deleteCookie(name){ 

    var date = new Date(); 
    date.setTime(date.getTime()-10000); 
    document.cookie = name+"=v;expires="+date.toGMTString(); 
} 


this.makeMarker = makeMarker;
this.saveSpot = saveSpot;
this.checkSaved = checkSaved;
this.navigation = navigation;
this.alreadySaved = alreadySaved;
this.haveCapacity = haveCapacity;
this.getQueryStringArgs = getQueryStringArgs;
this.addCookie = addCookie;
this.getCookie = getCookie;
this.deleteCookie = deleteCookie;