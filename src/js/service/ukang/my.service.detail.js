;(function(A){
    var CT=function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [getPaymentSummary 获取理赔单summary]
         * @param  {number} id     [批次的id]
         * @param  {number} person [理赔人的id]
         */
        getPaymentSummary: function(id,person){
            var that=this;
        	var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getPaymentSummary',
                data: {paymentId: id,personId:person},
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
         * [getPaymentDetail 获取理赔单详细]
         * @param  {number} id     [批次的id]
         * @param  {number} person [理赔人的id]
         */
        getPaymentDetail: function(id,person){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getPaymentDetail',
                data: {paymentId: id,personId:person},
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
         * [updatePayment 更新单据状态]
         * @param  {object} jsonData [{
                paymentId: 批次id,
                personId: 理赔人id,
                status: 状态
            }]
         */
        updatePayment: function(jsonData){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updatePayment',
                data: {
                    paymentId: jsonData.paymentId,
                    personId: jsonData.personId,
                    status: jsonData.status
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
        } 
    });
    A.service.detail=new CT();
})(my)