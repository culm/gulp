;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
         /**
         * [roleList 获取角色列表] 
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         */
        roleList: function(){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'role/list',
                type: 'GET',
                data:{},
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
         * [
         *     addUser 新增用户,
         *     userEdit 更新用户
         * ]
         * @param {object} data [description]
         */
        addUser:function (data){
            var that=this;
            var d = A.defer();
            var dataUrl = 'user/add';
            if(data.dataUrl=='user/update')
            {
                dataUrl='user/update';
            }
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
         * [getUserList description]
         * @param  {object} 
         * {
         *      username:
         *      role:
         *      status:
         *      pageNum:1
         *      pageSize:10
         *  } [传入参数]
         */
        getUserList:function (loaddata){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'user/list',
                data: loaddata,
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
    A.service.user=new CT();
})(my)