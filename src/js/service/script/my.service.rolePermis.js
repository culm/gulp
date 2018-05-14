;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [menu/list 获取权限列表] 
         * @method GET
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         */
        privilegeList: function(){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'menu/list',
                data: {
                    pageNum :1, 
                    pageSize:10000000
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
         * [saveRolePrivilege 保存当前角色的权限]
         * @method GET
         * @param  {number} roleId      [角色id]
         * @param  {number} privilegeId [权限id]
         */
        saveRolePrivilege:function (roleId,privilegeId){
            var that=this;
            var d=A.defer();
            A.ajax({
                url:that.ServerPath+'saveRolePrivilege',
                type:'POST',
                data:{params:A.toJSON({
                        roleId:roleId,
                        privilegeId:privilegeId
                    })  
                },
                success:function (res){
                    that.callbackProcess(d, res);      
                },
                error:function (){
                   that.networkError(d,xhr);       
                }
            });
            return d.promise;
        },
        /**
         * [role/list 角色权限对应列表]
         * @method GET
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         */
        rolePrivilegeList:function (newPageNum){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'role/list',
                data: {
                    pageNum : newPageNum || 1, 
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
         * [role/save 保存角色]
         * @method POST
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         */
        saveRole:function (data){
            var that=this;
            var d=A.defer();
            var dataUrl = 'role/save'; //新增保存
            if(data.dataUrl=='role/update')
            {
                var dataUrl ='role/update'; //修改保存
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                type:'POST',
                data: {params: A.toJSON(data)},
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
         * [role/delete 删除角色]
         * @method POST
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         */
        delRole:function (id){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'role/delete',
                type:'POST',
                data: {id:id},
                // data: {params:A.toJSON({
                //         id:id
                //     })},
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
    A.service.rolePermis=new CT();
})(my)