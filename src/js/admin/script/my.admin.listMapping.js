;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
        onReady: function () {
            var that = this;
            that.listMap=A.service.listMap;
            that.newPageNum = 1 ;
            that.initData();
            that.initEvent();
        },
        initData: function(){
            var that = this;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            });
        },
        initEvent: function(){
            var that = this; 
            $('#newMapping').click(function (){
                window.location.href='saveMapping.html?mode=new';
            });
            that.mappingList();
            that.table = A.widget.bTable({
                container: '#mappingList',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                        title: '项目',
                        field: 'tenantName',
                        class: 'tenantName',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.tenantName;
                        }
                    },{
                        title: '省市',
                        field: 'province',
                        class: 'province',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.province;
                        }
                    },
                    {
                        title: '单据类型',
                        field: 'paymentName',
                        class: 'paymentName',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            var otype=value.paymentName;
                            return otype;
                        }
                    },
                    {
                        title: '操作',
                        field: 'roles',
                        class: 'roles',
                        updateWhenEdit: true,
                        formatter: function(rowValue, value, index, isEditting){
                                return'<button data-value="0" class="customeraction btn btn-primary">修改</button>\
                                      &nbsp;&nbsp;&nbsp;\
                                      <button data-value="1" class="customeraction btn btn-primary">复制</button>\
                                      &nbsp;&nbsp;&nbsp;\
                                      <button data-value="2" class="customeraction btn btn-danger">删除</button>';
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this,
                                id = rowValue.id;
                            if(value == '0') //修改
                            {
                                location.href='saveMapping.html?mode=update&id='+id;
                                return false;
                            }
                            if(value == '1'){//复制
                                location.href='saveMapping.html?mode=copy&id='+id;
                                return false;
                            }
                            else if(value == '2'){//删除
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
                                                that.delTemplate(rowIndex, id);
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
        //获取mapping列表
        mappingList: function(){
            var that = this;
            var data={
                pageNum :that.newPageNum || 1,
                pageSize :10
            };
            that.listMap.listMap(data).success(function (res){
                var returnObj=res.returnObj.list;
                var listData=[];
                for(var i=0;i<returnObj.length;i++)
                {
                    listData.push({'id':returnObj[i].id, 'tenantName':returnObj[i].tenantName, 'province':returnObj[i].province, 'paymentName':returnObj[i].paymentName});
                }
                if(returnObj.length === 0) {
                    $('#pagination-container-tips').removeClass('hide');
                }else
                {
                    $('#pagination-container-tips').addClass('hide');
                }
                that.table.loadData(listData);
                if(!that.pagination){
                    A.widget.pagination({
                        container: '#pagination-container',
                        containerClass:'order-pagination',
                        size: 5,
                        pageNumber: that.newPageNum,
                        pageSize:10,
                        total: res.returnObj.total,
                        onPageChange: function(oldPaage, newPage){
                            that.newPageNum=newPage;
                            that.loaddata={ 
                                pageNum : that.newPageNum || 1, 
                                pageSize:10
                            };
                            that.mappingList();
                        }
                    });
                }else{
                    that.pagination.refresh({
                        pageNumber : res.pageNum,
                        total : res.total
                    })
                }
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        //删除模板 mapping列表行
        delTemplate: function(rowIndex, id){
            var that = this;
            that.listMap.deleteListMap(id).success(function (res){
                //删除成功，删除页面上对应的行数据
                that.table.delRow(rowIndex);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
