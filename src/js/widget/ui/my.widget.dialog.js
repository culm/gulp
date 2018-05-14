(function(A) {
	A.widget.dialog = {
		containerClass: 'iconfirmcontainer',
		/**
		*	options.title: 标题
		*	options.message: 消息
		*   options.modalType
		*   options.autoClose: true,点击buttong后，自动关闭, false:不关闭
		*   options.events:{'hidden.bs.modal': function(e){}, ...}bootstrap定义的事件类型
		**/
		container:null,
		show: function(options){
			var that = this,
				container = that.container = $('.modal.' + that.containerClass);
			if(container.length == 0){
				container = that.container = $('\
					<div class="modal '+ that.containerClass + ' ' + options.modalType + '">\
					  <div class="modal-dialog ' + options.modalDialog + '">\
					    <div class="modal-content">\
					      <div class="modal-header">\
					        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
					        <h4 class="modal-title">Modal title</h4>\
					      </div>\
					      <div class="modal-body"></div>\
					      <div class="modal-footer"></div>\
					    </div>\
					  </div>\
					</div>');
				container.appendTo(document.body);
			}
			var modeltitle = container.find('.modal-title'),
				modelbody = container.find('.modal-body'),
				modelfooter = container.find('.modal-footer'),
				modelheader = container.find('.modal-header'),
				buttonHtml = [];
			if(!options.title) modelheader.hide();
			else modelheader.show();
			modeltitle.html(options.title || '');
			modelbody.html(options.message || '');
			A.each(options.buttons ||[], function(index, d){
				buttonHtml.push('<button data-value="' + d.value + '" type="button" class="' + d.class + '" data-dismiss="' + d.dismiss + '">' + d.text + '</button>');
			});
			if(buttonHtml.length == 0){
				modelfooter.hide();
			}else{
				modelfooter.html(buttonHtml.join(''));
				modelfooter.show();
			}
			modelfooter.find('button').off('click').on('click', function(e){
				var value = $(e.target).data('value');
				if(options.autoClose) container.modal('hide');
				if(options.onClick) options.onClick(value, e);
			});
			if(!options.events){
				options.events = {};
			}
			var events = options.events;
			if(options.autoCenter !== false && !events['shown.bs.modal']){
				events['shown.bs.modal'] = function(){
					var target = $('.iconfirmcontainer>.modal-dialog');
		            // var top = (window.innerHeight - target.height())/2+$(window).scrollTop();
		            // if(top>30) top = top/3*2;
		            // if(top < 0) top = 0;
		            var top = (window.innerHeight - target.height())/2;
		            
		            target.css({'margin-top': top + 'px'});
				}
			}
			A.each(events, function(eventType, event){
				container.off(eventType).on(eventType, event);
			});
			container.modal('show');
		},
		// center: function(){
		// 	var target = $('.iconfirmcontainer>.modal-dialog');
  //           var top = (window.innerHeight - target.height())/2+$(window).scrollTop();
  //           if(top>30) top = top/3*2;
  //           if(top < 0) top = 0;
            
  //           target.css({'margin-top': top + 'px'});
		// },
		hide:function(){
			var that=this;
			if(!that.container){
				that.container=$('.modal.' + that.containerClass);
			}
			that.container.modal('hide');
		}
	}
})(my);