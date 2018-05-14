;(function(A) {
	A.getApp().factory('personService', ['$q', function($q) {
		var serverPath = A.getServer()
		var service = {
			/**
			 * [getPersonBasicInfo 获取个人信息]
			 * @param  {string} openid [当前微信号在当前公众号下的唯一id]
			 */
			getBasicInfo: function(openid) {
				var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'getPersonBasicInfo',
	                type: 'POST',
	                responseType: 'text',
	                data: {openId: openid},
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
	         * [getPersonFamilyList 获取理赔单家属列表]
	         * @param  {number} newPageNum [分页数]
	         */
	        getFamilyList: function(newPageNum) {
	        	var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'getPersonFamilyList',
	                type: 'GET',
	                data: {pageNum: newPageNum || 1,pageSize:10},
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
	         * [modifyPersonBasicInfo 验证绑定个人信息]
	         * @param  {object} data [{
                    openId: 当前微信号在当前公众号下的唯一id,
                    insuranceNo: 保单号,
                    cardType: 证件类型,
                    cardNo: 证件号码,
                    mobile: 手机号,
                    mobileCode: 手机验证码
                }]
	         */
	        modify: function(data) {
	        	var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'modifyPersonBasicInfo',
	                type: 'GET',
	                data: {params: A.toJSON(data)},
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
	         * [sendMobileCode 获取验证码]
	         * @param  {number} mobile [手机号]
	         */
	        sendMobileCode: function(mobile){
	            var that=this;
	        	var d = $q.defer();
	            A.ajax({
	                url: serverPath + 'sendMobileCode',
	                type: 'GET',
	                data:{mobile: mobile},
	                dataType: 'json',
	                success: function(res){
	                    if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
	                },
	                error: function(xhr, txt, status){
	                   d.reject({rtnCode: '-2000', rtnMsg: '网络错误'});
	                }
	            });
	            return d.promise;
	        }
	        
	    };
		return service;
	}]);
})(my);