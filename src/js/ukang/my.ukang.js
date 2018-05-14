;(function(A) {
    A.ukang = {
    	ServerPath: '@@ServerPath@@',
		initHeader: function(notLoginFunc){
			var that = this;
			$(window).resize(function(){
				that.resizeHeight();
			});
			that.resizeHeight();
			$('#header-loginitem').off('click').on('click', function(){
				A.login.show(function(user){
					that.onLogin(user);
				});
			});

			$('#header-logout').off('click').on('click', function(){
				var item = $('#header-loginitem');
				A.login.logout();
				item.html('登录/注册');
				item.removeClass('logined');
				item.removeAttr('data-toggle');
				item.parent().removeClass('open');
			});
			A.login.ServerPath = that.ServerPath;
			A.login.getLoginStatus(function(user){
				that.onLogin(user);
			}, notLoginFunc);
			$('#header-resetpassword').off('click').on('click', function(){
				A.login.resetPassword();
			})
			if(A.ua.ieAX<9&&A.ua.ieVer<9||A.ua.ieMode<9){
				location.href = "supported_browsers.html"
			}
		},
		getStatusTxt: function(status){
			//可以参照公共配置-》文档——》开发文档-》理赔单状态文档
			var messages = {
				'0': '处理中',
				'399':'待确认',
				'1000': '待确认',//'专家审核中',
				'1001': '单据缺失',
				'1002': '理赔人信息不全',
				'1999': '理赔中',
				'2000': '理赔中',
				'3000': '理赔完成'
			};
			var message = messages[status];
			if(message) return message;
			if(status < 399) return '机器识别不通过';
			if(status < 1999) return '专家审核不通过';
			//if(status < 2000) return 
			return '未知状态:' + status;
		}
    };
})(my);