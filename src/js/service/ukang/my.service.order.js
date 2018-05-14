;(function(A){
    var CT=function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [getPaymentList 获取理赔批次列表]
         * @param  {object} jsonData [{
                    startDate: 开始时间, 
                    endDate: 结束时间,
                    paymentId: 批次id,
                    pageNum : 分页数, 
                    pageSize: 分页个数
                }]
         */
        getPaymentList:function (jsonData){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getPaymentList',
                data: {
                    startDate: jsonData.startDate, 
                    endDate: jsonData.endDate,
                    paymentId: jsonData.paymentId, 
                    pageNum : jsonData.pageNum, 
                    pageSize:10
                },
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
         * [canclePayment 取消状态修改]
         * @param  {number} paymentId [批次id]
         * @param  {number} personId  [理赔人id]
         */
        canclePayment:function (paymentId,personId){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'canclePayment',
                data: {
                    paymentId: paymentId, 
                    personId: personId
                },
                type:'POST',
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
    A.service.order=new CT();
})(my)