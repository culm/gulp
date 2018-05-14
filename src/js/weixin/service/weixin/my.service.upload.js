;(function(A) {
	A.getApp().factory('uploadService', ['$q', function($q) {
		var serverPath = A.getServer();
		var service = {
			/**
			 * [wechatOAuth/UploadImage 将已经上传到微信的图片地址，传到后台]
			 * @param  {array} imgs [图片的数组]
			 */
	    	uploadImage: function(imgs){
	    		var d = $q.defer();
    		    A.ajax({
                    url: serverPath + 'wechatOAuth/UploadImage',
                    type: 'POST',
                    data: {params:A.toJSON({images: imgs})},
                    success:function(res){
	                    if(res.rtnCode != '2000'){
	                        d.reject(res);
	                    }else{
	                        d.resolve(res);
	                    }
	                },
	                error:function(xhr, type, error){
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
	    	 * [wechatOAuth/submitUploadInfo 提交图片]
	    	 * @param  {array} serverImgs [图片数组]
	    	 * @param  {number} hospitalid [医院id]
	    	 */
	    	submitUploadInfo: function(serverImgs, hospitalid){
	    		var d = $q.defer();
	    		A.ajax({
                    url: serverPath + 'wechatOAuth/submitUploadInfo',
                    type: 'POST',
                    data: {params:A.toJSON({tenantId: hospitalid, imageList: serverImgs})},
                    success:function(res){
                    	// 临时修改矫正失败代码
	                    if(res.rtnCode != '2000' && res.rtnCode != '-1'){
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
	    	 * [wechatOAuth/FaceRecognition 人脸识别]
	    	 * @param  {string} serverId [description]
	    	 */
	    	faceRecognition: function(serverId){
	    		var d = $q.defer();
	    		A.ajax({
                    url: serverPath + 'wechatOAuth/FaceRecognition',
                    type: 'POST',
                    data: {params:A.toJSON({images: serverId})},
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
	    	 * [wechatOAuth/updatePaymentListTemplate 后台开始处理图片:OCR]
	    	 * @param  {object} data [description]
	    	 */
	    	updatePaymentList: function(data){
	    		var d = $q.defer();
	    		A.ajax({
                    url: serverPath + 'wechatOAuth/updatePaymentListTemplate',
                    type: 'GET',
                    data: data,
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
	    	upload: function(imgs, hospitalId){
	    		var d = $q.defer(),
	    			that = this;
	    		that.uploadImage(imgs).then(function(res){
	    			that.submitUploadInfo(res.imageList, hospitalId).then(function(res){
	    				that.updatePaymentList().then(function(){
	    				},function(res){
	    					that.msg(res.xhr, 'close');
	    				});
	    				d.resolve(res);
	    			}, function(res){
	    				d.reject(res);
	    			});
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