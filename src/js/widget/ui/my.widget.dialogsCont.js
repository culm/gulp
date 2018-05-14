(function(A) {
	A.widget.iDialog = function (opts) {
        this.init(opts);
        return this;
    }
    A.widget.iDialog.iDialog_INDEX = 0;
    A.extend(A.widget.iDialog.prototype, {
        dialog: null,
        options: null,
        dialogCloseButton: null,
        dialogContentContainer: null,
        dialogToolbar: null,
        dialogIndex:9999,
        ie6: window.ActiveXObject && !window.XMLHttpRequest,
        init: function (options) {
            var that = this;
            that.options = $.extend({
                id: A.widget.iDialog.iDialog_INDEX++,
                title: '请输入标题',
                lock: true,
                fixed:false,
                content: '<div style="width:300px;height:200px;">dialog-content</div>',
                theme:'default',
                onBeforeClose: function (target) {

                },
                onClosed: function (target) {

                },
                onSure:function (target){
                	alert(target);
                },
                onClose: function (e) {
                    var that = this;
                    if (that.options.lock) {
                        A.hideMask();
                    }
                    that.dialog.hide();
                },
                onDialogOpen:function(){
                    var that=this;

                },
                showToolbar:true,
                showCloseButton:true,
                toolbarCls: '',
                buttons: [{
                    text: '取消',
                    class: 'iDialog-button-cancel',
                    handler: function (e) {
                        return 'close';
                    }
                }, {
                    text: '确定',
                    cls: 'iDialog-button-ok',
                    handler: function (e) { return 'sure'; }
                }]
            }, options);
            that.dialog = $('\
							<div class="'+(that.options.theme=='default'?'iDialog':'iDialog-theme-'+that.options.theme)+'" id="' + that.options.id + '">\
								<div class="iDialog-container">\
									<div class = "iDialog-header">\
										<h3 class="iDialog-header-title">' + that.options.title + '</h3> \
										<span class="iconfont iDialog-header-close" style="display:'+(that.options.showCloseButton?'block':'none')+'">&#xe600;</span>\
									</div>\
									<div class="iDialog-content"></div>\
									<div style="'+(that.options.showToolbar?'':'display:none;')+'" class="iDialog-toolbar' + (that.options.toolbarCls ? (' ' + that.options.toolbarCls) : '') + '"></div>\
							 	</div>\
							 </div>').appendTo(document.body);

            that.dialogCloseButton = that.dialog.find('.iDialog-header-close').bind('click.iDialog', function () {
                that.close();
            });
            that.dialogContentContainer = that.dialog.find('.iDialog-content').html(that.options.content);
            that.dialogToolbar = that.dialog.find('.iDialog-toolbar');
            var buttons = that.options.buttons || [];

            if (buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    var btn = buttons[i];
                    var $btn = $('<input type="button" class = "iDialog-toolbar-button ' + (btn.cls ? btn.cls : '') + '" value = "' + (btn.text || '按钮') + '" / >');
                    that.dialogToolbar.append($btn);
                    $btn.bind('click.iDialog', (function (btn) {
                        return function (e) {
                            var handlerState = btn.handler.call(that, e);
                            if (handlerState=='close') {
                                that.close();
                            }
                            else if(handlerState=='sure') //执行保存接口
                            {
                            	if(that.options.issure)
					        	{
					        		that.options.onSure(e);
        						}
                                else
                                {
                                    that.close();
                                }
                            }
                        }
                    })(btn))
                }
            }
        },
        show: function () {
            var that = this,$dialog=that.dialog,options=that.options;
            that._addResizeEvent();
            that._setSize($dialog);
            if (options.fixed) {
                that._setFixed($dialog);
            }
            that.dialogIndex++;
            $dialog.css('z-index', that.dialogIndex).show();
            if (options.lock) {
                that.lock();
            }
            if (options && options.onDialogOpen) {
                options.onDialogOpen.apply(that);
            }
        },
        close: function () {
            var that = this,
				opts = that.options;
            if (opts.onBeforeClose) {
                opts.onBeforeClose();
            }
            if (opts.lock) {
                $("#lockmask").hide();
            }
            that.dialog.hide();
            if (opts.onClosed) {
                opts.onClosed();
            }
        },
        hide: function () {
            this.close();
        },
        lock: function() {
            var that = this,
                $window = $(window),
                frm,
                index = that.dialogIndex - 1,
                mask = $('#lockmask', document)[0],
                style = mask ? mask.style : '',
                positionType = that.ie6 ? 'absolute' : 'fixed';

            if (!mask) {
                frm = '<iframe src="javascript:\'\'" style="width:100%;height:100%;position:absolute;' +
                    'top:0;left:0;z-index:-1;filter:alpha(opacity=60)"></iframe>';

                mask = document.createElement('div');
                mask.id = 'lockmask';
                mask.style.cssText = 'position:' + positionType + ';left:0;top:0;width:100%;height:100%;margin:0px;overflow:hidden;background:#000;filter:alpha(opacity=60);opacity:.6;';

                style = mask.style;
                if (that.ie6) mask.innerHTML = frm;

                document.body.appendChild(mask);
            }
            if (positionType === 'absolute') {
                style.width = $window.width();
                style.height = $window.height();
                style.top = $window.scrollTop();
                style.left = $window.scrollLeft();
                that._setFixed($(mask));
            }
            style.zIndex = index;
            style.display = '';
        },
        _setSize:function($el){
            var that = this,
                el = $el[0],top,left,
                $window = $(window),
                style = el.style,
                width = $el.outerWidth(),
                height = $el.outerHeight(),
                winWidth = $window.width(),
                winHeight = $window.height(),
                scrollTop = $window.scrollTop(),
                scrollLeft = $window.scrollLeft(),
                subWidth = winWidth - width,
                subHeight = winHeight - height;

            if (that.options.fixed) {
                left = ((subWidth > 0 ? subWidth : 0) / 2) + "px";
                top = ((subHeight > 0 ? subHeight : 0) / 2) + "px";
            } else {
                left = ((subWidth > 0 ? subWidth : 0) / 2 + scrollLeft) + "px";
                top = ((subHeight > 0 ? subHeight : 0) / 2 + scrollTop) + "px";
            }
           
            $el.css({
                'left': left,
                'top': top
            });
        },
        /*! 设置静止定位 */
        _setFixed: function($el) {
            var that = this,
                el = $el[0],
                $window = $(window),
                style = el.style,
                style = el.style;
            if (that.ie6) {
                var sLeft = $window.scrollLeft(),
                    sTop = $window.scrollTop(),
                    left = parseInt(style.left) - sLeft,
                    top = parseInt(style.top) - sTop,
                    txt = document.compatMode == 'BackCompat' ? 'this.ownerDocument.body' :
                    'this.ownerDocument.documentElement';
                style.removeExpression('left');
                style.removeExpression('top');
                style.position = 'absolute';
                style.setExpression('left', txt + '.scrollLeft +' + left);
                style.setExpression('top', txt + '.scrollTop +' + top);
            } else {
                $el.css('position', 'fixed');
            }
        }, 
        _addResizeEvent: function() {
            var resizeTimer,
                that = this;
                $(window).unbind('resize.idialog');
                // 窗口调节事件
                that._winResize = function() {
                    resizeTimer && clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function() {
                        that._setSize(that.dialog);
                    }, 100);
                };
            $(window).bind('resize.idialog', that._winResize);
        }
    })
})(my);