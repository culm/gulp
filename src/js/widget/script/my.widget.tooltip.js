(function(A) {
	A.widget.tooltip = {
		timer: null,
		container: 'itooltip-container',
		template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
		/**
		* title:
		* message: 
		* containerClass: 'fade'
		* placement: 'right',
		* container: 'body'
		* target: body
		* animation: true
		* autoBlur: true
		* delay: 100,
		* autoClose:number|1000
		*/
		show: function(options) {
			var that = this,
				container = that.container,
				containerdiv = $('#' + container);
			if (containerdiv.length == 0) {
				containerdiv = $(that.template).appendTo(options.container || document.body);
				containerdiv.attr('id', container);
			}
			var title = containerdiv.find('.popover-title');
			if(options.title){//标题
				title.html(options.title).show();
			}else{
				title.hide();
			}
			//内容
			var content = containerdiv.find('.popover-content').html(options.message);
			var placement = options.placement || 'left',
				className = 'popover ' + placement;
			if(options.animation !== false){
				className += ' fade in';
			}
			containerdiv[0].className = className;
			if(that.timer) {
				clearTimeout(that.timer);
				that.timer = null;
			}
			if(options.toImg){
				// try{
				// 	var width = content.find('img').width()+28;
				// 	containerdiv.width(width)
				// }catch(e){
				// 	console.log(e)
				// }
			}
			var target = options.target;
			if(typeof target === 'string') target = $(target);
			containerdiv.show();
			target.addClass('')
			var offset = target.offset(),
				oTop = offset.top,
				oLeft = offset.left,
				width = target.outerWidth(),
				height = target.outerHeight(),
				_top = 0,
				_left = 0,
				cWidth = containerdiv.outerWidth(),
				cHeight = containerdiv.outerHeight();
				wWidth = window.innerWidth;
				wheight = window.innerHeight;
			switch(placement){
				case 'right': 
					_top = oTop - cHeight/2 + height/2;
					_left = oLeft + width;
					break;
				case 'left':
					_top = oTop - cHeight/2 + height/2;
					_left = oLeft - cWidth;
					break;
				case 'top':
					_top = oTop - cHeight;
					_left = oLeft + width/2 - cWidth/2;
					break;
				case 'bottom':
					_top = oTop + height;
					_left = oLeft + width/2 - cWidth/2;
					break;
			}
			$('.popover.top>.arrow').css('left','50%');
			if(_left+cWidth>wWidth){
				$('.popover.top>.arrow').css('left',(cWidth/2)+((oLeft-_left)/2))
				_left = wWidth-cWidth;
			}
			if(_left<0){
				$('.popover.top>.arrow').css('left',(cWidth/2)+((oLeft-_left)/2))
				_left = 0
			}
			containerdiv.css({'top': _top + 'px', 'left': _left + 'px'});
			if(options.autoBlur === true){
				target.off('blur').on('blur', function(){
					that.hide(200);
				});
			}

			var autoClose = options.autoClose
			if(typeof autoClose === 'number'){
				that.hide(autoClose);
			}
		},
		hide: function(time) {
			var that = this;
			if(time){
				that.timer = setTimeout(function(){
					that._hide();
				}, time)
			}else{
				that._hide();
			}
		},
		_hide: function(){
			$('#' + this.container).fadeOut(500);
		}
	}
})(my);