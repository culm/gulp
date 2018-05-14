;(function(A){

    // directive字段的详细解释http://www.cnblogs.com/lvdabao/p/3391634.html
    A.getApp.directive('photograph',function($timeout){
        return {
            // 'E' : 用于元素的名称 (<my-loading></my-loading>|<my-loading/>)
            // 'A' : 用于元素的 Attribute，这是默认值 (<span my-loading="exp"></span>)
            // 'C' : 用于 CSS 中的 class (<span class="my-dir: exp;"></span>)
            // 'M' : 用于注释 (<!-- directive: my-dir exp -->)
            restrict : 'EA',
            // 是否替换指令标签(true|flas)
            replace : true,
            // 是否将当前元素的内容转移到模板中(true|flas)
            transclude : true,
            // 指定指令的作用域
            // scope: bool or object,   
            // 指定需要依赖的其他指令
            require: '^?my-auto-height',         
            // 模板文件引入(string)
            // templateUrl : 'template.html'
            // 模板字符(string)
            template : '<section class="modal modal-top {{photographActive}}">\
                <header>人脸识别</header>\
                <div class="module content" my-auto-height ng-transclude>\
                    <div class="photograph">\
                        <video id="video" width="100%" my-auto-height ng-transclude autoplay></video>\
                        <canvas id="canvas" width="80" height="120"></canvas>\
                    </div>\
                </div>\
                <footer>\
                    <a class="left" ng-click="photographs.shooting()">拍照</a>\
                    <a class="right" ng-click="closePhotograph()">提交验证</a>\
                </footer>\
            </section>',
            // 定义与其他指令进行交互的接口函数
            // controller: function controllerConstructor($scope, $element, $attrs, $transclude){...},
            // 以编程的方式操作DOM，包括添加监听器等
            link: function(scope, el, attr){
                // scope是父级元素controller的$scope
                // el是父级元素的jquery对象(angular简单的封装了jQlite)
                // attr是父级元素上attr元素

                scope.closePhotograph=function(){
                    var that = this;
                    that.hideModal('photographActive')
                    that.photographs.close()
                },
                scope.checkSelf = function(){
                    var that = this;
                    that.showModal('photographActive')
                    that.photographs = that.photograph({
                        canvas:'canvas',
                        video:'video',
                        imgX: 200,
                        imgY: 200,
                        callback:function(url){
                            $('#canvas').animate({'left': '300px','margin-left': 0,'opacity': 1},300);
                            $('#video').animate({'left': '50px','margin-left': 0},300);
                        }
                    });
                    return false;
                }
                scope.photograph = function(op){
                    var that = this;
                    //获取摄像头的视频流并显示在Video
                    var canvas = document.getElementById(op.canvas),
                        context = canvas.getContext("2d"),
                        video = document.getElementById(op.video),
                        videoObj = { "video": true },
                        streams = null;
                        errBack = function (error) {
                            if(error.name=='PermissionDeniedError'){
                                that.msg('浏览器禁止了网页获取摄像头，请在设置中打开')
                            };
                        };
                    navigator.getMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia
                    navigator.getMedia(videoObj, function (stream) {
                        video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                        that.msg(video.src)
                        video.play();
                        //必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
                        document.addEventListener("WeixinJSBridgeReady", function () {
                            video.play();
                        }, false);
                        streams=stream
                    }, errBack);
                    //拍照按钮的事件，
                    function shooting(){
                        context.drawImage(video, 0, 0, op.imgX, op.imgY);
                        url = document.getElementById(op.canvas).toDataURL();
                        if (typeof op.callback === 'function') op.callback(url)
                    }
                    function closeVideo(){
                        video.src = '';
                        streams.stop();
                    }
                    return {close:closeVideo,shooting:shooting}
                }
                

            }
        };
    })
})(my)

