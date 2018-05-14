;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
        onReady: function () {
            var that = this;
            that.scrollNum='';
            that.hosList=A.service.hosList;
            that.newPageNum = 1;
            that.listData={
                pageNum: that.newPageNum,
                pageSize: 10,
                tenantName: ''
            };
            that.getCity;
            that.getCountry;
            that.provinceList;
            that.cityList;
            that.countryList;
            that.getProvince();
            that.initData();
            that.initEvent();
            // that.listHos(that.listData);
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
            function dropIndex(arr,v){
               var i = !parseInt(v)?0:v;
               return arr[i];
            };
            
            that.table = A.widget.bTable({
                container: '#hostpitalList',
                tableClass: 'table-condensed table-hover table-bordered',
                groupField: 'name',
                groupStyler: 'display:none',
                groupSort: false,
                onGroupFormatter: function(flag, row){
                    return flag;
                },
                getRowClass: function(row){
                    var classname = '';
                    classname = 'order-group';
                    return classname;
                },
                multi: true,
                collumns:[
                {
                    title: '医院名称',
                    field: 'name',
                    class: 'name',
                    editor: {
                        type: 'text',
                        pattern: {
                            '^\\S+$': '请输入医院名称'
                        }
                    },
                    formatter: function(row, value , index){
                        return '<span class="glyphicon glyphicon-plus group" groupflag="' + value.name + '" aria-hidden="true"></span>'+value.name;   
                    }
                },
                {
                    title: '国家',
                    field: 'nation',
                    class: 'nation',
                    editor: {
                        type: 'dropdown',
                        pattern: {
                                '^\\S+$': '国家'
                            },
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return [
                                        {name: '中国', id: 0},
                                        {name: '其他', id: 1}
                                    ];
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        if(value==0 || parseInt(value))
                        {
                            return dropIndex(['中国','其他'],value);
                        }
                        else
                        {
                            return value;
                        }     
                    }
                },
                {
                    title: '省份',
                    field: 'province',
                    class: 'province',
                    editor: {
                        type: 'dropdown',
                        pattern: {
                                '^\\S+$': '省份'
                            },
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return that.provinceList;
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        //获取城市列表
                        that.getCity(value);
                        return value;     
                    }
                },
                {
                    title: '城市',
                    field: 'city',
                    class: 'city',
                    editor: {
                        type: 'dropdown',
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return that.cityList;
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        that.getCountry(value);
                        return value;
                    }
                },
                {
                    title: '地区',
                    field: 'country',
                    class: 'country',
                    editor: {
                        type: 'dropdown',
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return that.countryList;
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        return value;
                    }
                },
                {
                    title: '性质',
                    field: 'nature',
                    class: 'nature',
                    editor: {
                        type: 'dropdown',
                        pattern: {
                                '^\\S+$': '性质'
                            },
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return [
                                        {name: '公立', id: 0},
                                        {name: '非公立', id: 1}
                                    ];
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        if(value==0 || parseInt(value))
                        {
                            return dropIndex(['公立','非公立'],value);
                        }
                        else
                        {
                            return value;
                        }     
                    }
                },
                {
                    title: '级别',
                    field: 'grade',
                    class: 'grade',
                    editor: {
                        type: 'dropdown',
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return [
                                        {name: '三级', id: 0},
                                        {name: '二级', id: 1},
                                        {name: '一级', id: 2},
                                        {name: '一级以下', id: 3},
                                        {name: '未定级', id: 4},
                                        {name: '专科医院', id: 5},
                                        {name: '体检中心/室', id: 6},
                                        {name: '民营', id: 7},
                                        {name: '外资', id: 8},
                                        {name: '股份制', id: 9},
                                        {name: '财团法人', id: 10},
                                        {name: '教会', id: 11},
                                        {name: '其他', id: 11}
                                    ];
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        if(value==0 || parseInt(value))
                        {
                            return dropIndex(['三级','二级','一级','一级以下','未定级','专科医院','体检中心/室','民营','外资','股份制','财团法人','教会','其他'],value);
                        }
                        else
                        {
                            return value;
                        }   
                    }
                },
                {
                    title: '等级',
                    field: 'level',
                    class: 'level',
                    editor: {
                        type: 'dropdown',
                        typeNum : false,
                        options: {
                            valueField:'name',
                            textField:'name',
                            getDefaultData: function(){
                                return [
                                        {name: '特等', id: 0},
                                        {name: '甲等', id: 1},
                                        {name: '乙等', id: 2},
                                        {name: '丙等', id: 3},
                                        {name: '未评等', id: 4},
                                        {name: '其他', id: 5}
                                    ];
                            }
                        }
                    },
                    formatter: function(value, rowValue, index){
                        if(value==0 || parseInt(value))
                        {
                            return dropIndex(['其他','特等','甲等','乙等','丙等','未评等'],value);
                        }
                        else
                        {
                            return value;
                        }   
                    }
                },
                {
                    title: '地址',
                    field: 'address',
                    class: 'address',
                    editor: {
                        type: 'text',
                        pattern: {
                            '^\\S+$': '请输入医院地址'
                        }
                    },
                    formatter: function(row, value , index){
                        return value.address = value.address ? value.address : '';  
                    }
                },
                {
                    title: '操作',
                    field: 'roles',
                    class: 'roles',
                    updateWhenEdit: true,
                    formatter: function(rowValue, value, index, isEditting){
                        if(isEditting)
                        {
                            return'<button data-value="0" class="customeraction btn btn-primary">保存</button>\
                              &nbsp;&nbsp;&nbsp;';
                              // <button data-value="1" class="customeraction btn btn-primary">删除</button>\
                              // &nbsp;&nbsp;&nbsp;
                        }
                        else
                        {
                            return'<button data-value="2" class="customeraction btn btn-primary">修改</button>\
                              &nbsp;&nbsp;&nbsp;';
                        }   
                    },
                    onClick: function(rowValue, rowIndex, target){
                        var value = target.data('value'),
                            _this = this;
                            id = rowValue.id;
                        if(value == '0') //保存
                        {   
                            that.table.endEditing();
                            if(_this.validateRow(rowIndex)){
                                that.saveHos(rowIndex,id)
                            } 
                            return false;
                        }
                        if(value == '2'){//修改
                            
                            that.table.beginEditIng(rowIndex);
                            
                            return false;
                        }
                        else if(value == '1'){//删除
                            //删除页面上对应的行数据
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
                                            that.deleteHos(id);
                                            _this.delRow(rowIndex);
                                        }else{
                                            _this.delRow(rowIndex);
                                        }
                                    }
                                }
                            });
                            return false;
                        }  
                    }
                }],
                onClick: function(rowValue, index){
                    // var otd=$('#hostpitalList table tbody tr[row-index='+index+'] td')[6];
                    var otd=$('#hostpitalList table tbody tr[row-index='+index+'] td')[9];
                    spanHl=$($(otd).find('button')[0]).html();
                    if(spanHl=='保存') //判断是否是医院修改
                    {
                        //不做动作
                    }
                    else
                    {
                        //展开或收起相关的行
                        that.toggleTr(rowValue, index);
                        return;
                    }   
                }  
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
                        // this.Options.OnSelect.call(this,defaultItem);
                    }
                },
                SearchedTitle:function(){
                    return "搜索：" + this.GetTarget().val();
                },
                ShowDefault:function(){ return false;},
                GetDefaultValue: function(){return '';}
            });
            $('#searchBtn').click(function (){
                that.newPageNum=1;
                that.listData={
                    pageNum: 1,
                    pageSize: 10,
                    tenantName: $('#hospitalName').val()
                };
                that.listHos(that.listData);
            });
            //新建医院
            $('#newHospital').click(function (){
                //会默认执行上个医院的列表，此处手动赋值
                that.cityList=[{id: 18, name: ""},{id: 12, name: "北京"},{id: 27416, name: "北京市"},{id: 49792, name: "海淀区"}]; 
                that.countryList=[{id: 27416, name: ""},{id: 37259, name: "东城区"},{id: 37398, name: "丰台区"},
                {id: 37475, name: "大兴区"},{id: 37481, name: "密云县"},{id: 37465, name: "平谷区"},
                {id: 37489, name: "延庆县"},{id: 37470, name: "怀柔区"},{id: 37430, name: "房山区"},
                {id: 37434, name: "昌平区"},{id: 37263, name: "朝阳区"},{id: 31836, name: "海淀区"},
                {id: 31821, name: "石景山区"},{id: 37320, name: "西城区"},{id: 37457, name: "通州区"},
                {id: 37421, name: "门头沟区"},{id: 37439, name: "顺义区"}];
                var row={
                    code:'',
                    name:'',
                    nation:'中国',
                    province:'北京市',
                    city:'北京市',
                    country:'朝阳区',
                    nature:'公立',
                    grade:'',
                    level:'',
                    roles:''
                };
                that.table.appendRow(row,true);
            });
            //新建
            $('.buildHosMap').click(function (){
                $('.listul-input').remove();
                //创建ul
                var oul='<ul class="listul-input">\
                        <li class="id"><input type="text" /></li>\
                        <li class="myId"><input type="text" value="'+that.myId+'" /></li>\
                        <li class="standardCode"><input type="text" /></li>\
                        <li class="tenantId"><input type="text" /></li>\
                        <li class="code"><input type="text" /></li>\
                        <li class="aliasName"><input type="text" /></li>\
                        <li class=""><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save">保存</button></li>\
                    </ul>';
                $('#hosMappList').append(oul);
                $('.mapp-list-empty').hide();
            });
            //新增
            $('#hosMappList').delegate('.buildHosMap_btn','click',function (e){
                var oul='<ul class="listul-input">\
                        <li class="id"><input type="text" /></li>\
                        <li class="myId"><input type="text" value="'+that.myId+'" /></li>\
                        <li class="standardCode"><input type="text" /></li>\
                        <li class="tenantId"><input type="text" /></li>\
                        <li class="code"><input type="text" /></li>\
                        <li class="aliasName"><input type="text" /></li>\
                        <li class=""><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save">保存</button></li>\
                    </ul>';
                $(this).parents('ul').after(oul);
            });
            //保存和修改
            $('#hosMappList').delegate('.hosMap_save','click',function (e){
                var ohtml=$(this).html();
                var tul=$(this).parents('ul');
                var thisId=$(this).attr('id') || $(tul).attr('Id');
                if(ohtml=='修改') //修改
                {
                    var odata=[];
                    for(var i=0;i<tul[0].children.length-1;i++)
                    {
                        odata.push($(tul[0].children[i]).html());
                    }
                    var valueID=odata[0] || $(tul).attr('Id');
                    var oli='<li class="id"><input type="text" value="'+valueID+'" /></li>\
                        <li class="myId"><input type="text" value="'+odata[1]+'" /></li>\
                        <li class="standardCode"><input type="text" value="'+odata[2]+'" /></li>\
                        <li class="tenantId"><input type="text" value="'+odata[3]+'" /></li>\
                        <li class="code"><input type="text" value="'+odata[4]+'" /></li>\
                        <li class="aliasName"><input type="text" value="'+odata[5]+'" /></li>\
                        <li class=""><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save" id="'+odata[0]+'">保存</button></li>';
                    $(tul).html(oli);
                }
                else if(ohtml=='保存') //保存 判断新增保存还是修改保存
                {
                    var myId=$(tul).find('.myId input').val(), tenantId=$(tul).find('.tenantId input').val(),
                        code=$(tul).find('.code input').val(), aliasName=$(tul).find('.aliasName input').val(),
                        Id=$(tul).find('.id input').val(), standardCode=$(tul).find('.standardCode input').val();
                    var odata=[];
                    for(var i=0;i<tul[0].children.length-1;i++)
                    {
                        odata.push($($(tul[0].children[i]).find('input')[0]).val());
                    }
                    if(thisId) //修改保存
                    {
                        if(!Id)
                        {
                            A.alert('Mapping表id不能为空');
                            return;
                        }
                        var mapData={   //字段id必填 
                            id: Id,
                            myId: myId,
                            tenantId: tenantId,
                            code: code,
                            aliasName: aliasName,
                            standardCode: standardCode
                        }
                        that.updateHosMap(mapData, $(this),odata);
                    }
                    else //新增保存
                    {
                        if(!myId)
                        {
                            A.alert('医院id不能为空');
                            return;
                        }
                        if(!tenantId)
                        {
                            A.alert('保险公司tenantId不能为空');
                            return;
                        }
                        if(!code)
                        {
                            A.alert('映射医院code不能为空');
                            return;
                        }
                        if(!aliasName)
                        {
                            A.alert('映射医院名称不能为空');
                            return;
                        }
                        var mapData={   //四个字段必填 
                            id: Id,
                            myId: myId,
                            tenantId: tenantId,
                            code: code,
                            aliasName: aliasName,
                            standardCode: standardCode
                        }
                        
                        that.addHosMap(mapData, $(this),odata);
                    }
                }
            });
        },
        //列表组展开行
        toggleTr: function(rowValue, index){
            var that=this;
            var tbody = this.table.tbody,
                flag = rowValue.name,
                tr = tbody.find('tr[flag="' +flag+ '"]'),
                prot = $('#hostpitalList').offset().top,
                trot = $(tr).offset().top,
                trh = $(tr).height(),
                cuot = trot-prot+trh,
                target = tbody.find('tr[flag="' +flag+ '"] span.group[groupflag="' + flag + '"]');
            $('#hosMappList').css({'top':cuot});
            that.myId=rowValue.id;
            
            //构造当前行假数据
            var mapData={   
                id: null,
                myId: rowValue.id,
                tenantId: null,
                code: null,
                aliasName: null,
                standardCode: null,
                pageSize: 99999,
                pageNum: 1
            }
            if(target.hasClass('glyphicon-minus')){
                target.removeClass('glyphicon-minus');
                target.addClass('glyphicon-plus');
                $('#hosMappList').hide();
                $('.mapp-list-empty').hide(); 
                $('.title_th').hide();
                $('.listul-input').remove();
                $('.listul').remove();
            }else{
                $('#hosMappList').show();
                $('.title_th').show();
                $('.listul-input').remove();
                $(target).parents('tbody').find('span.glyphicon.group').removeClass('glyphicon-minus').addClass('glyphicon-plus');
                target.removeClass('glyphicon-plus');
                target.addClass('glyphicon-minus');  
                that.hosList.getHosMap(mapData).success(function (res){
                    var oname=['Mapping表id:','医院id:','保险公司tenantId:','映射医院code:','映射医院名称:','医院code:'];
                    var list=res.list;
                    $('.listul').remove();
                    if(list.length==0) //新建
                    {  
                        $('.mapp-list-empty').show();    
                    }
                    else //构建div
                    {
                        $('.mapp-list-empty').hide();
                        var oul='';
                        for(var i=0;i<list.length;i++)
                        {
                            var oli='';
                            oli+='<li>'+list[i].id+'</li>';
                            oli+='<li>'+list[i].hospitalId+'</li>';
                            oli+='<li>'+list[i].hospitalCode+'</li>';
                            oli+='<li>'+list[i].tenantId+'</li>';
                            oli+='<li>'+list[i].code+'</li>';
                            oli+='<li>'+list[i].aliasName+'</li>';

                            oli+='<li><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save">修改</button></li>';
                            oul+='<ul class="listul">'+oli+'</ul>';
                        }
                        $('#hosMappList').append(oul);
                    }
                }).fail(function (res){
                    A.alert(res.rtnMsg);
                });
            }   
        },
        //医院列表
        listHos: function (data){
            var that = this;
            var odata=[];
            that.hosList.listHos(data).success(function (res){
                var tenantList=res.returnObj.tenantList;
                // var tenantList=res.tenantList;
                if(tenantList.length === 0) {
                    $('#pagination-container-tips').removeClass('hide');
                }else
                {
                    $('#pagination-container-tips').addClass('hide');
                }
                that.table.loadData(tenantList);
                if(!that.pagination){
                    A.widget.pagination({
                        container: '#pagination-container',
                        containerClass:'order-pagination',
                        size: 5,
                        pageNumber: that.newPageNum,
                        pageSize:10,
                        //total: res.returnObj.total,
                        total: res.total,
                        onPageChange: function(oldPaage, newPage){
                            that.newPageNum=newPage;
                            that.listData={ 
                                pageNum : that.newPageNum || 1, 
                                pageSize:10,
                                tenantName:$('#hospitalName').val() || ''
                            };
                            that.listHos(that.listData);
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
        //保存医院
        saveHos: function(rowIndex,id){
            var that = this;
            var saveData = that.table.getData()[rowIndex];
            if(saveData.nature == "公立"){saveData.nature = 0}else if(saveData.nature == "非公立") {saveData.nature = 1};
            saveData.code = '';
            if( !id ) { saveData.id = ''; }
            that.hosList.saveHos(saveData).success(function (res){
                A.alert('保存成功');
                that.table.getData()[rowIndex].id = res.id;
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        deleteHos: function (id){
            var that = this;
            that.hosList.deleteHos(id).success(function (res){
                A.alert('删除成功');
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                // A.alert(res.rtnMsg);
            });  
        },
        getProvince: function (){
            var that = this;
            that.hosList.getProvince().success(function (res){
                if(res.list.length>0)
                {
                    that.provinceList=res.list;
                }
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });  
        },
        getCity: function (provinceName){
            var that = this;
            that.hosList.getCity(provinceName).success(function (res){
                if(res.list.length>0)
                {
                    that.cityList=res.list;
                }
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });  
        },
        getCountry: function (cityName){
            var that = this;
            that.hosList.getCountry(cityName).success(function (res){
                if(res.list.length>0)
                {
                    that.countryList=res.list;
                }
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });  
        },
        //新增医院mapping关系
        addHosMap: function (mapData, _this, odata){
            var that = this;
            that.hosList.addHosMap(mapData).success(function (res){
                //保存成功后将当前ul的input切换为li
                A.alert('保存成功');
                var Id=res.mapping.id;
                var tul=$(_this).parents('ul');
                var oli='<li class="id">'+odata[0]+'</li>\
                        <li class="myId">'+odata[1]+'</li>\
                        <li class="standardCode">'+odata[2]+'</li>\
                        <li class="tenantId">'+odata[3]+'</li>\
                        <li class="code">'+odata[4]+'</li>\
                        <li class="aliasName">'+odata[5]+'</li>\
                        <li class=""><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save">修改</button></li>';
                $(tul).attr('Id',Id).html(oli);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });
        },
        //修改保存医院mapping关系
        updateHosMap: function (mapData, _this, odata){
            var that = this;
            that.hosList.updateHosMap(mapData).success(function (res){
                //保存成功后将当前ul的input切换为li
                A.alert('保存成功');
                var tul=$(_this).parents('ul');
                var oli='<li class="id">'+odata[0]+'</li>\
                        <li class="myId">'+odata[1]+'</li>\
                        <li class="standardCode">'+odata[2]+'</li>\
                        <li class="tenantId">'+odata[3]+'</li>\
                        <li class="code">'+odata[4]+'</li>\
                        <li class="aliasName">'+odata[5]+'</li>\
                        <li class=""><button class="btn btn-primary buildHosMap_btn">新增</button><button class="btn btn-primary hosMap_save">修改</button></li>';
                $(tul).html(oli);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });
        },
        //获取当前医院mapping关系列表
        getHosMap: function (hosid){
            var that = this;
            var mapData={   
                id: null,
                myId: hosid,
                tenantId: null,
                code: null,
                aliasName: null,
                standardCode: null,
                pageSize: 99999,
                pageNum: 1
            }
            that.hosList.getHosMap(mapData).success(function (res){
                return res.list;
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
        A.admin.hosL=page;
        page.onReady();
    });

})(my);




