;(function(A){
    var CT=function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [getPersonFamilyList 获取家属列表]
         * @param  {number} newPageNum [家属列表页码]
         */
        getPersonFamilyList: function(newPageNum){
            var that=this;
        	var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getPersonFamilyList',
                data: {pageNum: newPageNum || 1,pageSize:10},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            })
            return d.promise;
        },
        /**
         * [addPersonFamily|updatePersonFamily 新增家属信息||更新家属信息]
         * @param {object} data [description]
         */
        addPersonFamily:function (data){
            var that=this;
            var dataUrl = 'addPersonFamily';
            if(data.dataUrlId)
            {
                dataUrl = 'updatePersonFamily';
            }
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + dataUrl,
                type: 'POST',
                data: {params: A.toJSON(data)},
                dataType: 'json',
                success: function(res){
                     that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [deletePersonFamily 删除家属信息]
         * @param  {number} id [家属的id]
         */
        deletePersonFamily:function (id){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'deletePersonFamily',
                type: 'POST',
                data: {personId: id},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        },
        /**
         * [confirmPersonFamily description]
         * @param  {number} mainPaymentId [批次id]
         * @param  {number} personId      [理赔人的id]
         */
        confirmPersonFamily: function(mainPaymentId,personId){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'confirmPersonFamily',
                data: {
                    paymentId: mainPaymentId,
                    personId : personId
                },
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [updatePersonFamialyStatus description]
         * @param  {object} data [description]
         */
        updatePersonFamialyStatus:function (data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updatePersonFamialyStatus',
                data: data,
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            })
            return d.promise;
        }  
    }); 
    A.service.family = new CT();
})(my)