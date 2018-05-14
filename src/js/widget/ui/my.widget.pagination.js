(function(A) {
	A.widget.pagination = function(options){
		var op = {
			container: null,
			containerClass: 'm-pagination',
			paginationClass: '',
			/*
			* 显示的分页数量
			*/
			size: 5,
			pageSize:10,
			pageNumber:1,
			/*
			* 总页数
			*/
			total: null,

			onPageChange: null
		}
		var _op = A.extend(op, options);
		var t = new _pagination(_op);
		return t;
	}
	function _pagination(options){
		var that = this;
		that.options = options;
		that._init();
	}
	A.extend(_pagination.prototype, A.widget, {
		_init: function(){
			var that = this,
				options = that.options,
				container = $(options.container),
				ul = container.find('ul.pagination');
			if(ul.length == 0){
				container.html('<nav class="' + options.containerClass + '"><ul class="pagination ' + options.paginationClass + '"></ul></nav>');
				ul = container.find('ul.pagination');
			}
			that.currentIndex = options.pageNumber;//当前页面
			that.last =Math.ceil( options.total/options.pageSize);//最后一页
			that.ul = ul;
			that.render();
			ul.off('click').on('click', function(e){
				that.onClick($(e.target));
				return false;
			});
		},
		onClick: function(target){
			var that = this,
				page = target.data('page');
			if(typeof page != 'number' || 
				that.currentIndex == page ||
				page < 1 || page > that.last) return;
			var oldPage = that.currentIndex;
			that.currentIndex = that.options.pageNumber = page;
			that.render();
			if(that.options.onPageChange)
				that.options.onPageChange.call(that, oldPage, page);
		},
		render: function(){
			var that = this,
				options = that.options,
				currentIndex = that.currentIndex,
				size = options.size,
				times = parseInt(currentIndex/size, 10),
				remain = currentIndex % size,
				startIndex = times * size + 1,
				total = that.last,
				lastIndex = (times + 1) * size,
				index = startIndex,
				html = [],
				_start = that._start,
				_end = that._end;
			if(remain == 0){
				startIndex = currentIndex;
				lastIndex = startIndex + size -1;
			}
			if(lastIndex > total) {
				startIndex = total - 4;
				lastIndex = total;
				if(startIndex < 1) startIndex = 1;
			}
			if(total > size){
				html.push(that.getHTML('first'));
				html.push(that.getHTML('pre'));
			}
			that._start = startIndex;
			that._end = lastIndex;
			for(; startIndex <= lastIndex; startIndex++){
				html.push(that.getHTML('page', startIndex));
			}
			if(total > size){
				html.push(that.getHTML('next'));
				html.push(that.getHTML('last'));
			}
			if(total <= 1) html = [];
			that.ul.html(html.join(''));
		},
		getHTML: function(type, pageIndex){
			var that = this,
				currentIndex = that.currentIndex,
				pagedata = null;
			switch(type){
				case 'first':
					pagedata = 'data-page="1"';
					return '<li class="' + (currentIndex == 1? 'disabled':'') + '" ' + pagedata + '><a ' + pagedata + ' href="#">«</a></li>';
				case 'pre':
					pagedata = 'data-page="' + (currentIndex - 1) + '"';
					return '<li class="' + (currentIndex == 1? 'disabled':'') + '"  ' + pagedata + '"><a ' + pagedata + ' href="#">‹</a></li>';
				case 'next':
					pagedata = 'data-page="' + (currentIndex + 1) + '"';
					return '<li class="' + (currentIndex == that.last? 'disabled':'') + '" ' + pagedata + '"><a ' + pagedata + ' href="#">›</a></li>';
				case 'last': 
					pagedata = 'data-page="' + that.last + '"';
					return '<li class="' + (currentIndex == that.last? 'disabled':'') + '" ' + pagedata + '"><a ' + pagedata + ' href="#">»</a></li>';
				case 'page':
					pagedata = 'data-page="' + pageIndex + '"';
					return '<li class="' + (currentIndex == pageIndex? 'active':'') + '" ' + pagedata + '"><a ' + pagedata + ' href="#">' + pageIndex + '<span class="sr-only"></span></a></li>';

			}
		},
		refresh:function(options){
			var that = this,
				options = A.extend(that.options,options);
			that.last =Math.ceil( options.total/options.pageSize);//最后一页
			that.currentIndex=options.pageNumber;
			that.render();
		}
	});
	$.fn.hasAttr = function(name,val){
	    if(val){
	        return $(this).attr(name) === val;
	    }
	    return $(this).attr(name) !== undefined;
	};
})(my);