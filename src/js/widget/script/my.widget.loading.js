(function(A) {
	A.widget.loading = {
		container: 'iloading-container',
		show: function(options) {
			var that = this,
				container = that.container,
				classContainer = options.container || container,
				containerdiv = $('#' + container);
			if (containerdiv.length == 0) {
				containerdiv = $('\
					<div id="' + container + '" class="' + classContainer + '">\
						<div class="iloading-wrap">\
							<div class="iloading-icon"></div>\
							<div class="iloading-content"></div>\
						</div>\
					</div>').appendTo(document.body);
				options.iconCls = options.iconCls || 'iloading-icon-loading';
				if (options.iconCls) {
					containerdiv.find('.iloading-icon').addClass(options.iconCls);
				}
			}
			containerdiv.find('.iloading-content').html(options.message);
			if(options.autoCenter !== false){
				containerdiv.autoCenter();
			}else{
				containerdiv.show();
			}
		},
		hide: function() {
			A.hideMask();
			$('#' + this.container).hide().remove();
		}
	}
})(my);