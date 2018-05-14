;(function (A) {
    var U = A.ukang,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, {
        onReady: function () {
            var that = this;
            that.family=A.service.family;
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
            that.loadData();
        },
        initEvent: function(){
            var that = this;
            $('#personinfo-plus').on('click', function(event) {
                that.table.appendRow({'gender': 0,'cardType':0,'relation':0}, true);
            });
            //切换理赔单和详情，重新调整高度
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                that.resizeHeight();
            })
            function dropIndex(arr,v){
               var i = !parseInt(v)?0:v;
               return arr[i];
            }
            that.table = A.widget.bTable({
                container: '#familyTable',
                tableClass: 'table-condensed table-hover table-bordered',
                bindDropdown: true,
                multi: true,
                collumns:[{
                        title: '家属姓名',
                        field: 'name',
                        class: 'name',
                        editor: {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入家属姓名'
                            }
                        }
                    },{
                        title: '家属性别',
                        field: 'gender',
                        class: 'gender',
                        editor: {
                            type: 'dropdown',
                            typeNum : true,
                            options: {
                                valueField:'id',
                                textField:'text',
                                getDefaultData: function(){
                                    return [
                                    {text: '男', id: 0},
                                    {text: '女', id: 1}];
                                }
                            }
                        },
                        formatter: function(value, rowValue, index){
                            return dropIndex(['男','女'],value);
                        }
                    },{
                        title: '出生日期',
                        field: 'bornDate',
                        class: 'bornDate',
                        editor: {
                            type: 'datetimepicker',
                            pattern: {
                                '^\\S+$': '请输入出生日期'
                            },
                            options: {
                                endDate: new Date()
                            }
                        },
                        formatter: function(value, rowValue, index){
                            var date = (new Date(value)).toString('yyyy-MM-dd');
                            return date;
                        }
                    },{
                        title: '证件类型',
                        field: 'cardType',
                        class: 'cardType',
                        editor: {
                            type: 'dropdown',
                            typeNum : true,
                            options: {
                                valueField:'id',
                                textField:'text',
                                getDefaultData: function(){
                                    return [
                                    {text: '身份证', id: 0},
                                    {text: '军官证', id: 1},
                                    {text: '护照', id: 2},
                                    {text: '户口本', id: 3},
                                    {text: '港澳通行证', id: 4},
                                    {text: '台胞证', id: 5},
                                    {text: '出生证', id: 6}];
                                },
                                onSelect: function(e, id, text){
                                    that.selectedCard = id;
                                }
                            }
                        },
                        formatter: function(value, rowValue, index){
                            return dropIndex(['身份证','军官证','护照','户口本','港澳通行证','台胞证','出生证'],value);
                        }
                    },{
                        title: '证件号码',
                        field: 'cardNo',
                        class: 'cardNo',
                        editor: {
                            type: 'text',
                            pattern: {
                                checkValue: function(value, rowValue){
                                    if(!value){ return '请输入证件号码';}
                                    var cardType = rowValue.cardType;
                                    if(that.selectedCard){
                                        cardType = that.selectedCard;
                                    }
                                    if(cardType === 0){//证件类型是身份证
                                        if(value.isCardNo()) return '';
                                        else return '请输入正确的身份证号码';
                                    }else{//其他的证件类型暂时不做验证
                                        return '';
                                    }
                                }
                            }
                        }
                    },{
                        title: '证件图片',
                        field: 'cardPhoto',
                        class: 'cardPhoto',
                        editor: {
                            type: 'fileupload',
                            pattern: {
                                checkValue: function(value, rowValue){
                                    if(value) return '';
                                    else return '请上传证件图片';
                                }
                            },
                            options:{
                                path: that.ServerPath + 'upload/image/save',
                                onInit: function(){
                                    $(this.container + ' .uploadfile-label ').html('点击添加图片').addClass('btn btn-link').css('margin', '5px 8px');
                                },
                                onUploadError: function(){
                                    A.alert('上传文件失败');
                                },
                                onShowFile: function(dataKey, src){
                                    $(this.container + ' label').css('background-image', 'url(' + src + ')');
                                    $(this.container).addClass('customer-fileupload');
                                    return false;
                                },
                                onUploadSuccess: function(ret, file){
                                    var _that = this,
                                        imgName = ret.imageList[0],
                                        key = file.name + file.size;
                                    if(file.type == 'image/tiff'){//用上传的图片替换目前的tiff图片
                                        var img = new Image();
                                        img.src = that.ServerPath + 'upload/download?fileName=' + imgName;
                                        img.onload = function(){
                                            $(_that.container + ' div[data-key="' + key + '"]').next().prop('src', this.src);
                                        }
                                        img.style.display = 'none';
                                        document.body.appendChild(img);
                                    }
                                    $(_that.container).attr('data-url', imgName);
                                }
                            }
                        },
                        formatter: function(value, rowValue, index){
                        	var v = value||rowValue.cardPhoto;
                            if(v){
                                return '<a style="background-image:url(' + that.ServerPath + 'upload/download?fileName=' + v + ')" class="btn btn-link img-button">点击查看图片</a>';
                            }else{
                                return '<a class="btn btn-link img-button">暂无图片</a>'
                            }
                            return value;
                        },
                        onClick: function(rowValue, rowIndex, target, isEditting){
                            if(!isEditting && rowValue.cardPhoto){
                                A.widget.dialog.show({
                                    title: '查看图片',
                                    modalType: '',
                                    modalDialog: 'modal-lg',
                                    message: '<img style="width:100%" src="' + that.ServerPath + 'upload/download?fileName=' + rowValue.cardPhoto+'" />',
                                    buttons:[{text: '确定', class: 'btn btn-default', value: 0, dismiss: 'modal'}]
                                });
                            }
                            return false;
                        }
                    },{
                        title: '家属关系',
                        field: 'relation',
                        class: 'relation',
                        editor: {
                            type: 'dropdown',
                            typeNum : true,
                            options: {
                                valueField:'id',
                                textField:'text',
                                getDefaultData: function(){
                                    return [
                                    {text: '子女', id: 0},
                                    {text: '父母', id: 1},
                                    {text: '岳父母', id: 2},
                                    {text: '其他关系', id: 3}];
                                }
                            }
                        },
                        formatter: function(value, rowValue, index){
                            return dropIndex(['子女','父母','岳父母','其他关系'],value)
                        }
                    },{
                        title: '操作',
                        field: 'myaction',
                        class: 'myaction',
                        updateWhenEdit: true,
                        formatter: function(rowValue, value, index, isEditting){
                            return [{
                                text: isEditting ? '保存':'修改',
                                value: isEditting ? 2 : 3,
                                class: 'btn btn-primary'
                            },{
                                text: isEditting ?'取消':'删除',
                                value: isEditting ? 0 : 1,
                                class: 'btn btn-danger'
                            }]
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                            	_this = this,
                            	id = rowValue.id,
                            	photo = rowValue.cardPhoto;
                            if(value == '2'){//保存
                                if(_this.validateRow(rowIndex)){
                                    that.submitInfo(rowIndex,id);
                                }
                                return false;
                            }
                            else if(value == '1') {//删除
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
                            else if(value == '0'){//取消
                                A.widget.dialog.show({
                                    title: '提示',
                                    modalType: '',
                                    modalDialog: 'modal-sm',
                                    message: id ? '取消修改家属？':'取消添加家属？',
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
                            }else if(value == '3'){//修改
                                _this.beginEditIng(rowIndex);
                                return false;
                            }
                            return true;
                        }
                    }],
                    onDropdownClick: function(id, text, field){
                        if(field == 'status'){
                            this.data[this.editIndex].status = id;
                        }
                    }
            });
        },
        loadData: function(newPageNum){
            var that = this;
            that.family.getPersonFamilyList(newPageNum).success(function (res){
                res.pageNum = newPageNum;
                that.table.loadData(res.personFamilyList);
                that.showPage(res);
                for (var i = res.personFamilyList.length - 1; i >= 0; i--) {
                    if(res.personFamilyList[i].status == 0){
                        that.table.beginEditIng(i)
                    }
                };
            }).notLogin(function (res){

            }).fail(function (res){
                A.alert(res.rtnMsg);
            }); 
        },
        showPage: function(res){
            var that = this;
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
                });
            }            
        },
        submitInfo: function(rowIndex,id){
            var that = this,
            	// dataUrl = 'addPersonFamily',
                data = that.table.getData()[rowIndex],
                addData = {};
                data.dataUrlId=id;
            A.widget.loading.show({message: '数据修改中...'});
            if (id) {
               // dataUrl = 'updatePersonFamily';
               data.personId = id;
            }else{
            	for(var i in data){
            		var v = data[i];
            		if(!(i=='cardPhoto')){
            			i = 'member'+i.substring(0,1).toUpperCase()+i.substring(1);
            		}
            		addData[i] = v
            	}
                data = addData;
            }
            that.family.addPersonFamily(data).success(function (res){
                A.widget.loading.hide();
                A.alert('修改成功！');
                var table = that.table;
                table._endEditing(rowIndex);
                if(!id){//如果是新增家属信息，更新页面数据对应行的id
                    table.data[rowIndex].id = res.id;
                }
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                    that.loadData();
                });
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        delFamilyInfo: function(rowIndex, id){
        	var that = this;
            that.family.deletePersonFamily(id).success(function (res){
                //删除成功，删除页面上对应的行数据
                that.table.delRow(rowIndex);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                    that.delFamilyInfo(rowIndex, id);
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
