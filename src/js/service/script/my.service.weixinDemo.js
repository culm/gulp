;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        SHA1:function(e){function d(y,j){var i=(y<<j)|(y>>>(32-j));return i}function s(A){var z="";var j;var B;var y;for(j=0;j<=6;j+=2){B=(A>>>(j*4+4))&15;y=(A>>>(j*4))&15;z+=B.toString(16)+y.toString(16)}return z}function u(A){var z="";var y;var j;for(y=7;y>=0;y--){j=(A>>>(y*4))&15;z+=j.toString(16)}return z}function b(j){j=j.replace(/\r\n/g,"\n");var i="";for(var z=0;z<j.length;z++){var y=j.charCodeAt(z);if(y<128){i+=String.fromCharCode(y)}else{if((y>127)&&(y<2048)){i+=String.fromCharCode((y>>6)|192);i+=String.fromCharCode((y&63)|128)}else{i+=String.fromCharCode((y>>12)|224);i+=String.fromCharCode(((y>>6)&63)|128);i+=String.fromCharCode((y&63)|128)}}}return i}var h;var w,v;var c=new Array(80);var n=1732584193;var l=4023233417;var k=2562383102;var g=271733878;var f=3285377520;var t,r,q,p,o;var x;e=b(e);var a=e.length;var m=new Array();for(w=0;w<a-3;w+=4){v=e.charCodeAt(w)<<24|e.charCodeAt(w+1)<<16|e.charCodeAt(w+2)<<8|e.charCodeAt(w+3);m.push(v)}switch(a%4){case 0:w=2147483648;break;case 1:w=e.charCodeAt(a-1)<<24|8388608;break;case 2:w=e.charCodeAt(a-2)<<24|e.charCodeAt(a-1)<<16|32768;break;case 3:w=e.charCodeAt(a-3)<<24|e.charCodeAt(a-2)<<16|e.charCodeAt(a-1)<<8|128;break}m.push(w);while((m.length%16)!=14){m.push(0)}m.push(a>>>29);m.push((a<<3)&4294967295);for(h=0;h<m.length;h+=16){for(w=0;w<16;w++){c[w]=m[h+w]}for(w=16;w<=79;w++){c[w]=d(c[w-3]^c[w-8]^c[w-14]^c[w-16],1)}t=n;r=l;q=k;p=g;o=f;for(w=0;w<=19;w++){x=(d(t,5)+((r&q)|(~r&p))+o+c[w]+1518500249)&4294967295;o=p;p=q;q=d(r,30);r=t;t=x}for(w=20;w<=39;w++){x=(d(t,5)+(r^q^p)+o+c[w]+1859775393)&4294967295;o=p;p=q;q=d(r,30);r=t;t=x}for(w=40;w<=59;w++){x=(d(t,5)+((r&q)|(r&p)|(q&p))+o+c[w]+2400959708)&4294967295;o=p;p=q;q=d(r,30);r=t;t=x}for(w=60;w<=79;w++){x=(d(t,5)+(r^q^p)+o+c[w]+3395469782)&4294967295;o=p;p=q;q=d(r,30);r=t;t=x}n=(n+t)&4294967295;l=(l+r)&4294967295;k=(k+q)&4294967295;g=(g+p)&4294967295;f=(f+o)&4294967295}var x=u(n)+u(l)+u(k)+u(g)+u(f);return x.toLowerCase()},
        config: function(appid, token, apiList){
            //var d = $q.defer(),
            var that=this;
            var newDate = new Date(),
                setDate = parseInt(newDate.getTime()/1000),
                ticket = 'jsapi_ticket=' + token + '&noncestr=' + appid + '&timestamp='+setDate+'&url='+location.href.split('#')[0];
            wx.config({
                debug: false,
                appId: appid,
                timestamp: setDate,
                nonceStr: appid,
                signature: this.SHA1(ticket),
                jsApiList: apiList
            });
            wx.error(function(res){
                // d.reject(res);
                console.log(res);
                alert("微信认证失败，请退出公众号，再次登录");
            });
            // return d.promise;
        },
         /**
         * [uploadImg 上传图片] 
         * @param  {number} imgid   [img id]
         * @param  {number} imgdata  [img data]
         */
        uploadImg: function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'weixin/upload/image/execute',
                type: 'post',
                data:{
                    params: A.toJSON(data)
                },
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },

        /**
         * [getImg 获取图片] 
         * @param  {number} imgid   [img id]
         */
        getImg: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'weixin/upload/image/find/'+ data,
                type: 'get',
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },

        /**
         * [getTicket 获取ticket] 
         * @param  {number} imgid   [img id]
         */
        getTicket: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'lipei/weixin/info/get',
                //url: '/getTicket',
                type: 'get',
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        }
       
    });
    A.service.weixinDemo = new CT();
})(my)