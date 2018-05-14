(function(A, doc, window){
	var dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),
	hasTouch = 'ontouchstart' in window,
	has3d = prefixStyle('perspective') in dummyStyle,
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),
	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),
	translateZ = has3d ? ' translateZ(0)' : '',
	
	imgslider = function(target, option){
		var that = this;
		that.ele = target;
		var op = that.options = {
			looptime: 2500,
			/**
			* 默认显示第几个
			**/
			defaultIndex: 0,
			data:[],
			//method
			onInit: null,
			onRender: null,
			onTap: null,
			onShow: null
		}
		for(i in option) op[i] = option[i];
		this.init();
	}
	imgslider.prototype = {
		init: function(){
			var content = doc.createElement('div'),
				navi = doc.createElement('div'),
				that = this,
				op = that.options,
				data = op.data,
				len = data.length,
				index = 0;
			content.className = 'mui-slider-group mui-slider-loop';
			navi.className = 'mui-slider-indicator';
			if(len>1){
				content.appendChild(op.onRender.call(that, data[len-1]));
			}
			for(;index<len; index++){
				var dom = op.onRender.call(that, data[index]);
				if(len == 1){
					dom.className += ' mui-slider-item-onlyone';
				}
				content.appendChild(dom);
				var d = doc.createElement('div');
				d.className = 'mui-indicator' + (index == 0? ' mui-active': '');
				navi.appendChild(d)
			}
			if(len>1){
				content.appendChild(op.onRender.call(that, data[0]));
			}
			that.ele.appendChild(content);
			that.ele.appendChild(navi);
			that.content = content;
			that.index = 0;
			that.on(START_EV, that.ele);
			if(op.onInit) op.onInit.call(that, data);
			that.startTimer();
			if(op.defaultIndex){
				that.goto(op.defaultIndex, '0s');
			}
		},
		destroy: function(){
			var that = this;
			that.off(START_EV, that.ele);
			that.ele.innerHTML = '';
		},
		startTimer: function(){
			var that = this,
				looptime = that.options.looptime;
			if(looptime){
				that.inTimer = setInterval(function(){
					that.next();
				}, looptime)
			}
		},
		stopTimer: function(){
			var that = this;
			if(that.inTimer) clearInterval(that.inTimer);
		},
		updateImg: function(src){
			var that = this,
				index = that.index,
				children = that.content.children,
				len = that.options.data.length;
			if(len == 1){//只有一张图片
				children[0].children[0].src = src;
				return;
			}
			if(index == 0){
				children[len + 1].children[0].src = src;
			}else if(index == len - 1){
				children[0].children[0].src = src;
			}
			children[index + 1].children[0].src = src;
		},
		next: function(){
			var that = this;
			that.goto(that.index + 1);
		},
		getWidth: function(){
			var that = this;
			if(!that.width) that.width = muislider.clientWidth;
			return that.width;
		},
		goto: function(index, time){
			var that = this,
				content = that.content,
				ele = that.ele;
			time = time|| '0.2s';
			var animate = function(){
				var width = 0-that.getWidth();
				content.style[transitionDuration] = time;
				content.style[transform] = "translate3d(" + index * width + "px,0,0)";
				//content.style[transform] = "translate(" + index * width + "px,0)";
				if(index == that.options.data.length) {
					that.on(TRNEND_EV);
					index = 0;
				}
				else if(index == -1){
					that.on(TRNEND_EV);
					index = that.options.data.length -1; 
				}
				var active = ele.querySelector('.mui-active');
				if(active) active.className = 'mui-indicator';
				//ele.children[1].children[index].className = 'mui-indicator mui-active';
//				if(active) active.classList.remove('mui-active');
//				ele.children[1].children[index].classList.add('mui-active');
				that.index = index;
				if(that.options.onShow) that.options.onShow.call(that, index);
			}
			if(that.frametime) cancelFrame(that.frametime);
			that.frametime = nextFrame(animate);
			
		},
		handleEvent: function(e){
			var that = this;
//			console.log(e.type)
			switch(e.type){
				case TRNEND_EV: that._transitionEnd(e); break;
				case START_EV: that._start(e);break; 
				case MOVE_EV: that._move(e);break;
				case END_EV:
				case CANCEL_EV: that._end(e);break;
			}
		},
		_start: function(e){
			var that = this,
				point = hasTouch ? e.touches[0] : e,
				x, y,
				content = that.content;
			that.stopTimer();
			that.moved = false;
			if(that.frametime) {
				cancelFrame(that.frametime);
				that.frametime = null
			}
			that.startTime = new Date().getTime();
			that.x = point.pageX;
			that.on(MOVE_EV, that.ele);
			that.on(END_EV, that.ele);
			that.on(CANCEL_EV, that.ele);
		},
		_move: function(e){
			e.preventDefault();
			var that = this,
				point = hasTouch ? e.touches[0] : e,
				x = -that.index * that.getWidth() + point.pageX - that.x;
				that.__x=x;
			that.moved = true;
			that._x = point.pageX;
			if(that.frametime) cancelFrame(that.frametime);
			that.frametime = nextFrame(function(){
				var content = that.content;
				content.style[transitionDuration] = '0';
				content.style[transform] = "translate3d(" + x + "px,0,0)";
				//content.style[transform] = "translate(" + x + "px,0)";
			});
		},
		_end: function(e){
			var that = this,
				point = hasTouch ? e.changedTouches[0] : e,
				endTime = new Date().getTime();
			if(!that.moved && (endTime - that.startTime) < 1000){
				var options = that.options;
				if(options.onTap) options.onTap.call(that, options.data[that.index]);
			}
			var width = that.getWidth();
			var x = point.pageX - that.x;
			if(x > 0 && x > width/3){
				console.log('prev:' + (that.index - 1));
				that.goto(that.index - 1, '0.08s');
			}
			else if(x < 0 && -x > width/3){
				console.log('next:' + (that.index + 1));
				that.goto(that.index + 1, '0.08s');
			}
			else {
				that.goto(that.index, '0.05s');
			}
//			console.log('start:' + that.x)
//			console.log('end:' + JSON.stringify(point))
//			console.log('move:' + that._x)
			that.off(MOVE_EV, that.ele);
			that.off(END_EV, that.ele);
			that.off(CANCEL_EV, that.ele);
			that.startTimer();
		},
		_transitionEnd: function(e){
			var that = this,
				content = that.content;
			content.style[transitionDuration] = "0";
			var width = -muislider.clientWidth; 
			content.style[transform] = "translate3d(" + that.index * width + "px,0,0)";
			//content.style[transform] = "translate(" + that.index * width + "px,0)";
			that.off(TRNEND_EV)
		},
		on : function(type, el, bubble) {
			(el || this.content).addEventListener(type, this, !!bubble);
		},
		off : function(type, el, bubble) {
			(el || this.content).removeEventListener(type, this, !!bubble);
		}
	}
	function prefixStyle (style) {
		if ( vendor === '' ) return style;
	
		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	dummyStyle = null;
	A.widget.imgslider = imgslider;
})(my, document, window);