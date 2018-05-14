;(function(A,$) {
    A.weixin = {
    	ServerPath: '/chealth-app-web/',
    	showModal: function() {
            var that = this;
            if (arguments.length == 1) that.style[arguments[0]] = 'active'
            else {
                for (var i = arguments.length - 1; i >= 0; i--) {
                    var c = arguments[i]
                    typeof c === 'function' ? c.call(that) : that.style[c] = 'active'
                    
                }
            }
        },
        hideModal: function() {
            var that = this;
            if (arguments.length == 1) that.style[arguments[0]] = ''
            else {
                for (var i = arguments.length - 1; i >= 0; i--) {
                    var c = arguments[i]
                    typeof c === 'function' ? c.call(that) : that.style[c] = ''
                }
            }
        },
		loading:{
			loading : null,
			show:function(opt){
				var that = this,message = opt&&opt.message ? opt.message||opt : '数据加载中';
				if(that.loading) that.loading.remove();
				var html = $('\
				<div id="loading" class="weui_loading_toast">\
	                <div class="weui_mask_transparent"></div>\
	                <div class="weui_toast">\
	                    <div class="weui_loading">\
	                        <div class="weui_loading_leaf weui_loading_leaf_0"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_1"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_2"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_3"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_4"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_5"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_6"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_7"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_8"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_9"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_10"></div>\
	                        <div class="weui_loading_leaf weui_loading_leaf_11"></div>\
	                    </div>\
	                    <p class="weui_toast_content">'+message+'</p>\
	                </div>\
	            </div>')
				var body = $(document.body)
				body.append(html)
				that.loading = $(document.querySelector('#loading'));
				if(opt){
					if(opt.complete){
						that.loading.removeClass('weui_loading_toast');
						$(document.querySelector('.weui_toast')).html('<i class="weui_icon_toast"></i><p class="weui_toast_content">'+message+'</p>')
					}
					if(typeof opt.time === 'number'){
						setTimeout(function(){
							that.loading.remove();
						}, opt.time);
					}	
				}
			},
			hide:function(){
				var that = this;
				if(that.loading) that.loading.remove();
			}
		},
		wxLocation: function(url){
			var that = this,time = (new Date()).getTime(),params = A.getParams();openid = params.openId||params.openid
			location.href = url+'.html?ticket='+params.ticket+'&openid='+openid+'&appid='+params.appid+'&time='+time
		},
		wxUrlBack: function(){
			var that = this,time = (new Date()).getTime(),params = A.getParams();openid = params.openId||params.openid
			if(history.length>0){
				history.back();
			}else{
				location.href = 'user.html?ticket='+params.ticket+'&openid='+openid+'&appid='+params.appid+'&time='+time
			}
		},
		weixinEvent:function(){
			var that = this;
			// window.onpopstate = function (e) {
			//     history.pushState({ "pageKey": "inited" }, window.title, self.location);
			//     if (onpopstateInited == true) {
			//         that.msg("退出当前应用吗？", function () {
			//             WeixinJSBridge.call('closeWindow');
			//         })
			//     }
			//     onpopstateInited = true;
			// }
		    function onBridgeReady() {
		        // WeixinJSBridge.call('hideOptionMenu');
		        // WeixinJSBridge.call('hideToolbar');
		        // WeixinJSBridge.call('hideOption');
		    }

		    if (typeof WeixinJSBridge == "undefined") {
		        if (document.addEventListener) {
		            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		        } else if (document.attachEvent) {
		            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
		            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		        }
		    } else {
		        onBridgeReady();
		    }
		}
    };
})(my,angular.element);