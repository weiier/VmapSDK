
   $(function(){
    //alert(unescape(location.search.split("?")[1].split("=")[1]));
    //alert("asddsasd");
    $("#back").on('click',function(){

        location.href = decodeURIComponent(location.search.split("backTo=")[1]);
    });

    $("#BeaconTable tbody").empty();

    var i;
    var tr = "";
    var val = "";
    var spotname = "";
    var floor = "";
    var savedNum = 1;

    var flag = "";

    var storage = window.localStorage; 
      //alert(storage.length);
    for (i=0, len = storage.length; i < len; i++){
      //alert("进入ls");
      var key = storage.key(i);
      if(key.indexOf("Beacon_") > -1){

          flag = "hasStorage";
          //alert(key);
          var value = decodeURIComponent(storage.getItem(key));
          spotname = decodeURIComponent((value.split("&")[2]).split("=")[1]);
          floor = decodeURIComponent((value.split("&")[3]).split("=")[1]);
          var Key = $.trim(key);

          tr = "<tr><td><span class='badge'>"+savedNum+"</span></td><td>"+spotname+"</td><td><button floor='"+floor+"' key='"+Key+"' type='button' class='btn btn-info btn-lg '>导航</button> <button key ='"+key+"' type='button' class='btn btn-danger btn-lg'>删除</button></td></tr>";
          $("#BeaconTable tbody").append(tr);
          savedNum++; 

      }         
    }
    //alert(flag);
    if(flag != "hasStorage"){

        var strCookie = document.cookie; 
        //alert(strCookie);
        var arrCookie = strCookie.split(";");

        //alert(arrCookie.length);
        for(i=0;i<arrCookie.length;i++){ 
        //alert("进入cookie");
          var arr = arrCookie[i].split("="); 
          //alert("arr[1]:"+arr[1]);
          if(arr[0].indexOf("Beacon_") > -1){
            //console.log(arr[1]);
            //alert("arr[0]:"+arr[0]);
            val = decodeURIComponent(unescape(arr[1]));
            //alert("val:"+val);
            spotname = decodeURIComponent((val.split("&")[2]).split("=")[1]);
            //alert("spotname:"+spotname);
            var key = $.trim(arr[0]);
            //alert("key"+key);
            tr = "<tr><td><span class='badge'>"+savedNum+"</span></td><td>"+spotname+"</td><td><button key='"+key+"' type='button' class='btn btn-info btn-lg '>查看</button> <button key ='"+key+"' type='button' class='btn btn-danger btn-lg'>删除</button></td></tr>";
            $("#BeaconTable tbody").append(tr);
            savedNum++; 
          }        
        
        }
    }
    
   });

$("#BeaconTable ").on('click','button',function(){

    if($(this).hasClass("btn-danger")){

      //alert("删除");
      //alert($(this).attr("key"));
      var key = $.trim($(this).attr("key"));

      if(getCookie(key)){

        deleteCookie(key);
  
        if(getCookie("BeaconAmount")){
          if(parseInt(getCookie("BeaconAmount")) > 0){

            var cookie_amount = parseInt(getCookie("BeaconAmount"));
            cookie_amount = cookie_amount - 1;
            addCookie("BeaconAmount",cookie_amount,30);
          } 
        }
      }

      if(localStorage.getItem(key)){

        localStorage.removeItem(key);
      
        if(localStorage.getItem("BeaconAmount")){
          if(parseInt(localStorage.getItem("BeaconAmount")) > 0){

            var ls_amount = parseInt(localStorage.getItem("BeaconAmount"));
            ls_amount = ls_amount - 1;
            localStorage.setItem("BeaconAmount",ls_amount);
          }          
        }
      }

      location.reload();


    }else if($(this).hasClass("btn-info")){

        //alert("打点");
        //alert($(this).attr('key'));
        var key = $(this).attr('key');
        var val = '';
        var originFloor = decodeURIComponent(location.search.split("backTo=")[1]).split("floor=")[1].split("&")[0];
        if(val = localStorage.getItem(key)){
          if($(this).attr("floor") == originFloor){
            //alert(decodeURIComponent(unescape(val)));
            addCookie("BeaconMarker",val);
            location.href = decodeURIComponent(location.search.split("backTo=")[1]);
          }else{

            var arr = decodeURIComponent(location.search.split("backTo=")[1]).split("?")[1].split("&");
            var fromx = arr[0].split("=")[1];
            var fromy = arr[1].split("=")[1];
            var fromfloor = arr[3].split("=")[1];

            var arr2 = decodeURIComponent(localStorage.getItem(key)).split("&");
            var tox = arr2[0].split("=")[1];
            var toy = arr2[1].split("=")[1];
            var tofloor = arr2[3].split("=")[1];

            location.href = "http://"+publicElement.ip+":"+publicElement.port+"/VmapSDK/crossFloorNavigation.html?fromx="+fromx+"&fromy="+fromy+"&fromfloor="+fromfloor+"&tox="+tox+"&toy="+toy+"&tofloor="+tofloor;
          }
          
        }else if(val = getCookie(key)){

          if($(this).attr("floor") == originFloor){
            //alert(decodeURIComponent(unescape(val)));
            addCookie("BeaconMarker",val);
            location.href = decodeURIComponent(location.search.split("backTo=")[1]);
          }else{

            var arr = decodeURIComponent(location.search.split("backTo=")[1]).split("?")[1].split("&");
            var fromx = arr[0].split("=")[1];
            var fromy = arr[1].split("=")[1];
            var fromfloor = arr[3].split("=")[1];

            var arr2 = decodeURIComponent(unescape(getCookie(key))).split("&");
            var tox = arr2[0].split("=")[1];
            var toy = arr2[1].split("=")[1];
            var tofloor = arr2[3].split("=")[1];
            
            location.href = "http://"+publicElement.ip+":"+publicElement.port+"/VmapSDK/crossFloorNavigation.html?fromx="+fromx+"&fromy="+fromy+"&fromfloor="+fromfloor+"&tox="+tox+"&toy="+toy+"&tofloor="+tofloor;
          }
          //alert(decodeURIComponent(unescape(val)));
        }else{

          alert("打点失败，可能由于缓存已过期，无此地点信息");
        }
    }
});


