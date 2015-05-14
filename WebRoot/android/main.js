/**
 * new sdk use .svg file to fix MicroMsg bug
 * create by dr.zhang
 * using Hammer.js plug-in & Jquery.js
 */
 
function Vmap( dom,mallId,floorId) {
	//地图信息 
	var dom = dom;
	var serverUrl = "123.57.46.160:8080";
    //地图坐标转换 转换公式 当前地图上的位置 = 真实位置(数据服务器返回的位置)*rate/currentScale*finalScale
	var rate = 96*1000/25.4;// rate = dpi * 1000/25.4;dpi : svg 为96, png为150
	//当前地图的scale值
    var currentScale = null;
	var currentFloorId = null;
    var mallName = null;
	//公共设施
    var publicPlace = [];
    //各楼层信息
    var floor = [];
    //地图操作
	var transform;
	//拖动
	var START_X = 50;
	var START_Y = document.documentElement.clientHeight/3;
	//缩放
	var initScale = 1;
	var finalScale = 1;
	var defaultScale = 0.05;
	var defaultMinScale = 0.5;
	var defaultMaxScale = 2.5;
	//旋转
	var initAngle = 0;
	var finalAngle = 0;
	var deviceAlpha = 0;
	//覆盖物
	var points = [];
	var markers = [];
	var lines = [];
	var circles = [];
	//svg文档节点
	var svgDocument = null;
	var svgRoot = null;
	var svgOverlay = null; 
	var initWidth = 0;
	var initHeight = 0;
	
    //标识
    var isPicLoaded = false;
    var facilitiesFlag = false;
    var eventFlag = false;
    var bindFlag = false;
	This = this;
    
	//重置dom的style
	dom.style.position = "absolute";
	dom.style.width = "100pt";
	dom.style.height = "100pt";
	//创建包裹svg的div
	var innerDiv = document.createElement("div");
	innerDiv.style.position = "absolute";
	innerDiv.id = "innerDiv";
	innerDiv.style.left = 0;
	innerDiv.style.top = 0;
	innerDiv.style.width = "100pt";
	innerDiv.style.height = "100pt";
	dom.appendChild(innerDiv);
	//创建embed
	var innerSvg = document.createElement("embed");
	innerSvg.style.position = "absolute";
    innerSvg.style.top = 0;
    innerSvg.style.left = 0;
    innerSvg.style.zIndex = -1;
    innerSvg.id = "innerSvg";
	
	changeBuild( mallId,floorId );
	//内部函数	
    function init() {
        isPicLoaded = true;
		svgDocument = innerSvg.getSVGDocument();
		console.log(svgDocument,2);
		svgRoot = svgDocument.documentElement;
		initWidth = parseFloat(svgRoot.getAttribute("width"));
		initHeight = parseFloat(svgRoot.getAttribute("height"));
		zoom(1);
        if( !bindFlag ){
            bindEvent();
            bindFlag = true;
        }
		if ( This.onFloorChange != null ) {
		   This.onFloorChange();
	   }
    }
    //切换建筑
    function changeBuild( uId, floorId ) {
        if ( !floorId ) {
            floorId = null;
        }
        var dataUrl = "";
        dataUrl = "http://"+serverUrl+"/beacon/place!all_in_one?client=824&&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+uId+"&jsoncallback=?";
        $.getJSON( dataUrl,
                   function( result ) {
                       if ( true === result.success ) {
                           //获得当前商场的名字
                           mallName = result.place[0].name;
                           var i = null;
                           var j = 0;
                           //提取当前商场每层楼对应的svg图片信息
                           for ( i in result.map ) {
                               if ( result.map[i].style === "svg-1" ) {
                                   floor[j++] = result.map[i];
                                   if ( floorId === null ) {
                                       if ( result.map[i].floor_id === "Floor1" ) {
                                           floorId = "Floor1";
                                       } else {
                                           if ( result.map[i].floor_id === "Floor0" ) {
                                               floorId = "Floor0";
                                           }
                                       }
                                   } 
                               }
                           }
                           //这里还没有填充楼层选择器！！
                           getPublicPlace(uId,"",
                                          function() {           
                                             changeFloor(floorId);
                                          });
                           //如果有回调函数的话执行
                           
                       } else {
                           alert("获取楼层数据失败");
                       }
                   });
    }
    
    function changeFloor(floorId) {
        
        var dataUrl = "./file?place="+mallId+"&floor="+floorId+"&jsoncallback=?";
        $.getJSON(dataUrl, function(data){
            if( data.success ) {
                isPicLoaded = false;
                facilitiesFlag = false;
                eventFlag = false;
                svgOverlay = null;
                resetElement();
                currentFloorId = floorId;
                
                for(var i in floor){
                    if( floor[i].floor_id == currentFloorId){
                        currentScale = floor[i].scale;
                    }
                }
                /*if( document.getElementById("innerSvg") ){
                    innerDiv.removeChild(innerSvg);
                }*/

                innerSvg.src = "./map/"+currentFloorId+".svg";
                innerDiv.appendChild(innerSvg);
                innerSvg.onload = init;//?  

                toggleFacilities();
            }else{
                alert(data.message);
            }
        });
    }
    
    function getPublicPlace( uId, floorId,callback ) {
        var textUrl = "http://"+serverUrl+"/beacon/place!facilities?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+uId;
        if ( !!floorId ) {
            textUrl += "&floor="+floorId;
        }
        textUrl += "&jsoncallback=?";
        $.getJSON(textUrl,
                  function (data) {
                      if ( !data.success ) {
                          alert("字体获取失败");
                          return;
                      }
                      publicPlace = data.rows;
                      if ( !!callback ) {
                          callback();
                      }
                  }
                 );
    }
   
	function zoom(scale) {
		dom.style.width = initWidth * scale+"pt";
		dom.style.height = initHeight * scale+"pt";
		innerDiv.style.width = initWidth * scale+"pt";
		innerDiv.style.height = initHeight * scale+"pt";
		
		//innerSvg.style.width = initWidth * scale+"pt";
		//innerSvg.style.height = initHeight * scale+"pt";
		
		svgRoot.setAttribute("width",initWidth * scale+"pt");
		svgRoot.setAttribute("height",initHeight * scale+"pt");
        
        removeFacilities();
        showFacilities(scale);
        refreshOverLay(scale);
	}
	
	function bindEvent() {
		// polyfill
		var reqAnimationFrame = (function () {
			return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	
		var mc = new Hammer.Manager(dom);
		mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
		mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
		mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
		mc.add(new Hammer.Tap());

		mc.on("panstart panmove", onPan);
		mc.on("rotatestart rotatemove", onRotate);
		mc.on("pinchstart pinchmove", onPinch);
		//mc.on("tap", onTap);

		mc.on("hammer.input", function(ev) {
			if(ev.isFirst) {
			}
			if(ev.isFinal) {
				if( eventFlag ) {
					eventFlag = false;
					START_X = START_X + ev.deltaX - (innerDiv.offsetWidth/2*finalScale - innerDiv.offsetWidth/2);
					START_Y = START_Y + ev.deltaY - (innerDiv.offsetHeight/2*finalScale - innerDiv.offsetHeight/2);
					transform = {
                        translate: { x: START_X, y: START_Y },
                        scale: 1,
                        angle: finalAngle,
                        rx: 0,
                        ry: 0,
                        rz: 1
                    };
					updateElementTransform();
                    zoom(finalScale);
					
				}else {
					START_X = START_X + ev.deltaX;
					START_Y = START_Y + ev.deltaY;
				}
			}
		});

		function onPan(ev) {
			transform.translate = {
				x:START_X+ev.deltaX,
				y:START_Y+ev.deltaY,
			}
			updateElementTransform();
		}

		function onPinch(ev) {
			if(ev.type == 'pinchstart') {
				initScale = finalScale || 1;
				eventFlag = true;
				zoom(1);
				START_X = START_X + (innerDiv.offsetWidth/2 * finalScale - innerDiv.offsetWidth/2) ;
                START_Y = START_Y + (innerDiv.offsetHeight/2 * finalScale - innerDiv.offsetHeight/2);
                transform = {                  
                    translate: { x: START_X, y: START_Y },
                    scale: finalScale,
                    angle: finalAngle,
                    rx: 0,
                    ry: 0,
                    rz: 1
                };
			} else {
				transform.scale = initScale * ev.scale;
				finalScale = initScale * ev.scale;
			}
			updateElementTransform();
			return false;
		}

		function onRotate(ev) {
			if(ev.type == 'rotatestart') {
				initAngle = finalAngle || 0;
			}
			transform.rz = 1;
			transform.angle = initAngle + ev.rotation;
			finalAngle = initAngle + ev.rotation;
			updateElementTransform();
			return false;
		}

		resetElement();
	}
	//重置
    function resetElement() {
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        updateElementTransform();
    }
    //变换
    function updateElementTransform() {
        var value = [
            'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')',
            'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
        ];

        value = value.join(" ");
        dom.style.webkitTransform = value;
        dom.style.mozTransform = value;
        dom.style.transform = value;
    }
    
    //添加facilities
	function showFacilities(fScale){
        var deltaDiv = rate/currentScale * fScale;	
		for(var i=0;i<publicPlace.length;i++){
            if(publicPlace[i].floor_id === currentFloorId) {
                var iElement = document.createElement('i');
                iElement.className="facilities_icon";
                iElement.style.left=publicPlace[i].coord_x * deltaDiv +'px';
                iElement.style.top=publicPlace[i].coord_y * deltaDiv +'px';
                iElement.style.fontSize=20+fScale*5+"px";
                iElement.innerHTML=publicPlace[i].font;
                iElement.i=i;
                /*
                iElement.onclick=function(){
                  if( This.showFacility ) {
                    This.showFacility ({
                        facilityName : publicPlace[this.i].name,
                        x : publicPlace[this.i].Pos_x,
                        y : publicPlace[this.i].Pos_y
                    })
                  }
                 }
                 */
                innerDiv.appendChild(iElement); 
            }
		}
	}
    
      //删除facilities
	function removeFacilities(){
		//getElementByClassName的兼容问题
		if(document.getElementsByClassName){
			ret=document.getElementById('innerDiv').getElementsByClassName('facilities_icon');
		}else{
			var nodes=document.getElementsByTagName('i');
			for(var i=0;i<nodes.length;i++){
				if(nodes[i].className=='facilities_icon'){
					ret.push(nodes[i]);
				}
			}
		}
		var l=ret.length;
		for(var i=0;i<l;i++){
			document.getElementById('innerDiv').removeChild(ret[0]);
		}
		
	}
	//外部函数
      
    //展示或删除公共设施
	function toggleFacilities(){
		if(facilitiesFlag){
			removeFacilities();
			facilitiesFlag=false;
		}else{
			showFacilities(finalScale);
			facilitiesFlag=true;
		}
	}
    
	//放大
	function zoomIn() {
		var scale = finalScale;
		if(isPicLoaded == false) {
			return false;	
		}
		finalScale += defaultScale;
        if ( finalScale > defaultMaxScale ) {
            finalScale = scale;
            alert('已经达到默认最大缩放等级');
            return false;
        }
        zoom(finalScale);
        return false;
	}
	//缩小
	function zoomOut() {
		var scale = finalScale;
		if(isPicLoaded == false) {
			return false;
		}
		finalScale -= defaultScale;
        if ( finalScale < defaultMinScale ) {
            finalScale = scale;
            alert('已经达到默认最小缩放等级');
            return false;
        }
        zoom(finalScale);
		return false;
	}
	
	 
     //随手机旋转
    function rotate() {
        alert("开启旋转:"+deviceAlpha);
        window.addEventListener("deviceorientation",function(event) {
                //if( Math.abs(event.alpha - deviceAlpha) > 5 ) {
                    transform.rz = 1;
                    transform.angle = Math.round(event.alpha);
                    finalAngle = Math.round(event.alpha);
                    requestElementUpdate();
                //}
        });

    }
    
	
	//添加覆盖物
	function addOverlay ( obj ) {
		if( svgOverlay == null) {
		console.log(svgDocument);
			svgOverlay = svgDocument.createElementNS("http://www.w3.org/2000/svg","g");
			svgOverlay.setAttribute("id","overlay");
			svgRoot.appendChild(svgOverlay);
		}
		// 3pt = 4px;
		var delta = rate/(currentScale*1.3); 
		var deltaDiv = rate/currentScale * finalScale;	
		if( obj.type() === "point" ) {
			points[points.length] = obj;
            if( obj.floorIndex === currentFloorId ) {
                var svgPoint = svgDocument.createElementNS("http://www.w3.org/2000/svg","circle");
                svgPoint.setAttribute("fill",obj.color());
                svgPoint.setAttribute("stroke","black");
                svgPoint.setAttribute("r",3);
                svgPoint.setAttribute("cx",obj.x * delta );
                svgPoint.setAttribute("cy",obj.y * delta+10 );
                svgOverlay.appendChild(svgPoint);
            } 
		}
        
		if ( obj.type() === "marker" ) {
            markers[markers.length] = obj;
            var point = obj.point();
            $(obj.dom).css({
                left : point.x*deltaDiv+"px",
                top : point.y*deltaDiv+10+ "px"
            });
            if ( obj.floorIndex() !== currentFloorId ){
                obj.hide();
            }
            innerDiv.appendChild(obj.dom);
        }
		
		if( obj.type() == "line" ) {
			lines[lines.length] = obj;
            if( obj.floorIndex() === currentFloorId ){
                var ps = obj.points();
                var coordinate = "";
                for( var i = 0;i<ps.length;i++ ) {
                    if(i == ps.length-1 ){
                        coordinate += ps[i].x*delta+" "+ps[i].y*delta;//找彤神的去掉末尾字符的方法
                    }else {
                        coordinate += ps[i].x*delta+" "+ps[i].y*delta+",";
                    }
                }
                var svgLine = svgDocument.createElementNS("http://www.w3.org/2000/svg","polyline");
                svgLine.setAttribute("stroke", obj.color());
                svgLine.setAttribute("fill","none");
                svgLine.setAttribute("stroke-width",obj.width())
                svgLine.setAttribute("points",coordinate);
                svgOverlay.appendChild(svgLine);
            }
		}
		
		if( obj.type() == "circle" ){
			circles[circles.length] = obj;
			if( obj.floorIndex() === currentFloorId ){
				var svgCircle = svgDocument.createElementNS("http://www.w3.org/2000/svg","circle");
                svgCircle.setAttribute("fill","none");
                svgCircle.setAttribute("stroke",obj.color());
                svgCircle.setAttribute("r",obj.radius * delta );
                svgCircle.setAttribute("cx",obj.point.x * delta );
                svgCircle.setAttribute("cy",obj.point.y * delta );
                svgOverlay.appendChild(svgCircle);
			}
		}
	}
    
    function refreshOverLay(oScale) {
        var delta = rate/currentScale*oScale;
        for ( var i = 0 ; i < markers.length; i++ ) {
            var mark = markers[i];
            var p = mark.point();
            $(mark.dom).css({
                left : p.x*delta+"px",
                top : p.y*delta+10+ "px"
            });
            if ( mark.floorIndex() !== currentFloorId ) {
                mark.hide();
            } else {
                mark.show();
            }
        }
    }
    
     //清除覆盖物
    function clearOverlays() {
        for ( var i = 0; i < markers.length; i++ ) {
            $(markers[i].dom).remove();
        }
        markers = [];
        lines = [];
        circles = [];

    }
    
    //销毁
    function destory() {
        innerDiv.removeChild(innerSvg);
        dom.removeChild(innerDiv);
        return false;
    }
    
    function getRealPoint( p ){
        var deltaDiv = rate/currentScale*finalScale;
        return {
            x : p.x/delta,
            y : p.y/delta,
            floorIndex : p.floorIndex
        }
    }
    
    function transform( p ){
        var deltaDiv = rate/currentScale*finalScale;
        return {
            x : p.x * delta,
            y : p.y * delta,
            floorIndex : p.floorIndex
        }
    }
    
    function getMallName() {
        return mallName;
    }
    
    function getCurrentFloorId() {
        return currentFloorId;
    }
    
    function getFloors() {
       return floor;
    }
    //callback指针
	this.onFloorChange = null; 
	
	//将指针绑定函数
	this.zoomIn = zoomIn;
	this.zoomOut = zoomOut;
	this.addOverlay = addOverlay;
    this.clearOverlays = clearOverlays;
    this.changeFloor = changeFloor;
    this.toggleFacilities = toggleFacilities;
    this.destory = destory;
    this.transform = transform;
    this.getRealPoint = getRealPoint;
    this.getMallName = getMallName;
    this.getCurrentFloorId = getCurrentFloorId;
    this.getFloors = getFloors;
    this.rotate = rotate;
}