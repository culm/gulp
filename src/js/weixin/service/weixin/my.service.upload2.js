;(function(A) {
	A.getApp().factory('uploadService', ['$q', function($q) {
		var serverPath = A.getServer();	
		var service = {
	    	/**
	    	 * [taibao/uploadImg 提交图片]
	    	 * @param  {object} odata [userName,cardNo,token,sn,tenantId,chufangImages,shoujuImages]
	    	 * @return {object}       [{chufangImages:处方名称数组，shoujuImages:收据名称数组,paymentId:理赔单号}]
	    	 */
	    	submitUploadInfo: function(odata){
	    		var d = $q.defer();
	    		A.ajax({
                    url: serverPath + 'taibao/uploadImg',
                    type: 'POST',
                    data: {params:A.toJSON(odata)},
                    success:function(res){
	                    if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
	                },
	                error:function(xhr, type, error) {
		            	var info = {
	                		rtnCode: '-2000', 
	                		rtnMsg: '发生网络错误',
	                		xhr: xhr, 
	                		type:type, 
	                		error: error
	                	}
	                    d.reject(info);
		            }
                })
                return d.promise;
	    	},
	    	/**
	    	 * [taibao/updatePayment 更新理赔单]
	    	 * @param  {object} data [{paymentId,chufangImages,shoujuImages}]
	    	 */
	    	updatePaymentList: function(data){
	    		var d = $q.defer();
	    		A.ajax({
                    url: serverPath + 'taibao/updatePayment',
                    type: 'POST',
                    data: {params: A.toJSON(data)},
                    success:function(res){
	                    if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
	                },
	                error:function(xhr, type, error) {
		            	var info = {
	                		rtnCode: '-2000', 
	                		rtnMsg: '发生网络错误',
	                		xhr: xhr, 
	                		type:type, 
	                		error: error
	                	}
	                    d.reject(info);
		            }
                })
                return d.promise;
	    	},
	    	/**
	    	* 上传图片
	    	**/
	    	upload: function(odata){
	    		var d = $q.defer(),
	    			that = this;
	    			that.submitUploadInfo(odata).then(function(res){
	    				// that.updatePaymentList().fail(function(res){
	    				// 	that.msg(res.xhr, 'close')
	    				// });
	    				var data={
	    					'paymentId': res.paymentId,
	    					'chufangImages': res.chufangImages,
	    					'shoujuImages':res.shoujuImages,
	    					'hospitalImages':res.hospitalImages,
	    					'yaofangImages':res.yaofangImages 
	    				};
	    				that.updatePaymentList(data).then(function(res){
		    				
		    			}, function(res){
		    				that.msg(res.xhr, 'close');
		    			});
	    				d.resolve(res);
	    			}, function(res){
	    				d.reject(res);
	    			});
	    		return d.promise;
	    	},
	    	/**
	    	 * [searchList 搜索医院]
	    	 * @param  {object} obj [{
                    val: 查询医院名,
                    pageIndex:列表分页
                }]
	    	 */
	    	searchList: function(obj){
	    		var d = $q.defer(),
	    			that = this;
	    		A.ajax({
                    url: serverPath + "searchTenantList",
                    type: 'GET',
                    data: {
                        "tenantName" : obj.val,
                        "pageNum" : obj.pageIndex,
                        "pageSize" : 10
                    },
                    success:function(res){
	                    if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
	                },
	                error:function(xhr, type, error) {
		            	var info = {
	                		rtnCode: '-2000', 
	                		rtnMsg: '发生网络错误',
	                		xhr: xhr, 
	                		type:type, 
	                		error: error
	                	}
	                    d.reject(info);
		            }
                })
                return d.promise;
	    	}
	    };
		return service;
	}]);
})(my);