;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [getNamesByType 获报表所有字段] 
         * @method GET
         * @param  {object} data   [{type:报表类型}]
         */
        getName: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getNamesByType',
                data: data,
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
         * [selectCustomReportByPage 获报表所有字段带分页] 
         * @method GET
         * @param  {object} data   [{
         *                             type:报表类型,
         *                             name:报表名称
         *                             tenantId:租户ID,
         *                             pageNum:分页,
         *                             pageSize:每页个数
         *                         }]
         */
        getListPage: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'selectCustomReportByPage',
                data: data,
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
         * [selectCustomReport 获报表所有字段] 
         * @method GET
         * @param  {object} data   [{
         *                             type:报表类型,
         *                             name:报表名称
         *                             tenantId:租户ID,
         *                             pageNum:分页,
         *                             pageSize:每页个数
         *                         }]
         */
        getList: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'selectCustomReport',
                data: data,
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
         * [addCustomReport 获报表所有字段] 
         * @method GET
         * @param  {object} data   [{
         *                             type:报表类型,
         *                             name:报表名称
         *                             content:报表内容,需要的字段
         *                             tenantId:租户ID
         *                         }]
         */
        add: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'addCustomReport',
                data: data,
                type: "POST",
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
         * [deleteCustomReport 获报表所有字段] 
         * @method GET
         * @param  {object} data   [{id:主键id}]
         */
        delete: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'deleteCustomReport',
                data: data,
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
         * [updateCustomReport 获报表所有字段] 
         * @method GET
         * @param  {object} data   [{
         *                             id:主键id,
         *                             type:报表类型,
         *                             name:报表名称
         *                             content:报表内容,需要的字段
         *                             tenantId:租户ID
         *                         }]         
         */
        update: function(data){
            var that = this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updateCustomReport',
                data: data,
                type: "POST",
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
    A.service.customReport = new CT();
})(my)