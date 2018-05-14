;(function(A) {
    A.base = {
        checkPattern: function(prefix){
            var that = this,
                all = null,
                isValid = true;
            if(typeof prefix == 'object'){
                all = prefix.find('[data-pattern]');
            }else{
                all = $((prefix || '') + ' [data-pattern]')
            }
            A.each(all, function(index, dom){
                isValid = that.isValid(dom);
                if(!isValid){
                    var obj = $(dom);
                    A.widget.tooltip.show({
                        message: obj.data('content'),
                        placement: 'bottom',
                        autoClose: 2000,
                        target: obj
                    });
                    return false;
                }
            });
            return isValid;
        },
        checkBlur: function(prefix){
            var that = this,
                all = typeof prefix == 'string' ? $(prefix) : prefix;
            all.off('focus');
            all.off('blur');
            all.on('focus', function(e){
                var obj = $(e.target);
                obj.parent().removeClass('has-error');
            }).on('blur', function(e){
                var obj = $(e.target);
                if(!that.isValid(e.target)) {
                    obj.parent().addClass('has-error');
                    A.widget.tooltip.show({
                        message: obj.data('content'),
                        placement: 'bottom',
                        autoClose: 2000,
                        target: obj

                    });
                    return false;
                }
            });
        },
        closeCheckBlur:function(prefix){
            var all = $(prefix);
            A.each(all,function(index, el) {
                $(el).parent().removeClass('has-error')
            });
            $('body .popover').remove();
        },
        isValid: function(dom){
            var that = this,
                isValid = true,
                value = dom.value;
            A.each(A.parseJSON(dom.getAttribute('data-pattern'))||[], function(key, message){
                if(key.indexOf('data-') == 0){
                    var method = key.split('-')[1],
                        isSelfMethod = typeof value[method] === 'function',
                        isThatMethod = typeof that[method] === 'function';
                    if(value && isSelfMethod){
                        if(!value[method]()){
                            isValid = false;
                            $(dom).data('content', message);
                            return false;
                        }
                    }
                    else if(value && isThatMethod){
                        if(!that[method](dom)){
                            isValid = false;
                            $(dom).data('content', message);
                            return false;
                        }
                    }
                }else{
                    var pattern = new RegExp(key,'g');
                    if(!pattern.test(value)){
                        isValid = false;
                        $(dom).data('content', message);
                        return false;
                    }
                }
            });
            return isValid;
        },
        onLogin: function(user){
            var item = $('#header-loginitem');
            item.html('<img class="avatar" src="'+user.avatar+'">'+user.name+' <span class="caret"></span>');
            item.addClass('logined');
            item.attr('data-toggle','dropdown');
        },
        /**
        * 调整左侧导航栏的高度
        */
        resizeHeight: function(){
            var height = window.innerHeight,
                menu = $('.left-menu'),
                rightMenu = $('.right-body'),
                mHeight = menu.height(),
                rightHeight = rightMenu.height() + rightMenu.offset().top;
            if(height <= rightHeight) height = rightHeight;
            $('.left-menu').height(height-51);
        },
        photograph:function(op){
            //获取摄像头的视频流并显示在Video
            var canvas = document.getElementById(op.canvas),
                context = canvas.getContext("2d"),
                video = document.getElementById(op.video),
                videoObj = { "video": true },
                streams = null;
                errBack = function (error) {
                    if(error.name=='PermissionDeniedError'){
                        A.alert('浏览器禁止了网页获取摄像头，请在设置中打开')
                    };
                };
            navigator.getMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia
            navigator.getMedia(videoObj, function (stream) {
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
                streams=stream
            }, errBack);
            //拍照按钮的事件，
            $('#'+op.graph).click(function () {
                context.drawImage(video, 0, 0, op.imgX, op.imgY);
                photograph = imgData();
                if (typeof op.callback === 'function') op.callback(photograph)
            });
            function imgData(){
                return document.getElementById(op.canvas).toDataURL();
            }
            function closeVideo(){
                video.src = '';
                streams.stop();
            }
            return {close:closeVideo}
        }
    };
})(my);