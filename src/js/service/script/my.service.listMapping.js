;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [list 获取mapping列表]
         */
        listMap: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'inputMapping/list',
                type: 'POST',
                data:{
                    params: A.toJSON(data)
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
         * [delete 删除mapping列表行]
         * @param  {number} id  [id]
         */
        deleteListMap: function(id){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'inputMapping/delete',
                type: 'POST',
                data:{
                    'id': id
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
        // saveMapping使用
        /**
         * [getEnumInfo 获取单据类型和项目类型]
         */
        getEnumInfo: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'inputMapping/getEnumInfo',
                type: 'GET',
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
         * [getById 获取mapping字段名称]
         */
        getById: function(id){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'inputMapping/getById',
                type: 'POST',
                data:{
                    'id': id
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
         * [save 保存mapping字段]
         */
        save: function(saveData){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'inputMapping/save',
                type: 'POST',
                //data:saveData,
                data:{param: A.toJSON(saveData)},
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
    A.service.listMap=new CT();
})(my)