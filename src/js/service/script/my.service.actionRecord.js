;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [list 操作记录列表]
         */
        listRecord: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'oplog/list',
                type: 'POST',
                data:{params: A.toJSON(data)},
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
    A.service.actionRecord=new CT();
})(my)