(function( $ ){
	$.fn.autoCenter = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			width		: 105,
			height		: 105,
			showing     : true,
            lock        : true
		}, options);
		var target = this,
			changePosition = function(){
				var top = (window.innerHeight - target.height())/2+$(window).scrollTop(),
	                left = (window.innerWidth-target.width())/2;
	            if(top < 0) top = 0;
	            if (left < 0) left = 0;
	            
	          	target.css({left: left + 'px', top: top + 'px'});
	          	if (options.lock) {
	                my.showMask();
	            }
			}
		// target.show = function(){
		// 	target.css('display', 'block');
		// 	changePosition();
		// }
		// $(window).unbind('resize').bind('resize', function(){
			
		// });
		$(window).resize(function(){
			if(target.css('display') != 'none') changePosition();
		});
		if(options.showing) target.show();
		changePosition();
		// return this.each(function(){
		// 	var s = 0;
		// });
	};
})( jQuery );
