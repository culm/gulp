;(function (A) {
    var U = A.admin,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, A.service, {
        onReady: function () {
            var that = this;
            that.authority=A.service.authority;
            that.serverData=[];
            that.initData();
            that.initEvent();
            that.loadData();
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
        initEvent: function(){
        	var that = this;
            $('#search').on('click', function(){
                
                that.loadData();
            });
            $('#addExpert').on('click', function(event) {
                that.table.appendRow({'name':'默认权限','code': '默认权限码'}, true);
            });
            that.table = A.widget.bTable({
                container: '#authority-container',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[{
                        title: '权限',
                        field: 'name',
                        class: 'name',
                        maxLen:'30',
                        editor: {
                            keyUpevent:'true',
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入权限名'
                            },
                            inputEvents:{
                                'keyup': function (){
                                    
                                }
                            }
                        },
                        formatter: function(rowValue, value , index) {
                            return value.name;
                        }
                    },
                    {
                        title: '权限码',
                        field: 'code',
                        class: 'code',
                        maxLen:'30',
                        editor: {
                            keyUpevent:'true',
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入权限码'
                            },
                            inputEvents:{
                                'keyup': function (){
                                    
                                }
                            }
                        },
                        formatter: function(rowValue, value , index) {
                            return value.code;
                        }
                    },
                    {
                        title: '权限控制',
                        field: 'controller',
                        class: 'controller',
                        maxLen:'30',
                        editor: {
                            keyUpevent:'true',
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入权限控制'
                            },
                            inputEvents:{
                                'keyup': function (){
                                    
                                }
                            }
                        },
                        formatter: function(rowValue, value , index) {
                            return value.controller;
                        }
                    },
                    {
                        title: '操作',
                        field: '',
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
                                return '<button data-value="0" class="customeraction btn btn-primary">修改</button>\
                                        &nbsp;&nbsp;&nbsp;\
                                      <button data-value="3" class="customeraction btn btn-danger">删除</button>';
                            }
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this,
                                id = rowValue.id;
                            if(value == '1'){//保存
                                //判断数据是否为空，提示
                                if(_this.validateRow(rowIndex)){
                                    that.submitInfo(rowIndex,id);
                                }
                                return false;
                            }
                            else if(value == '0')//修改
                            {
                                _this.beginEditIng(rowIndex);
                                return false;
                            }
                            else if(value == '3')//删除
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
                                                that.delFamilyInfo(rowIndex, id);
                                            }else{
                                                _this.delRow(rowIndex);
                                            }
                                        }
                                    }
                                });
                                return false;
                            }
                            else if(value == '2') //取消
                            {
                                A.widget.dialog.show({
                                    title: '提示',
                                    modalType: '',
                                    modalDialog: 'modal-sm',
                                    message: id ? '取消修改权限？':'取消添加权限？',
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
        delFamilyInfo: function(rowIndex, id){
            var that = this;
            that.authority.deletePrivilege(id).success(function (res){
                 //删除成功，删除页面上对应的行数据
                that.table.delRow(rowIndex);
                //删除成功之后更新数据，否则不刷新直接保存错误
                that.loadData();
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });               
        },
        submitInfo: function(rowIndex,id){
            var that = this;
            var data = that.table.getData()[rowIndex],
                addData = {};
                data.dataUrl ='';
            
            if(id) {
               data.dataUrl = 'menu/update';
               data.id = id;
            } else {
                for(var i in data){
                    var v = data[i];
                    addData[i] = v;
                }
                data = addData;  
            }

            //保存之前判断权限名是否重复
            for(var i=0;i<that.serverData.length;i++) {
                if(data.name == that.serverData[i].name && data.id!=that.serverData[i].id) {
                    A.alert('权限名不能重复');
                    return;
                }
            }

            A.widget.loading.show({message: '数据修改中...'});
            that.authority.addPrivilege(data).success(function (res){
                A.widget.loading.hide();
                A.alert('保存成功！');
                var table = that.table;
                table._endEditing(rowIndex);
                //保存成功之后更新数据
                that.loadData();
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
        loadData: function(newPageNum){
            var that = this;
            var code=$('#searchVal').val();
            A.widget.loading.show({message: '数据查询中...'});
            that.authority.privilegeList(newPageNum,code).success(function (res){
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
            var that = this;
                that.serverData = res.menuList;
            if(that.serverData.length === 0) {
                $('#pagination-container-tips').removeClass('hide');
            }else{
                $('#pagination-container-tips').addClass('hide');
            }
            that.table.loadData(that.serverData);
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
            
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });
})(my);
