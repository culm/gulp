(function(A) {
	var W = A.widget,
		H = $,

		/// <summary>
		/// 构造函数
		/// </summary>
		/// <param name="selector">输入控件jQuery选择器</param>
		/// <param name="options">控件参数</param>
		iflytek = A.widget.iflytek = function(selector, options) {
			/// <summary>
			/// 配置选项
			/// </summary>
			var that = this;
			that.Options = {
				position: 'right', //bottom,left,right,top,center,
				container: 'self', //body,self(self目前只支持positon=left||right)
				width: 100,
				height: 100,
				onShow: function(value, target) {},
				onStart: function(value, target) {},
				onFinish: function(value, target) {}
			};
			that.id = null;
			that.container = null;
			that.iflytekMessage = null;
			that.iflytekState = null;
			that.target = null;
			//如果不支持websocket，直接返回
			if(!window.WebSocket) return;
			//设置默认值
			A.extend(that.Options, options);
			new A.widget.preload({
				cached: false,
				js: ['http://webapi.openspeech.cn/socket.io/socket.io.js',
				'http://webapi.openspeech.cn/js/connection/connection.js',
				'http://webapi.openspeech.cn/js/audio/recorder.js',
				'http://webapi.openspeech.cn/js/common/resampler.js',
				'http://webapi.openspeech.cn/js/common/fingerprint.js',
				'http://webapi.openspeech.cn/js/util/brow.js',
				'http://webapi.openspeech.cn/js/log/log.js'],
				afterLoad: function(){
					//iat.js依赖fingerprint.js,目前preload.js还存在问题，先这个解决语音加载的问题
					new A.widget.preload({
						cached: false,
						js: [
						'http://webapi.openspeech.cn/js/session/iat.js',
						'http://webapi.openspeech.cn/js/session/session.js',
						'http://webapi.openspeech.cn/js/session/sessioninfo.js'],
						afterLoad: function(){
							that.init(selector);
						}
					});
				}
			});
		};
	iflytek.Index = 0;

	//继承A.Widget
	A.extend(iflytek.prototype, W, {
		containerClass: "iflytekContainer",
		ie6: window.ActiveXObject && !window.XMLHttpRequest,
		/**
		 * 初始化Session会话
		 * url                 连接的服务器地址（可选）
		 * interval            会话超时时间（可选）
		 * disconnect_hint     连接断开提示（可选）
		 * sub                 会话业务字段（tts : 合成业务, iat : 听写业务）
		 */
		initSession: function() {
			if (!iflytek.session) {
				var basePath = A.GetWebRootPath();
				iflytek.session = new Session({
					'url': 'http://webapi.openspeech.cn/ivp',
					'interval': '30000',
					'disconnect_hint': 'disconnect',
					'sub': 'iat',
					'compress': 'speex',
					'sub': 'iat',
					'speex_path': basePath + '/static/js/iflytekhvoice/common/speex.js', //speex.js本地路径 
					'vad_path': basePath + '/static/js/iflytekhvoice/common/vad.js', //vad.js本地路径
					'recorder_path': basePath + '/static/js/iflytekhvoice/audio/recorderWorker.js' //recordWorker.js本地路径
				});
			}
		},
		Listenning : false,
		/// <summary>
		/// 初始化
		/// </summary>
		/// <param name="selector">输入控件jQuery选择器</param>
		init: function(selector) {
			this.initSession();
			this.id = 'iflytek_' + iflytek.Index++;
			this.target = selector;
			var options=this.Options;
			if (this.target.hasClass(this.id))
				return;
			
			H(this.target).wrap('<div class="iflytek-warp"></div>');
			this.warp = H(this.target).parent();
			this.containerObj = H('<div class="iflytek ' + options.container + ' ' + this.containerClass + '"  style="display:none;"></div>').appendTo('body');
			this.iflytekMessage = H('<div id="' + this.id + '_message" class="iflytek-message">请说话</div>').appendTo(this.containerObj);
			this.iflytekState = H('<div id="' + this.id + '_state" class="' + this.id + ' iflytek-state"></div>').appendTo(this.containerObj);

			var self = this,
				target = this.target,
				id = this.id,
				warp=this.warp,
				containerObj=this.containerObj,
				iflytekState = this.iflytekState;
				if (!target.hasClass('iflytek')) {
					target.addClass('iflytek');
				}
			if (!target.hasClass(id)) { //输入框处理
				target.addClass(id)
					.Bind('focus.iflytek', this.onIflytekShow, target, {that:this}) //控件获取焦点事件
					//.Bind('blur.iflytek', this.hideIflytek, target, {that:this}); //控件失去焦点事件
				iflytekState
					.Bind('click.iflytek', this.iflytekListener, this, null);
			}

			//self模式的样式初始化
			if (options.container == 'self') {
				containerObj.insertAfter(target).css({
					position: 'absolute',
					top: 0,
					left: (options.position == 'left' ? 0 : ''),
					right: (options.position == 'right' ? 0 : '')
				});
				warp.css({
					'padding-left': options.position == 'left' ? containerObj._outerWidth() : 0,
					'padding-right': options.position == 'right' ? containerObj._outerWidth() : 0
				});
			}
			target = null;
		},
		onIflytekShow:function(event){
			var that = event.data.that,
				opts = that.Options;
			that.showIflytek(event);
			if (opts.container == 'self') {
				var warp = H(that.target).parent();
				warp.addClass('iflytek-focused');
			}
		},
		/// <summary>
		/// 展现当前的语音输入容器
		/// </summary>
		showIflytek: function(event) {
			var that=event.data.that;
			that.setSize(that.containerObj);
			that.setFixed(that.containerObj);
			that.containerObj.fadeIn();
			H(window).unbind('.iflytek').bind('mousedown.iflytek',{currentTarget:event.target,that:that}, function(e) {
				var target=H(e.target);
				if (target.hasClass('iflytek')) {
					var _that = e.data.that,
						prevTarget = H(e.data.currentTarget);
					if (prevTarget.attr('id') != target.attr('id')) {
						_that.onIflytekHide();
					}
					return;
				}
				var container=target.parent();
				if(container){
					if(!container.hasClass('iflytek')){
						that.onIflytekHide();
					}
				}
			});
			that.listeningState('', '点击后说话');
			that.Options.onShow(that);
		},
		onIflytekHide:function(){
			var that=this;
			if (that.Options.container == 'self') {
				var warp = H(that.target).parent();
				warp.removeClass('iflytek-focused');
				that.warp.css({
					'padding-left': 0,
					'padding-right': 0
				});
			}
			that.hideIflytek();
		},
		/// <summary>
		/// 隐藏当前的语音输入容器
		/// </summary>
		hideIflytek: function() {
			var that=this;
			that.stop();
			that.containerObj.fadeOut();
			that.Options.onFinish(that);
		},
		/// <summary>
		/// 语音输入事件监听
		/// </summary>
		iflytekListener: function() {
			var that = this;
			if (that.Listenning) {
				that.stop();
			} else {
				that.start();
				that.Options.onStart();
			}
		},
		/// <summary>
		/// 设置静止定位
		/// <summary>
		setFixed: function($el) {
			var that = this,
				el = $el[0],
				$window = H(window),
				style = el.style,
				style = el.style,
				opts = that.Options;
			if(opts.container=='body'){
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
			}else{
				$el.css('position', 'absolute');
			}
		},
		/// <summary>
		/// 设置位置
		/// <summary>
		setSize: function($el) {
			var that = this,
				el = $el[0],
				$window = H(window),
				style = el.style,
				width = $el.outerWidth(),
				height = $el.outerHeight(),
				winWidth = $window.width(),
				winHeight = $window.height(),
				left = '',
				top = '',
				right = '',
				bottom = '';
			var opts = that.Options;
			var containerObj = that.containerObj;

			if (opts.container == "body") {
				switch (opts.position) {
					case "left":
						left = "10px";
						top = ((winHeight - height) / 2) + "px";
						$el.css({
							'left': left,
							'top': top
						});
						break;
					case "right":
						right = "0px";
						top = ((winHeight - height) / 2) + "px";
						$el.css({
							'right': right,
							'top': top
						});
						break;
					case "top":
						left = ((winWidth - width) / 2) + "px";
						top = "0px";
						$el.css({
							'left': left,
							'top': top
						});
						break;
					case "bottom":
						left = ((winWidth - width) / 2) + "px";
						bottom = "0px";
						$el.css({
							'left': left,
							'bottom': bottom
						});
						break;
					case "center":
						left = ((winWidth - width) / 2) + "px";
						top = ((winHeight - height) / 2) + "px";
						$el.css({
							'left': left,
							'top': top
						});
						break;
					default:
						left = ((winWidth - width) / 2) + "px";
						top = ((winHeight - height) / 2) + "px";
						$el.css({
							'left': left,
							'top': top
						});
						break;
				}
			} else {
				//container=='self'
				that.warp.css({
					'padding-left': opts.position == 'left' ? that.containerObj._outerWidth() : 0,
					'padding-right': opts.position == 'right' ? that.containerObj._outerWidth() : 0
				});
			}
		},

		getSignature: function(srcPara) {
			var that = this;
			var srcParaJason = {
				"sPara": srcPara
			};

			var url = A.GetWebRootPath() + "/security/getSignature";
			var retData = callController(url, srcParaJason);
			return retData;
		},

		/// <summary>
		/// 麦克风开始
		/// <summary>
		start: function() {
			var that = this;
			if (!that.Listenning) {
				var appid = "54dabc3f";
				var time_stamp = new Date().toLocaleTimeString();
				var expires = 36000;

				var srcPara = appid + "&" + time_stamp + "&" + expires + "&";
				console.log("srcPara:" + srcPara);
				var retData = that.getSignature(srcPara);

				var params = "aue=speex-wb;-1,usr=mkchen,ssm=1,sub=iat,net_type=wifi,ent=sms16k,rst=plain,auf=audio/L16;rate=16000,vad_enable=1,vad_timeout=5000,vad_speech_tail=500,caller.appid=54dabc3f,timestamp=" + time_stamp + ",expires=36000";
				var ssb_param = {
					"grammar_list": null,
					"params": params,
					"signature": retData.m
				};
				/* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
				iflytek.session.start('iat', ssb_param, function(volume) {
					console.log('start ok');
					if (volume < 6 && volume > 0) {
						//TODO,麦克风的音量展示
					}

					/* 若volume返回负值，说明麦克风启动失败*/
					if (volume < 0) {
						that.Listenning = false;
						//that.session.stop(null);
						//TODO, 这里可以把暂停图片展示为录音图片
						//恢复初始状态
						that.listeningState('', '麦克风启动失败');
					}
				}, function(err, result) {
					console.log('start err');
					/* 若回调的err为空或错误码为0，则会话成功，可提取识别结果进行显示*/
					if (err == null || err == undefined || err == 0) {
						if (result == '' || result == null) {
							//没有返回结果，则不改变原来的文字
							//var orgVal = that.target.val();
							//that.target.val("");
							//that.listeningState('', '输入完成');
						} else {
							if (that.target) {
								var val = that.target.val();
								val = val + result;
								that.target.val(val);
							}
						}
						that.listeningState('', '输入完成');
						/* 若回调的err不为空且错误码不为0，则会话失败，可提取错误码 */
					} else {
						var errorStr = 'error code : ' + err + ", error description : " + result;
						console.log(errorStr);
						that.listeningState('', '无法识别');
					}

					that.Listenning = false;
					//that.session.stop(null);
					//TODO, 这里可以把暂停图片展示为录音图片
					//that.listeningState('', '无法识别');
				});
				that.Listenning = true;
				//TODO, 这里可以把录音图片展示为暂停图片
				that.listeningState('listening', '请说话...');
			}
		},
		stop: function() {
			var that = this;
			//停止麦克风录音，仍会返回已传录音的识别结果.
			if (that.Listenning) {
				try {
					iflytek.session.stop(null);
					console.log('stop');
				} finally {
					that.Listenning = false;
					//TODO,这里可以把暂停图片展示为录音图片
					that.listeningState('', '已停止');
				}
			}
		},
		listeningState: function(state, msg) {
			var removeCls = state == 'stopped' ? 'iflytek-state-listening' :
				(state == 'listening' ? 'iflytek-state-stopped' : 'iflytek-state-listening iflytek-state-stopped');
			this.iflytekState.removeClass(removeCls);
			if (state.length > 0)
				this.iflytekState.addClass('iflytek-state-' + state);
			if (msg) {
				this.iflytekMessage.text(msg);
			}
		}
	});
	H.fn.extend({
		iflytek: function(options) {
			H(this).each(function() {
				new iflytek(H(this),options);
			});
		}
	});
	// H(function() {
	// 	 H(".iflytek").iflytek();
	// });
})(alijk);