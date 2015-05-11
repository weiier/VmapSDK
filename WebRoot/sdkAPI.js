function PScript(src) {
    document.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
}

_Vmapi_url = (function () {
    var script = document.getElementsByTagName("script");
    //浏览器标志位
    var uaFlag = (function() {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('android') > -1)? true : false ;  
    })();
	for (var i = 0; i < script.length; i++) {
        if (script[i].src.indexOf("sdkAPI.js") !== -1) {
			if( uaFlag ) {
				return script[i].src.replace(/sdkAPI.js/, "android");
			}else{
				console.log(script[i].src);
				return script[i].src.replace(/sdkAPI.js/, "js");/*file:\/\/\/.*/
			}
        }
    }
    alert("<script>标签内的src不正确！");
    return "";
})();
console.log(_Vmapi_url);

PScript(_Vmapi_url + "/J.js");
PScript(_Vmapi_url + "/hammer.js");
PScript(_Vmapi_url + "/main.js");
PScript(_Vmapi_url + "/slave.js");

