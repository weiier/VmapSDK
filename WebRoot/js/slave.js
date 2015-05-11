function VPoint( x, y, floorIndex ) {
    this.x = parseInt( x * 1000 ) / 1000;
    this.y = parseInt( y * 1000 ) / 1000;
    this.floorIndex = floorIndex;
}

function VPosition( left, top ) {
    this.left = left;
    this.top = top;
}

function Vsize( width, height ) {
    this.width = width;
    this.height = height;
}

function VNavigationControl( position ) {
     //最大显示5层
    var defaultMaxFloor = 5;
    //每层楼的默认大小
    var defaultFloorWidth = 25;
    //小圆圈的上偏移量
    var circleDeltaTop = 4;
    var liIdsuffix = "thfloor";

    //当前居中层
    var currentMidFloor = null;
    var changeAble = true;
    //上下两个按键是否有效
    var upButtonValid = true;
    var downButtonValid =true;
    //楼层数
    var maxFloor = null;
    var hidden = false;
    //函数指针
    //切换楼层
    this.changeFloor = null;
    this.show = null;
    this.hide = null;
    this.isHidden = null;
    //保存自己
    var This = this;
   //移动到中间
    this.getMid = null;


    if ( !position ) {
        position = { 
            left : "50px",
            top : "50px"
        }
    } 
   //外表框
    var navigator = document.createElement("div");
    navigator.id = "floorNavigation";
    $(navigator).css({
        position : "absolute",
        width : defaultFloorWidth+"px",
        left : position.left,
        top : position.top,
        "z-index" : "10000"
    });
    
    //内框限制ur
    var navigatorInner = document.createElement("div");
    navigatorInner.id = "navigatorInner";
    $(navigatorInner).css({
        position : "absolute",
        width : defaultFloorWidth+"px",
        top : defaultFloorWidth+"px",
        overflow : "hidden",
        cursor : "auto"
    });
    //向上按钮
    var upButton = document.createElement("div");
    upButton.id = "upButton";
    $(upButton).css({
        position : "absolute",
        width : defaultFloorWidth+"px",
        height : defaultFloorWidth+"px",
        top : 0,
        background : "url(./zoom_ico.gif) -1px -56px no-repeat",
        "border-bottom" : "2px solid white",
        cursor : "pointer"
    });
    
   //向下按钮
    var downButton = document.createElement("div");
    $(downButton).css({
        position : "absolute",
        width : defaultFloorWidth+"px",
        height : defaultFloorWidth+"px",
        background : "url(./zoom_ico.gif) -2px -86px no-repeat",
        "border-top" : "2px solid white",
        cursor : "pointer"
    });
    //透明的小圆圈
    var circle = document.createElement("div");
    circle.id = "circle";
    $(circle).css({
        position : "absolute",
        left : "2px",
        width : defaultFloorWidth+"px",
        height : defaultFloorWidth+"px",
        background : "url(./circle.png) -0.5px 0px no-repeat",
        cursor : "pointer",
        opacity : 0.7,
    });
    
    //楼层的列表
    var floorList = document.createElement("ul");
    floorList.id = "floorList";


    //填充导航板
    function fillNavigator( floors ) {
        var i = 0;
        maxFloor = floors.length-1;
       //动态获取显示多少个楼层
        var show = defaultMaxFloor;
        for ( i = maxFloor; i >= 0; i-- ) {
            //创建li元素
            var liItem = document.createElement("li");
            $(liItem).css({
                "width" : "25px",
                "height" : "25px",
                "margin" : "0 0 0 0",
                "text-align" : "center",
                });
            liItem.id = (i)+liIdsuffix;
             //li元素显示的内容
            var str = floors[i].floor_brief;
            var innerStr = "";
            if ( "B" == str[0] ) {
                innerStr ="-" ;
            }
            innerStr += str.slice(1);
            $(liItem).text(innerStr);
             //给p和li找到爸爸
            floorList.appendChild(liItem);
        }
       //判断有多少层楼显示多少层楼
        if ( maxFloor < show ) {
            show = maxFloor;
        }
        //获取当前楼层值
        currentMidFloor = maxFloor - parseInt(show/2);
        //找到navigator的高度和内框的高度
        // console.log("s "+currentMidFloor);
        navigatorInner.style.height = (show*defaultFloorWidth)+"px";
        navigator.style.height = ((show+2)*defaultFloorWidth)+"px";
      //找到list、navigator和内框的爸爸
        navigatorInner.appendChild(floorList);
        navigator.appendChild(upButton);
        navigator.appendChild(navigatorInner);
        //找到按钮下的位置并找到他的爸爸
        $(downButton).css("top",(show+1)*defaultFloorWidth+"px");
        navigator.appendChild(downButton);
         //找到小圆圈的位置并给他找到爸爸
        $(circle).css("top",((parseInt(show/2)+1)*defaultFloorWidth+circleDeltaTop)+"px");
        navigator.appendChild(circle);
        //添加儿子
        document.getElementById("map").appendChild(navigator);
         //找到当前的楼层并改变其颜色
        str = "#"+currentMidFloor+liIdsuffix;
        $(str).css({
            "color":"black"
                   });
    }
    
    //单击事件
    function listClick(event) {
        var floor = parseInt(event.target.id);
        if ( isNaN(floor) ) {
            return false;
        }
        getMid(floor);
        event.preventDefault();
    }
    
    //移动到中间咯(delta为true的时候是相对移动 否则全部为绝对移动)
    function getMid(n,delta) {
        if ( changeAble === false ) {
            return false;
        }
        changeAble ===true;
        var c = null;
        var save = currentMidFloor;
        var circleTop = parseInt($(circle).css("top"));
        n = parseInt(n);
        if ( delta !== true  ) {
            c = n - currentMidFloor;
            currentMidFloor = n;
            
        } else {
            c = n;
            currentMidFloor += n;
        }
        if ( ( currentMidFloor < 0 ) || ( currentMidFloor > maxFloor ) ) {
            currentMidFloor = save;
            return false;
        }
        var deltaTop = c*defaultFloorWidth;
        deltaTop = "+="+deltaTop+"px";
        refreshFont();
        $(circle).css({
            "top" : ((-c)*defaultFloorWidth+circleTop)+"px"
        });
        $(floorList).animate({top:deltaTop},Math.abs(c)*120);
        $(circle).animate({top:circleTop},Math.abs(c)*120);
        updateValid();
        if ( This.changeFloor !== null ) {
            This.changeFloor(currentMidFloor);
        }
        changeAble === true;
        return false;
    }
    //检查是否达到最上层
    function checkMaxFloor() {
        if ( currentMidFloor === maxFloor ) {
            if ( upButtonValid === true ) {
                upButtonValid = false;
                $(upButton).css("background","url(./zoom_ico.gif) -29px -56px no-repeat");
            }
        } else {
            if ( upButtonValid === false ) {
                upButtonValid = true;
                $(upButton).css("background","url(./zoom_ico.gif) -1px -56px no-repeat");
            }
        }
    }

    //检查是否达到最下层
    function checkMinFloor() {
        if ( currentMidFloor === 0 ) {
            if ( downButtonValid === true ) {
                downButtonValid = false;
                $(downButton).css("background","url(./zoom_ico.gif) -30px -86px no-repeat");
            }
        } else {
            if ( downButtonValid === false ) {
                downButtonValid = true;
                $(downButton).css("background","url(./zoom_ico.gif) -2px -86px no-repeat");
            }
        }
    }
    
    function refreshFont() {
        $("li").css({
            "color" : "white"
        });
        // console.log("!! "+currentMidFloor);
        var str = "#"+currentMidFloor+liIdsuffix;
        $(str).css({
            "color" : "black"
        });
    }
    

    //更新上下按钮是否可用
    function updateValid() {
        checkMaxFloor();
        checkMinFloor();
    }
    
     //生成绝对偏移函数
    function makefunction(x) {
        return function() {
            getMid(x,true);
        }
    }
    
    $(floorList).bind("click",listClick);
    $(upButton).bind("click",makefunction(1));
    $(downButton).bind("click",makefunction(-1));
    this.fillNavigator = fillNavigator;
    this.getMid = getMid;
    
    function hide( t ) {
        if ( t === null ) {
            t = 0;
        }
        $(navigator).hide(t,function(){
            hidden = true;
        });
    }
    function show( t ) {
        if ( t == null ) {
            t = 0;
        }
        $(navigator).show(t,function() {
            hidden = false;
        });
    }
    function isHidden() {
        return hidden;
    }
}


function VPolyline( vpoints, lineWidth, lineColor, lineId ) {
    var points = null;
    var floorIndex = null;
    var color = "rgba(138,43,226,0.5)";
    var width = 5;
    var type = "line";
    var id = null;
    if ( vpoints === null ) {
        return undefined;
    } else {
        points = vpoints;
        floorIndex = points[0].floorIndex;
    }
    if ( lineWidth ) {
        width = lineWidth;
    }
    if ( lineColor ) {
        color = lineColor;
    }
    if ( lineId ) {
        id = lineId;
    }
    this.type = function () {
        return type;
    }
    this.color = function () {
        return color;
    }
    this.points = function () {
        return points;
    }
    this.floorIndex = function () {
        return floorIndex;
    }
    this.width = function () {
        return width;
    }
}

function VCircle( vpoint , vradius , lineWidth , lineColor , lineId ) {
    var point = null;
    var floorIndex = null;
    var color = "red";
    var width = 2;
    var type = "circle";
    var id = null;
    var radius = 0;
    if( vpoint === null ) {
        return undefined;
    } else {
        point = vpoint;
    }
    if ( lineWidth ) {
        width = lineWidth;
    }
    if ( lineColor ) {
        color = lineColor;
    }
    if ( lineId ) {
        id = lineId;
    }   
    if( vradius === null ){
        return undefined;
    }else {
        radius = vradius;
    }
        
     this.type = function () {
        return type;
    }
    this.color = function () {
        return color;
    }
    this.point = function () {
        return point;
    }
    this.floorIndex = function () {
        return point.floorIndex;
    }
    this.width = function () {
        return width;
    }
    this.radius = function() {
        return radius;
    }
}

//标记点
function VMarker( vpoint, id, offset){
    //默认偏移
    var defaultLeft = -26;
    var defaultTop = -50;
    //是否为隐藏
    var hidden = false;
    //类型
    var type = "marker";
    //位置
    var point = null;
    //链接
    // var url = pUrl;
    //是否有位置
    if ( vpoint ) {
        point = vpoint;
    } else {
        return undefined;
    }
    //构建dom
    var marker = document.createElement("div");
    marker.style.position = "absolute";
    //var message = document.createElement("div");
    //message.style.position = "absolute";
    //marker.appendChild(message);
    var img = document.createElement("img");
    img.style.position = "absolute";
    marker.appendChild(img);
    
    //图片的位置
    if(id == 2){//id=2代表目标点，为蓝色

        img.src = "./pop2.png";
    }else{ //id=1或空，表示原点，为红色

        img.src = "./pop1.png";
    }
    //message.innerHTML=" <button onclick='showbeacon(\""+ id + "\")'> I</button> ";

    //对齐图片的偏移量
    if ( offset ) {
        $(img).css({
            left : offset.left+"px",
            top : offset.top+  20 +"px",
            width:50+"px",
            height:30+"px",
            "z-index" : 10,
            "text-align" : "center",
        })
    } else {

        $(img).css({
            left: defaultLeft + "px",
            top: defaultTop + 20 + "px",
            width: 50 + "px",
            height: 30 + "px",
            "text-align": "center",
            "z-index":10,
        })
    }

    //方法
    //隐藏
    function hide( t ) {
        if ( t === null ) {
            t = 0;
        }
        $(marker).hide(t,function(){
            hidden = true;
        })
    }
    //显示
    function show( t ) {
        if ( t === null ) {
            t = 0;
        }
        $(marker).show(t, function(){
            hidden = false;
        })
    }
    function isHidden() {
        return hidden;
    }
    function getPosition() {
        return point;
    }

    function setPosition( p ) {
        $(marker).css({
            left : p.left+"px",
            top : p.top+"px"
        })
        point = p;
    }

    function getImgUrl() {
        return url;
    }

    function setImgUrl( newUrl ) {
        url = newUrl;
        img.src = url;
    }

    function getZIndex() {
        return $(marker).css("zIndex");
    }

    function setZIndex( zindex ) {
        $(marker).css( "zIndex", zindex );
    }

    //函数指针指向
    this.show = show;
    this.hide = hide;
    this.isHidden = isHidden;
    this.getPosition = getPosition;
    this.setPosition = setPosition;
    this.getImgUrl = getImgUrl;
    this.setImgUrl = setImgUrl;
    this.getZIndex = getZIndex;
    this.setZIndex = setZIndex;
    this.type = function () {
        return type;
    }
    this.dom = marker;
    this.floorIndex = function() {
        return point.floorIndex;
    }
    this.point = function () {
        return point;
    }
    this.click = null;
    //$(img).bind("click",this.click);
}

