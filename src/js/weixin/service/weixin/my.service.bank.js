;(function(A) {
	A.getApp().factory('bankService', ['$q', function($q) {
		var serverPath = A.getServer(true)
		var service = {
			/**
			 * [getBankCardList 获取理赔单列表]
			 * @param  {string} openid [当前微信号在当前公众号下的唯一id]
			 */
			bankCard: function(openid) {
				var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'getBankCardList',
	                type: 'POST',
	                data: {openId:openid},
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
	         * [getBankList 获取银行列表]
	         */
	        bankList: function() {
	        	var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'getBankList',
	                type: 'GET',
	                data: '',
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
	         * [saveBank 新加银行卡]
	         * @param  {object} data [{name:银行名}]
	         */
	        saveBank: function(data){
	        	var d = $q.defer();
	        	A.ajax({
	                url: serverPath + 'saveBank',
	                type: 'GET',
	                data: data,
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
	         * [deleteBank 删除银行卡]
	         * @param  {number} index [银行卡在数据库中的id]
	         */
	        deleteBank: function(index){
	        	var d = $q.defer();
	        	A.ajax({
	                url: serverPath + 'deleteBank',
	                type: 'GET',
	                data: {'bankId':index},
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