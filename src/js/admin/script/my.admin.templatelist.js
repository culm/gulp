;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
        onReady: function () {
            var that = this;
            that.template=A.service.template;
            that.newPageNum=1;
            that.loaddata={
                hospital:$('#hospitalName').val(), 
                province:$('#provinceSelector').val(),
                city:$('#citySelector').val(),
                contry:$('#countySelector').val(),
                type:$('#voucherType').val(),
                pageNum : that.newPageNum || 1,
                pageSize:10
            };
            that.initData();
            that.initEvent();
            // that.loadData();
            A.widget.provinceCity.init();
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
            $('#addTemplate').click(function (){
                that.addTemplate();
            });
            $('#search').on('click', function(){ 
                that.newPageNum=1;
                that.loaddata={
                    hospital:$('#hospitalName').val(), 
                    province:$('#provinceSelector').val(),
                    city:$('#citySelector').val(),
                    contry:$('#countySelector').val(),
                    type:$('#voucherType').val(),
                    pageNum : that.newPageNum || 1,
                    pageSize:10
                };
                that.loadData();
            });
            var autoComplete = new A.widget.AutoComplete('#hospitalName', {
                getTitleHtml:function(type){
                    return '<span class="title">输入医院名字或↑↓选择</span>';
                },
                PageCount:10,
                ShowNavigate: 1,
                pageIndex:0,
                // SearchSource:0,//0:从网站搜索,1:从百度地图去数据
                GetUrl: function(){ return that.ServerPath + "/RestServiceCall/TenantService/searchTenantList "; },
                dataType: 'JSON',
                ajaxType: 'get',
                customerJsonData: function(res){
                    return {Data: res.tenantList||[], total: Math.ceil(res.total/10)};
                },
                getRequestData: function(){
                    var data = {
                        "tenantName" : this.target.val(),
                        "pageNum" : parseInt(this.Options.pageIndex,10) + 1,
                        "pageSize" : 10
                    };
                    return {params: A.toJSON(data)};
                },
                OnRender:function(item, type) {
                    var name = item.name;
                    return '<a class="text-overflow" title="' + name + '" targetid="' + item.id + '">' + name + '</a>';
                },
                OnSelect:function(item) {
                    if (item != null) {
                        this.GetTarget().val(item.name);
                        // that.selectedHospital = item;
                    }
                },
                OnBeforeHide: function(selected, defaultItem){
                    if(!selected){
                        this.Options.OnSelect.call(this,defaultItem);
                    }
                },
                SearchedTitle:function(){
                    return "搜索：" + this.GetTarget().val();
                },
                ShowDefault:function(){ return false;},
                GetDefaultValue: function(){return '';}
            });
            that.table = A.widget.bTable({
                container: '#user-container',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                        title: '医院名字',
                        field: 'hospital',
                        class: 'hospital',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.hospital;
                        }
                    },{
                        title: '省份',
                        field: 'province',
                        class: 'province',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.province;
                        }
                    },{
                        title: '城市',
                        field: 'city',
                        class: 'city',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.city;
                        }
                    },{
                        title: '地区',
                        field: 'county',
                        class: 'county',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.county;
                        }
                    },{
                        title: '年份',
                        field: 'county',
                        class: 'county',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.county;
                        }
                    },{
                        title: '类型',
                        field: 'type',
                        class: 'type',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            var otype=value.type,turntype;
                            if(otype==100)turntype="处方大类";
                            if(otype==110)turntype="西药无医保处方";
                            if(otype==120)turntype="中药无医保处方";
                            if(otype==130)turntype="西药有医保处方";
                            if(otype==140)turntype="中药有医保处方";
                            if(otype==200)turntype="收据大类";
                            if(otype==210)turntype="有医保收据";
                            if(otype==220)turntype="无医保收据";
                            if(otype==230)turntype="挂号收据";
                            if(otype==300)turntype="住院收据大类";
                            if(otype==310)turntype="住院收据";
                            if(otype==400)turntype="明细清单大类";
                            if(otype==410)turntype="明细清单";
                            if(otype==810)turntype="矫正处方";
                            if(otype==820)turntype="矫正收据";
                            if(otype==830)turntype="矫正住院收据";
                            if(otype==840)turntype="矫正明细清单";
                            return turntype;
                        }
                    },
                    {
                        title: '操作',
                        field: 'roles',
                        class: 'roles',
                        updateWhenEdit: true,
                        formatter: function(rowValue, value, index, isEditting){
                                return'<button data-value="0" class="customeraction btn btn-primary">查看</button>\
                                      &nbsp;&nbsp;&nbsp;\
                                      <button data-value="1" class="customeraction btn btn-primary">复制</button>\
                                      &nbsp;&nbsp;&nbsp;\
                                      <button data-value="2" class="customeraction btn btn-danger">删除</button>';
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this,
                                id = rowValue.id;
                            if(value == '0') //查看
                            {
                                location.href='template.html?id='+id;
                                return false;
                            }
                            if(value == '1'){//复制
                                //复制内容并跳转到template.html页面
                                //http://localhost/admin/template.html?hospitalName=&typeId=001&pageNum=1
                                location.href='template.html?clone=true&id='+id;
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
        //新建模板
        addTemplate:function (){
            var that=this;
            location.href='template.html';
        },
        //删除模板
        delTemplate: function(rowIndex, id){
            var that = this;
            that.template.delete(id).success(function (res){
                //删除成功，删除页面上对应的行数据
                that.table.delRow(rowIndex);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });
                            
        },
        loadData: function(){
            var that = this;
            A.widget.loading.show({message: '数据查询中...'});
            that.template.list(that.loaddata).success(function (res){
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
                data = res.list||[];
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
                    pageNumber: res.pageNum,
                    pageSize:10,
                    total: res.total,
                    onPageChange: function(oldPaage, newPage){
                        that.newPageNum=newPage;
                        that.loaddata={
                            hospital:$('#hospitalName').val(), 
                            province:$('#provinceSelector').val(),
                            city:$('#citySelector').val(),
                            contry:$('#countySelector').val(),
                            type:$('#voucherType').val(),
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
