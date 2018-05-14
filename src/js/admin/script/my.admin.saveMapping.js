;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
        onReady: function () {
            var that = this;
            that.scrollNum='';
            that.listMap=A.service.listMap;
            //地址获取id
            that.mapId=A.getParams().id;
            that.copy=A.getParams().mode;
            that.initData();
            that.initEvent();
            that.numInsert=1;
            that.numInsert1=1;
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
            $('#saveMapping').click(function (){
                //先保存table data数据 再执行保存操作
                that.table.endEditing();
                that.table1.endEditing();
                that.save();
            });
            $(window).scroll(function(){
                //第一次滚动页面时更新高度
                if(!that.scrollNum) 
                {
                    that.resizeHeight(); 
                    that.scrollNum='1';
                } 
            });
            that.getEnumInfo();
            that.table = A.widget.bTable({
                container: '#mappingInvoice',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                    title: '主项中文名称',
                    field: 'chName',
                    class: 'chName',
                    editor: {
                        type: 'text'
                    },
                    formatter: function(rowValue, value , index){
                        return value.chName;
                    },
                    onClick: function(rowValue, rowIndex, target){
                        that.table.beginEditIng(rowIndex);
                    }
                },
                {
                    title: '主项英文名称',
                    field: 'enName',
                    class: 'enName',
                    editor: {
                        type: 'text'
                    },
                    formatter: function(rowValue, value , index){
                        return value.enName;
                    },
                    onClick: function(rowValue, rowIndex, target){
                        that.table.beginEditIng(rowIndex);
                    }
                },
                {
                    title: '操作',
                    field: 'roles',
                    class: 'roles',
                    updateWhenEdit: true,
                    formatter: function(rowValue, value, index, isEditting){
                            return'<button data-value="0" class="customeraction btn btn-primary">上移</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="1" class="customeraction btn btn-primary">下移</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="2" class="customeraction btn btn-primary">插入</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="3" class="customeraction btn btn-danger">删除</button>';
                    },
                    onClick: function(rowValue, rowIndex, target){
                        var value = target.data('value'),
                            _this = this;
                            //id = rowValue.id;
                        if(value == '0') //上移
                        {
                            that.table.moveUpRow(rowIndex);
                            return false;
                        }
                        if(value == '1'){//下移
                            that.table.moveDownRow(rowIndex);
                            return false;
                        }
                        if(value == '2'){//插入
                            //插入的时候先执行一次table数据的保存
                            that.table.endEditing();
                            that.numInsert++;
                            that.table.insertRowTo(rowIndex, {'chName':'','enName': that.numInsert}, true);
                            //更新主项的值
                            $('.mainItems').html(that.numInsert);
                            return false;
                        }
                        else if(value == '3'){//删除
                            //删除页面上对应的行数据,不保存后台不做删除更改
                            _this.delRow(rowIndex);
                            that.numInsert--;
                            //更新主项的值
                            $('.mainItems').html(that.numInsert);
                            return false;
                        }
                    }
                }]   
            });
            that.table1 = A.widget.bTable({
                container: '#mappingInvoiceDetail',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                    title: '副项中文名称',
                    field: 'chName',
                    class: 'chName',
                    editor: {
                        type: 'text'
                    },
                    formatter: function(rowValue, value , index){
                        return value.chName;
                    },
                    onClick: function(rowValue, rowIndex, target){
                        that.table1.beginEditIng(rowIndex);
                    }
                },
                {
                    title: '副项英文名称',
                    field: 'enName',
                    class: 'enName',
                    editor: {
                        type: 'text'
                    },
                    formatter: function(rowValue, value , index){
                        return value.enName;
                    },
                    onClick: function(rowValue, rowIndex, target){
                        that.table1.beginEditIng(rowIndex);
                    }
                },
                {
                    title: '操作',
                    field: 'roles',
                    class: 'roles',
                    updateWhenEdit: true,
                    formatter: function(rowValue, value, index, isEditting){
                            return'<button data-value="0" class="customeraction btn btn-primary">上移</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="1" class="customeraction btn btn-primary">下移</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="2" class="customeraction btn btn-primary">插入</button>\
                                  &nbsp;&nbsp;&nbsp;\
                                  <button data-value="3" class="customeraction btn btn-danger">删除</button>';
                    },
                    onClick: function(rowValue, rowIndex, target){
                        var value = target.data('value'),
                            _this = this;
                            //id = rowValue.id;
                        if(value == '0') //上移
                        {
                            that.table1.moveUpRow(rowIndex);
                            return false;
                        }
                        if(value == '1'){//下移
                            that.table1.moveDownRow(rowIndex);
                            return false;
                        }
                        if(value == '2'){//插入
                            //插入的时候先执行一次table数据的保存
                            that.table1.endEditing();
                            that.numInsert1++;
                            that.table1.insertRowTo(rowIndex, {'chName':'','enName': that.numInsert1}, true);
                            //更新副项的值
                            $('.deputyItems').html(that.numInsert1);
                            return false;
                        }
                        else if(value == '3'){//删除
                            //删除页面上对应的行数据,不保存后台不做删除更改
                            _this.delRow(rowIndex);
                            that.numInsert1--;
                            //更新副项的值
                            $('.deputyItems').html(that.numInsert1);
                            return false;
                        }
                    }
                }]   
            });
            if(that.mapId)
            {
                that.getById(that.mapId); 
            }
            else
            {
                //创建空的table
                var odata=[{'chName':'主项','enName': '1'}], odata1=[{'chName':'副项','enName': '1'}]; //data要有区别
                that.table.loadData(odata);
                that.table.beginEditIng();
                that.table1.loadData(odata1);
                that.table1.beginEditIng();
            }
        },
        //获取单据类型和项目类型
        getEnumInfo: function(){
            var that = this;
            that.listMap.getEnumInfo().success(function (res){
                var returnObj=res.returnObj;
                var tenantInfo=returnObj.insuranceCompany;
                var paymentType=returnObj.paymentType;
                //渲染页面
                var tenHtml='';
                for(var i in tenantInfo)
                {
                    tenHtml+='<option value="'+i+'">'+tenantInfo[i]+'</option>';
                }
                $('#tenantInfo').html(tenHtml);
                var payHtml='';
                for(var i in paymentType)
                {
                    payHtml+='<option value="'+i+'">'+paymentType[i]+'</option>';
                }
                $('#paymentType').html(payHtml);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        //获取mapping字段名称
        getById: function(id){
            var that = this;
            that.listMap.getById(id).success(function (res){
                var returnObj=res.returnObj;
                var invoice=returnObj.invoiceMapping;
                var detail=returnObj.invoiceDetailMapping;
                var mData=[],mData1=[];
                //更新主项副项的值
                that.numInsert=invoice.length;
                that.numInsert1=detail.length;
                $('.mainItems').html(that.numInsert);
                $('.deputyItems').html(that.numInsert1);
                //赋值城市
                $('#provinceName').val(returnObj.province);
                //根据返回更新项目和单据类型的选中项
                $('#tenantInfo').val(returnObj.tenantId);  
                $('#paymentType').val(returnObj.paymenttype);

                //输出invoice字段
                for(var i=0;i<invoice.length;i++)
                {
                    for(var j in invoice[i])
                    {
                        mData.push({'chName':invoice[i][j], 'enName':j});
                    }   
                }
                that.table.loadData(mData);
                that.table.beginEditIng();
                //输出invoiceDetail字段
                for(var i=0;i<detail.length;i++)
                {
                    for(var j in detail[i])
                    {
                        mData1.push({'chName':detail[i][j], 'enName':j});
                    }   
                }
                that.table1.loadData(mData1);
                that.table1.beginEditIng();
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        //保存mapping字段
        save: function(){
            var that = this;
            var invoiceMappingData={}, detailMappingData={};
            var oda=that.table.getData();
            var oda1=that.table1.getData();
            var saveId='' || that.mapId;
            for(var i=0;i<oda.length;i++)
            {
                invoiceMappingData[oda[i].enName]=oda[i].chName;
            }
            for(var i=0;i<oda1.length;i++)
            {
                detailMappingData[oda1[i].enName]=oda1[i].chName;
            }
            if(that.copy=='copy')
            {
                saveId='';
            }
            var saveData ={
                id: saveId,
                tenantId: $('#tenantInfo').val(),
                province: $('#provinceName').val(),
                paymenttype: $('#paymentType').val(),
                invoiceMapping: A.toJSON(invoiceMappingData),
                invoiceDetailMapping: A.toJSON(detailMappingData)
            }
            that.listMap.save(saveData).success(function (res){
                //成功之后跳回到列表页
                A.alert('保存成功',function (){
                    window.location.href='listMapping.html';
                });
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        getTabData: function (){
            //新增时更新data
            
        }
        //删除mapping字段行
        // delTemplate: function(rowIndex){
        //     var that = this;
        //     //删除页面上对应的行数据,不保存后台不做删除更改
        //     that.table.delRow(rowIndex);                  
        // }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
