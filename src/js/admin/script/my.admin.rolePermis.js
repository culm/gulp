;(function (A) {
    var U = A.admin,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, A.service, {
        onReady: function () {
            var that = this;
            that.rolePermis=A.service.rolePermis;
            that.saveRoTatget;
            that.privilege;
            that.roleId;
            that.privileges;
            that.roleChName =[];
            that.roleEnName =[];
            that.total;
            that.pageSize=10;
            that.privilegeFullData='';
            that.initData();
            that.initEvent();
            that.loadData();
            that.privilegeFull();
        },
        initData: function(){
        	var that = this;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                    that.loadData();
                });
            });
        },
        //获取所有权限
        privilegeFull:function (newPageNum){
            var that=this;
            that.rolePermis.privilegeList().success(function (res){
                A.widget.loading.hide();
                that.privilegeFullData=res;
                //that.privilegeListFull(res);
                           
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
        privilegeListFull:function (res,id){
            var that=this;
            var privileges=A.parseJSON(that.privileges);
            var odata = res.menuList,
                arrName = [],
                arrId = [],
                arrData = [];
            var roleid=id;
            if(roleid==="")
            {
                privileges=[1];
            }
            that.total=res.total;
            that.pageNum=res.pageNum;
                for(var i=0;i<odata.length;i++)
                {
                    arrName.push(odata[i].name);
                    arrId.push(odata[i].id);
                }
                for(var i=0;i<arrName.length;i++)
                {
                    var otype=false;
                    if(privileges)
                    {
                        for(var j=0;j<privileges.length;j++)
                        {
                            if(privileges[j]==arrId[i])otype=true;
                        }
                    }
                    var json={type:otype,'privilegeId':arrId[i],'privilegeName':arrName[i]};
                    arrData.push(json);
                }
                that.otable.loadData(arrData);
                var onum=Math.ceil(arrData.length/that.pageSize);
                //有分页
                if(onum>1)
                {
                    var alis='<li class="li_page active lipage-0" id="tr1">1</li>';
                    for(var i=1;i<onum;i++)
                    {
                        alis+='<li class="li_page lipage-'+i+'" id="tr1">'+(parseInt(i)+1)+'</li>';
                    }
                    var htmlul='<ul class="my_class_page">'+alis+'</ul>';
                    $('#pagination-container').html(htmlul);
                    var otr=$('#data_modal_role table tr');
                    $(otr).hide();
                    for(var i=0;i<=that.pageSize;i++)
                    {
                        $(otr[i]).show();
                    }
                    //点击切换分页
                    for(var i=0;i<otr.length;i++)
                    {
                        $('.lipage-'+i).click(function (){  
                            var index=$(this).index();
                            $(otr).hide();   
                            $('.li_page').removeClass('active');
                            $(this).addClass('active');
                            var start=that.pageSize*(parseInt(index));
                            if(start>0)start=parseInt(start)+1;
                            if(that.total<that.pageSize*(parseInt(index)+1))
                            {
                                var end=that.total;
                            }
                            else{
                                var end=that.pageSize*(parseInt(index)+1);
                            }
                            
                            for(var j=start;j<=end;j++)
                            {
                                $(otr[j]).show();
                            }
                        });
                    }
                }
        },
        initEvent: function(){
        	var that = this;
            //权限分配保存接口
            $('#save_role').off('click').on('click',function (){
                var target=that.saveRoTatget;
                var otable = that.otable;
                var selectId=otable.getSelectStatus().selected;
                if(selectId.length==0){
                    A.alert('请至少选择一个权限');
                    return;
                };
                if(selectId[0].disabl=='true') //查看
                {
                    $('#myModal').modal('hide');
                }
                else //保存
                {
                    var arr=[], dArr=[], arrV=[], strV='',roleMenusVo={};
                    for(var i=0;i<selectId.length;i++)
                    {
                        arr.push(selectId[i].privilegeId); 
                        arrV.push(selectId[i].privilegeName);
                    }
                    strV=arrV.join(',');
                    for(var j=0;j<arrV.length;j++)
                    {
                        roleMenusVo[j]=arrV[j];
                    }
                    var indexData = that.table.getData()[that.assignrowIndex], tableData = that.table.getData();
                    indexData.roleMenus=arr;
                    indexData.roleVo=strV;
                    indexData.roleMenusVo=roleMenusVo;
                    //that.table.loadData(tableData);
                    //在验证之前给权限的input赋值
                    var otr =$('#rolePermis-container tbody tr')[that.assignrowIndex];
                    var oinut=$(otr).find('td.roleVo input');
                    oinut.val(indexData.roleVo);
                    if(that.table.validateRow(that.assignrowIndex)){
                        that.saveRole(that.assignrowIndex,that.assignId);
                    } 
                    //that.saveRole(that.assignrowIndex,that.assignId);
                    $('#myModal').modal('hide');
                }
            });
            //新建角色
            $('#newRole').click(function (){
                that.table.appendRow({'id':'', 'description':'', 'roleMenus':'', 'roleVo':'单据处理', 'role':'', 'roletype':''},true);
            });
            function dropIndex(arr,v){
               var i = !parseInt(v)?0:v;
               return arr[i];
            };
            that.otable =A.widget.bTable({
                container: '#data_modal_role',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[{
                    title: '选择',
                    field: 'type',
                    class: 'title',
                    editor: {
                        type: 'checkbox'
                    },
                    onClick: function(rowValue, rowIndex, target){
                        return false;
                    }
                },{
                    title: '权限名',
                    field: 'privilegeName',
                    class: 'privilegeName',
                    onClick: function(rowValue, rowIndex, target){
                        return false;
                    }
                  }]   
            });
            that.table = A.widget.bTable({
                container: '#rolePermis-container',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                    {
                        title: '角色名',
                        field: 'description',
                        class: 'description',
                        editor: {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入角色名'
                            }
                        },
                        formatter: function(value) {
                            return value;
                        }
                    },
                    {
                        title: '角色码',
                        field: 'role',
                        class: 'role',
                        editor: {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入角色码'
                            }
                        },
                        formatter: function(value) {
                            return value;
                        }
                    },
                    {
                        title: '权限',
                        field: 'roleVo',
                        class: 'roleVo',
                        editor: false,
                        formatter: function(rowValue, value , index) {
                            //console.dir(value);
                            return value.menuNames;
                        }
                    },
                    {
                        title: '操作',
                        field: '',
                        updateWhenEdit: true,
                        formatter: function(rowValue, value, index, isEditting){
                            if(isEditting)
                            {
                                return '<button data-value="0" class="customeraction btn btn-primary">保存</button>\
                                <button data-value="1" class="customeraction btn btn-primary">删除</button>\
                                <button data-value="2" class="customeraction btn btn-primary" data-toggle="modal" data-target="#myModal">分配</button>';
                            }
                            else
                            {
                                return '<button data-value="3" class="customeraction btn btn-primary">修改</button>\
                                <button data-value="1" class="customeraction btn btn-primary">删除</button>\
                                <button data-value="2" class="customeraction btn btn-primary" data-toggle="modal" data-target="#myModal">分配</button>';
                            }
                            // return '<button data-value="0" class="customeraction btn btn-primary">保存</button>\
                            // <button data-value="1" class="customeraction btn btn-primary">删除</button>\
                            // <button data-value="2" class="customeraction btn btn-primary" data-toggle="modal" data-target="#myModal">分配</button>';
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this;
                            that.privileges=rowValue.roleMenus;
                            var id= rowValue.id;
                            that.assignId=id;
                            that.assignrowIndex=rowIndex;
                            if(value == '2')//分配权限
                            {
                                //传递数据
                                that.saveRoTatget=target;
                                //that.privilegeFull();
                                if(that.privilegeFullData)
                                {
                                    that.privilegeListFull(that.privilegeFullData,id);
                                }
                                else
                                {
                                    A.alert('权限列表空');
                                }
                                
                                return false;
                            }
                            else if(value == '0') //保存角色
                            {
                                if(_this.validateRow(rowIndex)){
                                    that.saveRole(rowIndex,id);
                                }   
                            }
                            else if(value == '1') //删除角色
                            {
                                A.widget.dialog.show({
                                    title: '提示',
                                    modalType: '',
                                    modalDialog: 'modal-sm',
                                    message: '您确定要删除吗？',
                                    buttons:[
                                        {text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'},
                                        {text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'}],
                                    onClick:function(value, e){
                                        if(value == 0){
                                            if(id){
                                                that.delRole(rowIndex, id);
                                            }else{
                                                _this.delRow(rowIndex);
                                            }
                                        }
                                    }
                                });
                                return false;
                            }
                            else if(value == '3') //修改角色
                            {
                                _this.beginEditIng(rowIndex);
                                return false;
                            }
                        }
                    }]   
            });
        },
        loadData: function(newPageNum){
            var that = this;
            A.widget.loading.show({message: '数据查询中...'});
            that.rolePermis.rolePrivilegeList(newPageNum).success(function (res){
                A.widget.loading.hide();
                that.showData(res);        
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
                data = res.roles ||[];
            that.roleChName =[];
            that.roleEnName =[];
            if(data.length === 0) {
                $('#pagination-container-tips').removeClass('hide');
            }else{
                $('#pagination-container-tips').addClass('hide');
            }
            var existIds = {},
                newData = [];
            A.each(data, function(index, d){
                var paymentId = d.id;
                var roleMenusVo=d.roleMenusVo;
                var roleVo=[];
                //权限名获取
                A.each(roleMenusVo, function(key, o){
                    roleVo.push(o);
                });
                d.roleVo=roleVo.join(',');
                var exist = existIds[paymentId];
                existIds[paymentId] = d;  
                //角色名和角色码获取
                that.roleChName.push(d.description);
                that.roleEnName.push(d.role);
            });
            A.each(existIds, function(key, d){
                newData.push(d)
            });
            that.table.loadData(data);
            if(!that.pagination){
                A.widget.pagination({
                    container: '#pagination-container',
                    containerClass:'order-pagination',
                    size: 5,
                    pageNumber: res.pageNum,
                    pageSize:10,
                    total: res.total,
                    onPageChange: function(oldPaage, newPage){
                        that.loadData(newPage)
                    }
                });
            }else{
                that.pagination.refresh({
                    pageNumber : res.pageNum,
                    total : res.total
                })
            }   
        },
        //保存角色
        saveRole: function(rowIndex,id){
            var that = this,
                data = that.table.getData()[rowIndex],
                addData = {};
            //var roleMenusVo = data.roleMenusVo, roleVo = data.roleVo, roleMenus=[];
            var roleMenusVo = that.privilegeFullData.menuList, roleVo = ''+data.roleVo, roleMenus=[];
            roleVo=roleVo.split(',');
            data.dataUrl ='';
            for(var i=0;i<roleVo.length;i++)
            {
                for(var j=0;j<roleMenusVo.length;j++)
                {
                    if(roleVo[i]==roleMenusVo[j].name)
                    {
                        roleMenus.push(roleMenusVo[j].id);
                    }
                }   
            }
            //roleMenus=roleMenus.join(',');
            data.roleMenus=roleMenus;
            if (id && id!="") {
               data.dataUrl = 'role/update';
               data.id = id;
            }
            else if(id===0)
            {
                data.dataUrl = 'role/update';
               data.id = id;
            }
            else{
                for(var i in data){
                    var v = data[i];
                    addData[i] = v;
                }
                data = addData;
                //判断角色名(data.description)和角色码(data.role)是否重复，如果重复提示，不能保存
                var roleChName = that.roleChName, roleEnName = that.roleEnName;
                for(var i=0;i<roleChName.length;i++)
                {
                    if(roleChName[i]==data.description)
                    {
                        A.alert('角色名不能重复');
                        return;
                    }
                };
                for(var i=0;i<roleEnName.length;i++)
                {
                    if(roleEnName[i]==data.role)
                    {
                        A.alert('角色码不能重复');
                        return;
                    }
                };
            }
            
            A.widget.loading.show({message: '数据修改中...'});
            that.rolePermis.saveRole(data).success(function (res){
                A.widget.loading.hide();
                A.alert('保存成功！');
                var table = that.table;
                table._endEditing(rowIndex);
                //保存成功之后更新数据，否则前端判断有误
                that.loadData();
                if(!id){
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
        //删除角色
        delRole: function (rowIndex,id){
            var that = this;
            that.rolePermis.delRole(id).success(function (res){
                A.widget.loading.hide();
                //删除成功，删除页面上对应的行数据
                that.table.delRow(rowIndex);   
                //删除成功之后更新数据，否则前端判断有误
                that.loadData();   
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });
})(my);








