;(function(A) {
	A.getApp().factory('orderService', ['$q', function($q) {
		var serverPath = A.getServer(true)
		var service = {
			/**
			 * [wechatOAuth/getPaymentListForWechat 获取理赔单列表]
			 * @param  {object} params [{pageNum:页数}]
			 */
			getList: function(params) {
				var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'wechatOAuth/getPaymentListForWechat',
	                type: 'POST',
	                data: {params: A.toJSON(params)},
	                success:function(res) {
		                if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
		            },
		            error:function(res) {
		            	d.reject({rtnCode: '-2000', rtnMsg: '网络错误'});
		            }
	            })
	            return d.promise;
	        },
	        /**
	         * [getPaymentDetail 获取理赔单收据和处方]
	         * @param  {object} params [{
                    personId: 理赔人id,
                    paymentId: 批次id,
                    openId: 当前微信号在当前公众号下的唯一id
                }]
	         */
	        getDetail : function(params) {
	        	var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'getPaymentDetail',
	                type: 'GET',
	                data: params,
	                success:function(res) {
		                if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
		            },
		            error:function(res) {
		            	d.reject({rtnCode: '-2000', rtnMsg: '网络错误'});
		            }
	            })
	            return d.promise;
	        },
	        /**
	         * [getPaymentSummary 获取理赔单Summary]
	         * @param  {object} params [{
                    personId: 理赔人id,
                    paymentId: 批次id,
                    openId: 当前微信号在当前公众号下的唯一id
                }]
	         */
	        getSummary: function(params){
	        	var d = $q.defer();
	        	A.ajax({
	                url: serverPath + 'getPaymentSummary',
	                type: 'GET',
	                data: params,
	                success:function(res) {
		                if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
		            },
		            error:function(res) {
		            	d.reject({rtnCode: '-2000', rtnMsg: '网络错误'});
		            }
	            })
	            return d.promise;
	        }

	    };
		return service;
	}]);
})(my);