(function(A) {
	A.widget.tab = function(options){
		var op = {
			container: null,
			containerClass: '',
			tabClass: 'alijk-tab',

			canRemove: true,
			//event
			onPanelAdd: null,
			onInit: null,
			onSelect: null,
			onBeforeClose: null,
			onClose: null
		}
		var _op = A.extend(op, options);
		var t = new _tab(_op);
		return t;
	}
	function _tab(options){
		var that = this;
		that.options = options;
		that._init();
	}
	A.extend(_tab.prototype, A.widget, {
		activeTab: null,
		activePanel: null,
		activeUniqueId: null,
		count: 0,
		activeIndex: -1,
		uniqueIds: [],
		data: {},
		_init: function(){
			var that = this,
				op = that.options
				container = $(op.container),
				nav = $('<ul class="nav nav-tabs" role="tablist"></ul>'),
				content = $('<div class="tab-content"></div>');
			container.addClass(op.containerClass + ' ' + op.tabClass);
			container.append(nav);
			container.append(content);
			that.nav = nav;
			that.content = content;
			that.container = container;
			if(op.onInit) op.onInit.call(that);
		},
		add: function(d){
			if(!d) return;
			var that = this,
				html = [],
				op = that.options,
				data = that.data,
				uniqueId = 'tab-' + new Date().getTime(),
				li = $('<li role="presentation"></li>'),
				title = d.title || '';
				if(op.onTitleRender) title = op.onTitleRender.call(that, d);
				tab = $('<a href="#' + uniqueId + '" >' + title + '</a>');
				panel = $('<div class="tab-pane" id="' + uniqueId + '"></div>');
			if(op.canRemove){
				tab.append('<span uniqueId="' + uniqueId + '" class="glyphicon glyphicon-remove"></span>');
			}
			that.uniqueIds.push(uniqueId);
			that.data[uniqueId] = d;
			that.activeTab = tab;
			that.activePanel = panel;
			li.append(tab);
			that.nav.append(li);
			that.content.append(panel);
			that.container.find('.active').removeClass('active');
			li.addClass('active');
			panel.addClass('active');
			if(op.onPanelAdd) op.onPanelAdd.call(that, d, tab, panel, uniqueId);
			that.container.find('.nav a').off('click').on('click', function(e){
				e.preventDefault();
				var href = this.getAttribute('href').substr(1);
				if($(e.target).hasClass('glyphicon-remove')){
					that.remove(href);
					return;
				}
				that.select(href);
			});
			that.count++;
			that.activeUniqueId = uniqueId;
			if(op.onSelect) op.onSelect.call(that, d);
		},
		/**
		* uniqueId: 唯一标示符
		* forceRemove：true：强制移除
		*/
		remove: function(uniqueId, forceRemove){
			var that = this,
				data = that.data,
				removeData = data[uniqueId],
				count = that.count,
				op = that.options,
				activeUniqueId = that.activeUniqueId;

			if(!forceRemove && op.onBeforeClose && op.onBeforeClose.call(that, removeData, count, uniqueId) === false) return;
			if(!removeData) return;
			that.count = count - 1;
			delete data[uniqueId];
			var activePanel = that.activePanel,
				toShowUniqueId = activePanel.prev().prop('id');
			if(!toShowUniqueId) activePanel.next().prop('id')
			//移除元素
			container.find('a[href="#' + uniqueId + '"]').parent().remove();
			$('#' + uniqueId).remove();
			if(op.onClose) op.onClose.call(that, removeData);
			if(activeUniqueId != uniqueId) {
				return;
			}
			
			if(count == 1) return;
			that.activeTab = null;
			that.activePanel = null;
			that.select(toShowUniqueId);
		},
		select: function(uniqueId){
			var that = this,
				index = 0,
				data = null,
				container = that.container,
				tab = container.find('a[href="#' + uniqueId + '"]'),
				panel = $('#' + uniqueId),
				op = that.options;
			container.find('.active').removeClass('active');
			tab.parent().addClass('active');
			panel.addClass('active');
			that.activeTab = tab;
			that.activePanel = panel;
			if(op.onSelect) op.onSelect.call(that, that.data[uniqueId]);
		},
		getActiveData: function(){
			var that = this;
			return that.data[that.activeUniqueId];
		}
	});
})(alijk);