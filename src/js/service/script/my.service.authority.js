;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [delete  删除权限]
         * @param  {num} id [权限id]
         */
        deletePrivilege: function(id){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'menu/delete',
                type: 'POST',
                data:{id:id},
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
         * [add     新增权限]
         * [update  更新权限]
         * @param {object} data [参数]
         */
        addPrivilege:function (data){
            var that=this;
            var d=A.defer();
            var dataUrl = 'menu/add'; //新增保存
            if(data.dataUrl=='menu/update')
            {
                var dataUrl ='menu/update'; //修改保存
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                emulate: true,
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
         * [list  权限列表]
         * @param  {number} pageNum    [第几页]
         * @param  {number} pageSize   [每页条数]
         * @param  {number} code       [权限码]
         */
        privilegeList:function (newPageNum,code){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'menu/list',
                dataType: 'json',
                data: {
                    code:code, 
                    pageNum : newPageNum || 1, 
                    pageSize:10
                },
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
    A.service.authority=new CT();
})(my)