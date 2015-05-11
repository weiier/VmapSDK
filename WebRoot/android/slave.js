function VPoint( x, y, floorIndex , color ) {
	var type = "point";
	var dColor = color || "red";
	
    this.x = parseInt( x * 1000 ) / 1000;
    this.y = parseInt( y * 1000 ) / 1000;
    this.floorIndex = floorIndex;
	
	this.color = function() {
		return dColor;
	};
	this.type = function () {
		return type;
	}
}

function VPosition( left, top ) {
    this.left = left;
    this.top = top;
}

function Vsize( width, height ) {
    this.width = width;
    this.height = height;
}

function VPolyline( vpoints, lineWidth, lineColor, lineId ) {
    var points = null;
    var floorIndex = null;
    var color = "rgba(138,43,226,0.5)";
    var width = 4;
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
    var img = document.createElement("img");
    img.style.position = "absolute";
    marker.appendChild(img);
    //图片的位置
     if(id == 2){//id=2代表目标点，为蓝色

        img.src = "./pop2.png";
    }else{ //id=1或空，表示原点，为红色

        img.src = "./pop1.png";
    }

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
            left: defaultLeft+ "px",
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
    this.dom = marker;
    
    this.type = function () {
        return type;
    }
   
    this.floorIndex = function() {
        return point.floorIndex;
    }
    this.point = function () {
        return point;
    }
    this.click = null;
    //$(img).bind("click",this.click);
}

