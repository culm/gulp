;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin, A.service, {
        onReady: function () {
            var that = this;
            that.user=A.service.user;
            that.newPageNum=1;
            that.loaddata={
                username:$('#searchVal').val(), 
                //userRoles:'['+$('#roleSelect').val()+']',
                status:'',
                pageNum : that.newPageNum || 1, 
                pageSize:10
            };
            that.initData();
            that.roleData();
            that.initEvent();
            that.loadData();
        },
        initData: function(){
        	var that = this;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                    return;
                });
            });
        },
        initEvent: function(){
        	var that = this; 
            $('#search').on('click', function(){ 
                that.newPageNum=1;
                that.loaddata={
                username:$('#searchVal').val(), 
                //userRoles: '['+$('#roleSelect').val()+']',
                status:'',
                pageNum : that.newPageNum || 1, 
                pageSize:10
            };
                that.loadData();
            });
            $('#addExpert').on('click', function(event) {
                that.table.appendRow({'userName':'','role':'admin','status':1}, true);
            });
            $('.userselect button').on('click', function(event) {
                var $that = $(this),
                    text = $that.text();
                $that.addClass('btn-primary').siblings('button').removeClass('btn-primary');
                that.newPageNum=1;
                that.loaddata={
                    username: $('#searchVal').val(), 
                    //userRoles: '['+$('#roleSelect').val()+']',
                    status:'',
                    pageNum : that.newPageNum || 1, 
                    pageSize:10
                };
                that.loadData(); 
            });
            function dropIndex(arr,v){
               var i = !parseInt(v)?0:v;
               return arr[i];
            }
            that.table = A.widget.bTable({
                container: '#user-container',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                        title: '用户名',
                        field: 'userName',
                        class: 'userName',
                        editor: {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入用户名'
                            }
                        },
                        formatter: function(rowValue, value , index){
                            return value.userName;
                        }
                    },{
                            title: '角色',
                            field: 'roles',
                            class: 'roles',
                            editor: {
                                type: 'select',
                                options: {
                                    multi: true,
                                    valueField: 'id',
                                    textField: 'name'
                                },
                                getDefaultData: function(){
                                    return that.selectdataR;
                                },
                                onRender: function(toShowItem, currentValue){
                                    var _id = toShowItem.id,
                                        des = toShowItem.description,
                                        selected = '';
                                    A.each(currentValue, function(index, data){
                                        if(data.roleId==_id){
                                            selected = ' selected';
                                        }
                                    });
                                    return '<p class="table-select-item' + selected + '" value="' + _id + '">' + des + '</p>';
                                }
                            },
                            formatter: function(rowValue, value, index, isEditting){
                                return value.roleNames;
                            },
                            onClick: function(rowValue, rowIndex, target){
                                return false;
                            }
                        },{
                        title: '状态',
                        field: 'status',
                        class:'status',
                        editor: {
                            type: 'dropdown',
                            typeNum : true,
                            options: {
                                valueField:'id',
                                textField:'text',
                                getDefaultData: function(){
                                    return [
                                    {text: '不可用', id: 0},
                                    {text: '可用', id: 1}];
                                }
                            }
                        },
                        formatter: function(value, rowValue, index){
                            return dropIndex(['不可用','可用'],value)
                        }
                    },{
                        title: '操作',
                        field: 'opertion',
                        class: 'opertion',
                        updateWhenEdit: true,
                        formatter: function(rowValue, value, index, isEditting){
                            if(isEditting)
                            {
                                return'<button data-value="1" class="customeraction btn btn-primary">保存</button>\
                                      &nbsp;&nbsp;&nbsp;\
                                      <button data-value="2" class="customeraction btn btn-danger">取消</button>';
                            }
                            else
                            {
                                return '<button data-value="0" class="customeraction btn btn-primary">修改</button>';
                            }
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this,
                                id = rowValue.userId;
                            if(value == '1'){//保存
                                //判断数据是否为空，提示
                                if(_this.validateRow(rowIndex)){
                                    that.submitInfo(rowValue,rowIndex,id,target);
                                }
                                return false;
                            }
                            else if(value == '0')//修改
                            {
                                _this.beginEditIng(rowIndex);
                                return false;
                            }else if(value == '2'){//取消
                                A.widget.dialog.show({
                                    title: '提示',
                                    modalType: '',
                                    modalDialog: 'modal-sm',
                                    message: id ? '取消修改用户信息？':'取消添加用户？',
                                    buttons:[{text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'}, {text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'}],
                                    onClick:function(value, e){
                                        if(value == 0){
                                            if(id){
                                                _this._endEditing(rowIndex)
                                            }else{
                                                _this.delRow(rowIndex);
                                            }
                                        }
                                    }
                                });
                                return false;
                            }
                        }
                    }]   
            });
        },
        roleData: function(){ //获取角色列表数据
            var that = this;
            that.user.roleList().success(function (res){
                var arr=[];
                var roles=res.roles;
                that.selectdataR = res.roles; 
                return;
                //var opts='<option value="">全部</option>';
                for(var i=0;i<roles.length;i++)
                {
                    //更新查询select选项
                    //opts+='<option role="'+roles[i].role+'" value="'+roles[i].id+'">'+roles[i].description+'</option>';
                    var role={};
                    role.id=roles[i].id;
                    role.name=roles[i].description;
                    arr.push(role);
                }
                //$('#roleSelect').html(opts);
                that.selectdataR=arr; 
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });
        },
        submitInfo: function(rowValue,rowIndex,id,target){
            var otarget=target;
            var that = this, 
                data = that.table.getData()[rowIndex],
                addData = {};
            data.dataUrl = '';
            A.widget.loading.show({message: '数据修改中...'});
            //获取角色选中项的值：
            var roleSel_p = $(target).parents('tr').find('.table-select-item');
            var otr=$(target).parents('tr');
            var selArr=[], role_value=[], userRolesVo={};
            for(var i=0;i<roleSel_p.length;i++) {
                if($(roleSel_p[i]).hasClass('selected')) {
                    selArr.push($(roleSel_p[i]).attr('value')); 
                    role_value.push($(roleSel_p[i]).text());
                }
            }
            var eDataun=data.userName;
            addData.username = data.userName;
            addData.status=data.status;
            //addData.role=selArr.join(',');
            addData.userRoles='['+selArr+']';
            for(var i=0;i<role_value.length;i++)
            {
                userRolesVo[i]=role_value[i];
            }
            addData.userRolesVo = userRolesVo;
            data=addData;
            if (id) { //修改
               //data.dataUrl = 'userEdit';
               data.dataUrl = 'user/update';
               data.userId = id;
               data.id = id; 
               //获取数据库中角色数据原值
                var oldR=rowValue.userRolesVo;
                var oldrole=[];
                if(oldR)
                {
                    for(var i in oldR)
                    {
                        oldrole.push(oldR[i]);
                    }
                }   
            }
            else{
                //新增的时候，如果不选，则默认选中管理员
                if(!data.userRoles)
                {
                    data.userRoles='0';
                }
                data.username = eDataun;
            }
            that.user.addUser(data).success(function (res){
                A.widget.loading.hide();
                A.alert('保存成功！');
                var table = that.table;
                table._endEditing(rowIndex);
                var role_value=[];
                var userRolesVo=data.userRolesVo;
                for(var i in userRolesVo)
                {
                    role_value.push(userRolesVo[i]);
                }
                role_value=role_value.join(',');
                var odiv=$(otr).find('td.userRolesVo div');
                $(odiv).html(role_value);
                if(data.userRoles=='')$(odiv).html(oldrole.join(','));
                if(!id){//如果是新增家属信息，更新页面数据对应行的id
                    table.data[rowIndex].id = res.id;
                }
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        loadData: function(){
            var that = this;
            A.widget.loading.show({message: '数据查询中...'});
            that.user.getUserList(that.loaddata).success(function (res){
                A.widget.loading.hide();
                that.showData(res);
                that.selectdata=res.list;    
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            }); 
        },
        showData: function(res){
            var that = this,
                data = res.userList||[];
            if(data.length === 0) {
                $('#pagination-container-tips').removeClass('hide');
            }else{
                $('#pagination-container-tips').addClass('hide');
            }
            that.table.loadData(data);
            if(!that.pagination){
                A.widget.pagination({
                    container: '#pagination-container',
                    containerClass:'order-pagination',
                    size: 5,
                    pageNumber: that.newPageNum,
                    pageSize:10,
                    total: res.total,
                    onPageChange: function(oldPaage, newPage){
                        that.newPageNum=newPage;
                        that.loaddata={
                            username:$('#searchVal').val(), 
                            //userRoles:'['+$('#roleSelect').val()+']',
                            status:'',
                            pageNum : that.newPageNum || 1, 
                            pageSize:10
                        };
                        that.loadData();
                    }
                });
            }else{
                that.pagination.refresh({
                    pageNumber : res.pageNum,
                    total : res.total
                })
            }
            
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
