;(function(w){
    var rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
	var A = w.my = {
        getApp: function(app){
            var myapp = app || 'myApp';
            if(!this.__app) {
                this.__app = angular.module(myapp, []);
            }
            return this.__app;
        },
        getServer: function(emulate, customerServerPath){
            var serverPath = customerServerPath || '@@ServerPath@@';
            //emulate start
            var emulateServerPath = '@@EmulateServerPath@@';
            if(emulate){
                serverPath = emulateServerPath;
            }
            //emulate end
            return serverPath;
        },
        parseJSON: function(data){
        	try{
                if(typeof data != 'string') return data;
                if(window.JSON) return JSON.parse(data);
                if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                    .replace( rvalidtokens, "]" )
                    .replace( rvalidbraces, "")) ) {
                    return ( new Function( "return " + data ) )();
                }
                alert('my.parseJSON unkown value:' + data);
            }catch(e){
           	    var s = 0;
            }
        },
        toJSON: function(obj){
            return my.getJson(obj);
        },
        _getJson: function(obj, t){
            switch(typeof obj){
                case 'number':
                case 'date':
                case 'boolean':
                    return obj;
            }
            var objArr = [];
            for (var j in obj) {
                var o = obj[j],
                    _type = typeof o;
                if ( _type == 'function')
                    objArr.push('"' + j + '":"' + o.name + '"');
                else if (_type == 'object')
                    objArr.push('"' + j + '":' + A._getJson(o));
                else if((_type == 'object' || _type =='array') && typeof o.length == 'number'){
                    objArr.push('[');
                    var index = 0,
                        len = o.length;
                    for(; index<len; index++){
                        var _o = o[index];
                        objArr.push('{' + A._getJson(_o) + '}');
                        if(index != len -1) objArr.push(',');
                    }
                    objArr.push(']');
                }
                else{
                    objArr.push('"' + j + '":"' + o + '"');
                }
            }
            return objArr.join(',');
        },
        /**
        * 使dom元素居中
        */
        center: function(target){
            if(!target) return;
            var top = (window.innerHeight - target.clientHeight)/2,
                left = (window.innerWidth-target.clientWidth)/2;
            if(top < 0) top = 0;
            if(left < 0) left = 0;
            A.showMask();
            target.style.left = left + 'px';
            target.style.top = top + 'px';
        },
        getJson: function(obj){
            if(window.JSON) return JSON.stringify(obj);
            if(typeof obj.length == 'number'){
                var arr = [];
                arr.push('[');
                var index = 0,
                    len = obj.length;
                for(; index<len; index++){
                    var o = obj[index];
                    arr.push('{' + A._getJson(o, t) + '}');
                    if(index != len -1) arr.push(',');
                }
                arr.push(']');
                return arr.join('');
            }else
                return '{' + A._getJson(obj, t) + '}';
        },
        /*
        * method: method name
        * service: service name,
        * serviceType: 服务类型
        * data:
        * prefix: url前缀，如/physician/或/patient/
        *  其他ajax的参数
        */
        serviceAjax: function(options){
            var prefix = options.prefix || '',
                serviceType = options.serviceType || 'RestServiceCall',
                url = prefix + '/' + serviceType + '/' + options.service + '/' + options.method;
            if (!options.url) {
                options.url = url;
            }

            if (!options.dataType) options.dataType = 'json';
            if (!options.data) options.data = {};
            options.data = {
                params: A.toJSON(options.data)
            };
            return A.ajax(options);
        },
        alert: function(message, func){
            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: message,
                buttons:[{text: '确定', class: 'btn btn-default', value: 0, dismiss: 'modal'}],
                onClick: function(){
                    if(func) func()
                }
            });
        },
        confirm: function(obj){
            A.widget.dialog.show({
                title: obj.title||'请选择',
                modalType: '',
                modalDialog: 'modal-sm',
                message: obj.message||'请做出选择',
                buttons:obj.buttons||[{text: '确定', class: 'btn btn-primary', value: 0, dismiss: 'modal'},{text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'}],
                onClick: function(ev){
                    if(ev==0) obj.fn(obj,ev)
                    if(ev==1) obj.fn(1)
                }
            });
        },
        getParams: function(){
            var s = decodeURIComponent(window.location.search.substr(1));
            var o = new Object();
            var aryVars = s.split('&');
            for ( var i = 0; i < aryVars.length; i++) {
                var index = aryVars[i].indexOf('=');
                var aryPair = [ aryVars[i].substring(0, index),
                        aryVars[i].substring(index + 1) ];
                o[aryPair[0]] = aryPair[1];
            }
            return o;
        },
        getformdata : function(formId){
        	var params = decodeURI($("#" + formId).serialize());
        	var obj = {};
        	var aryVars = params.split('&');
        	for (var i = 0; i < aryVars.length; i++) {
        		var index = aryVars[i].indexOf('=');
        		var key = aryVars[i].substring(0, index);
        		var value = aryVars[i].substring(index + 1);
        		obj[key] = value;
        	}
        	return obj;
        },
        getQueryString : function (name, location) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = (location || window.location).search.substr(1).match(reg);
            if (r != null) return r[2]; return '';
        },

		extend: function(target){
			var len = arguments.length,
				index = 1,
				first = arguments[0];
			if(typeof target == 'boolean'){
				if(target) first = {};
				else{
					first = arguments[1];
					index = 2;
				}
			}
			for(; index < len; index++){
				var o = arguments[index];
				for(i in o) if(o[i] !== undefined) first[i] = o[i];
			}
			return first;
		},
		on: function (handle, type, el, bubble) {
            el.addEventListener(type, handle, !!bubble);
        },
        off: function (handle, type, el, bubble) {
            el.removeEventListener(type, handle, !!bubble);
        },
		showErr : function(ex, title) {
			try {
				var message = [ex.message];
				for (i in ex) {
					//if (typeof ex[i] == 'function' || typeof ex[i] == 'object') continue;
					message.push("\n" + i + ":" + ex[i]);
				}

				A.alert(window.location.href + ":" + message.join(';'));
				//throw ex;
			} catch (err) {
				A.alert(ex.type + ':' + ex.message);
			}
		},
		getVendor: function(){
			if(typeof my._vendor !== 'undefined') return my._vendor;
			var vendors = 't,webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				l = vendors.length,
				docStyle = document.documentElement.style;

			for ( ; i < l; i++ ) {
				t = vendors[i] + 'ransform';
				if ( t in docStyle) {
					my._vendor = vendors[i].substr(0, vendors[i].length - 1).toLowerCase();
				}
			}
			return my._vendor;
		},
        showMask: function() {

            var doc = document,

                target = doc.body,

                th = target.clientHeight,

                tw = target.clientWidth,

                top = 0,

                left = 0,

                zIndex = parseInt(target.style.zIndex, 10),

                z = isNaN(zIndex) ? 99 :  1,

                fr = doc.getElementById("mybabyMask");

            if (th < window.innerHeight) th = window.innerHeight;

            if (tw < window.innerWidth) tw = window.innerWidth;

            //z = z > 0 ? z : 1;

            if (!fr) {

                fr = document.createElement("div");

                fr.setAttribute("id", 'mybabyMask');

                // fr.setAttribute("style", "background:none repeat scroll 0 0 rgba(0, 0, 0, 0.9);dispaly:block;margin:0px;padding:0px;border:0px;position:absolute;z-index:" + z + ";opacity:0.5;width:" + tw + "px;height:" + th + "px;left:" + left + "px;top:" + top + "px");
                fr.setAttribute("style", "background:rgba(0, 0, 0, 0.5);dispaly:block;position:fixed;z-index:" + z + ";opacity:0.5;width:100%;height:100%;left:0px;top:0px;right:0px;bottom:0px");

                target.appendChild(fr);

            } else {

                fr.style.width = tw + 'px';

                fr.style.height = th + 'px';

                fr.style.display = 'block';

            }

        },

        hideMask: function() {

            var mybabyMask = document.getElementById('mybabyMask');

            if (mybabyMask) mybabyMask.style.display = "none";

        },

		each: function(elements, callback){
			var i, key
			if (elements && typeof elements.length == 'number') {
			  for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
			  for (key in elements)
				if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		},
        ua: function(){
            var doc = w.document,
                na = w.navigator,
                ua = na.userAgent,
                appVersion = ua.appVersion,
                ieAX = w.ActiveXObject,
                ieMode = doc.documentMode,
                _getIeVersion = function () {
                    var v = 3,
                        p = doc.createElement('p'),
                        all = p.getElementsByTagName('i');
                    while (
                        p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                        all[0]);
                    return v > 4 ? v : 0;
                },
                ieVer = _getIeVersion() || ieMode || 0,
                obj = {
                    na : na,
                    ua : ua,
                    appVersion : appVersion,
                    ieAX : ieAX,
                    ieVer : ieVer,
                    ieMode : ieMode
                };
            return obj
        }()
	};

})(this);
