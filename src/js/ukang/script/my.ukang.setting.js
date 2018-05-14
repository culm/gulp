;(function (A) {
    var U = A.ukang,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, {
        cardType: '0',
        isEditBasicInfo: false,
        onReady: function () {
            var that = this;
            that.setting=A.service.setting;
            that.initData();
            that.login= A.service.login;
        },
        initData: function(){
        	var that = this;
            A.login.init();
            that.initHeader(function(){
                that.loadData();
                that.initEvent();
                // A.login.show(function(user){
                //     that.onLogin(user);
                //     that.loadData();
                // });
            });
            
        },
        initEvent: function(){
            var that = this;
            
            $('.edit-basicinfo').on('click', function(){
                that.editBasicInfo();
            });
            $('.edit-insuranceinfo').on('click', function(){
                that.editInsuranceInfo();
            });
            // $('#form-basicinfo').on('click', '.upload-cardPic', function(event) {
            //     $('#upload-cardPic').click();
            // })
            $('.img-thumbnail').on('click', function(event) {
                $('#exampleInputFile').click();
            });
            // that.cardUploader = new A.widget.fileupload({
            //     container: '#upload-cardPhoto',
            //     path: that.ServerPath + 'upload/image/save',
            //     accept: 'image/jpeg,image/x-png',
            //     title: '请选择上传 png/jpg 图片',
            //     // enabled: false,
            //     onShowFile: function(dataKey, src){
            //         $('#upload-cardPhoto label').css('background-image', 'url(' + src + ')');
            //         $('#upload-cardPhoto').addClass('customer-fileupload');
            //         return false;
            //     },
            //     onUploadError: function(){
            //         A.alert('上传文件失败');
            //     },
            //     onUploadSuccess: function(ret, file){
            //         that.cardPhoto = ret.imageList[0];
            //     }
            // });
            that.accountUploader = new A.widget.fileupload({
                container: '#upload-accoutBook',
                path: that.ServerPath + 'upload/image/save',
                accept: 'image/jpeg,image/x-png',
                title: '请选择上传 png/jpg 图片',
                // enabled: false,
                onShowFile: function(dataKey, src){
                    $('#upload-accoutBook label').css('background-image', 'url(' + src + ')');
                    $('#upload-accoutBook').addClass('customer-fileupload');
                    return false;
                },
                onUploadError: function(){
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    // that.cardPhoto = ret.imageList[0];
                }
            });
            that.bankUploader = new A.widget.fileupload({
                container: '#upload-bankPhoto',
                path: that.ServerPath + 'upload/image/save',
                accept: 'image/jpeg,image/x-png',
                title: '选择上传 png/jpg 图片',
                // enabled: false,
                onShowFile: function(dataKey, src){
                    $('#upload-bankPhoto label').css('background-image', 'url(' + src + ')');
                    $('#upload-bankPhoto').addClass('customer-fileupload');
                    return false;
                },
                onUploadError: function(){
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    that.bankPhoto = ret.imageList[0];
                }
            });
            that.photoUploader = new A.widget.fileupload({
                container: '#upload-avatar',
                accept: 'image/gif,image/jpeg,image/x-png',
                title: '你可以选择 png/jpg/gif 图片（建议大小140*140）',
                path: that.ServerPath + 'upload/image/save',
                onShowFile: function(dataKey, src){
                    $('#upload-avatar label').css('background-image', 'url(' + src + ')');
                    return false;
                },
                onUploadError: function(){
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    that.saveInfo({
                        data: {"photo":ret.imageList[0]}
                        // success
                    })
                }
            });
            var autoComplete = new A.widget.AutoComplete('#insurance-company', {
                getTitleHtml:function(type){
                    return '<span class="title">输入医保公司名字或↑↓选择</span>';
                },
                PageCount:10,
                ShowNavigate: 1,
                pageIndex:0,
                // SearchSource:0,//0:从网站搜索,1:从百度地图去数据
                GetUrl: function(){ return that.ServerPath + "/RestServiceCall/InsuranceService/getInsuranceCompanyList  "; },
                dataType: 'JSON',
                ajaxType: 'get',
                customerJsonData: function(res){
                    return {Data: res.companyList||[], total: Math.ceil(res.total/10)};
                },
                getRequestData: function(){
                    var data = {
                        "name" : this.target.val(),
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
                        that.companyName = item.name;
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
                GetDefaultValue: function(){return '保险公司名字';},
                DefaultData: [[{
                    id: 1,name: "平安保险",code:'0001'
                }]]
            });
            that.resizeHeight();
            // that.editTable();
            that.mobileModify();
        },
        loadData: function(){
            var that = this;
            that.setting.getPersonBasicInfo().success(function (res){
                that.showData(res);
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                    that.loadData();
                });
            }).fail(function (){
                //A.alert('获取基本信息失败，请重试！');
                location.href = 'index.html';
            }); 
        },
        showData: function(data){
            var that = this;
            that.userData = data;
            if(data.photo){//个人图像
                $('#upload-avatar label').css('background-image', 'url(' + that.ServerPath + 'upload/download?fileName=' + data.photo + ')');
            }
            if(data.name){//名字
                $('#username').html(data.name);
            }
            if(data.mobile){// 手机号
                var oldMobile = '****'+data.mobile.substr(7,10)
                $('#mobile').html(data.mobile);
                $('#oldMobile').attr('placeholder',oldMobile).attr('mobile',data.mobile);
            }
            // var cardType = data.cardType;
            // if(cardType){//证件类型
            //     that.cardType = cardType;
            //     $('.groupTab button').find(cardType).addClass('btn-info').siblings('button').removeClass('btn-info')
            //     // var text = $('.dropdown-edit li').eq(that.cardType).find('a').text();
            //     // $('#guanxi').html(text+'<span class="caret"></span>')
            // }
            if(data.cardNo){//证件号码
                $('#infoLegalize .btn').eq(0).addClass('btn-success').val('已认证').html('已认证');
                $('#cardno').html(data.cardNo);
            }
            // if(data.cardPhoto){//证件图片
            //     that.cardPhoto = data.cardPhoto;
            //     $('#upload-cardPhoto label').css('background-image', 'url(' + that.ServerPath + 'upload/download?fileName=' + data.cardPhoto + ')');
            //     $('#upload-cardPhoto').addClass('customer-fileupload');
            // }
            if(data.insuranceCompany){//报销公司名字
                that.companyName = data.insuranceCompany;
                $('#insurance-company').val(data.insuranceCompany).removeClass('defaultColor');
            }
            if(data.bankPhoto){//银行卡图片
                that.bankPhoto = data.bankPhoto;
                $('#upload-bankPhoto label').css('background-image', 'url(' + that.ServerPath + 'upload/download?fileName=' + data.cardPhoto + ')');
                $('#upload-bankPhoto').addClass('customer-fileupload');
                $('#infoLegalize .btn').eq(1).addClass('btn-success').html('已认证');
            }
            if(data.bankNo){//银行卡号码
                $('#bankno').val(data.bankNo);
            }
        },
        // editTable:function(){
        //     var that = this,
        //         infoSetting = $('.infoSetting a');
        //     $('.groupTab button').on('click', function(event) {
        //         var _this = $(this),i = _this.index();
        //         _this.addClass('btn-info').siblings('button').removeClass('btn-info');
        //         that.cardType = _this.attr('data-value');
        //     });
        //     $('#runSocial').on('click', function(event) {
        //         infoSetting.eq(1).click();
        //     });
        //     $('#runInsurance').on('click', function(event) {
        //         infoSetting.eq(2).click();
        //     });
        // },
        editInsuranceInfo: function(){
            var that = this;
            if(!that.isEditInsuranceInfo){//非编辑状态，进入编辑状态
                $('#form-insurance [disabled]').removeAttr('disabled');
                that.bankUploader.enable();
                that.isEditInsuranceInfo = true;
                $('.edit-insuranceinfo').html('保存');
                return;
            }
            // else{
                if(!that.checkPattern('#form-insurance')) return;
                if(!that.bankPhoto){
                    A.alert('请上传银行卡图片');
                    return;
                }
                if(!that.companyName){
                    A.alert('请选择保险公司');
                    return;
                }
                var data = {
                    bankPhoto: that.bankPhoto,
                    bankNo: $('#bankno').val().trim(),
                    insuranceCompany: that.companyName
                }
                //{"name":name,"cardNo":cardNo,"cardType":cardType}
                that.saveInfo({
                    data: data,
                    msg: '数据提交中...',
                    success: function(){
                        A.alert('数据提交成功！');
                        that.isEditInsuranceInfo = false;
                        $('#form-insurance .edit').attr('disabled', 'disabled');
                        that.bankUploader.disable();
                        $('.edit-insuranceinfo').html('编辑');
                    },
                    error: function(){
                        A.alert('数据提交失败，请重试！');
                    }
                });
            //}
        },
        editBasicInfo: function(){
            var that = this;
            // if(!that.isEditBasicInfo){//非编辑状态，进入编辑状态
            //     $('#form-basicinfo [disabled]').removeAttr('disabled');
            //     $('#form-basicinfo .disabled').removeClass('disabled')
            //     that.cardUploader.enable();
            //     // that.isEditBasicInfo = true;
            //     $('.edit-basicinfo').html('保存');
            // }else{
                if(!that.checkPattern('#form-basicinfo')) return;
                if(!that.cardPhoto){
                    A.alert('请上传证件图片');
                    return;
                }
                var data = {
                    name: $('#username').val().trim(),
                    cardNo: $('#cardno').val().trim(),
                    cardType: that.cardType,
                    cardPhoto: that.cardPhoto
                }
                //{"name":name,"cardNo":cardNo,"cardType":cardType}
                that.saveInfo({
                    data: data,
                    msg: '数据提交中...',
                    success: function(){
                        A.alert('数据提交成功！');
                        // that.isEditBasicInfo = false;
                        // $('#form-basicinfo .edit').attr('disabled', 'disabled');
                        // $('#form-basicinfo .dropdown-toggle').addClass('disabled');
                        that.cardUploader.disable();
                        // $('.edit-basicinfo').html('编辑');
                    },
                    error: function(){
                        A.alert('数据提交失败，请重试！');
                    }
                });
            //}
        },
        /**
        * 提交个人信息
        * option.data: 提交的数据
        */
        saveInfo: function(option){
            var that = this;
            if(option.msg) {
                A.widget.loading.show({message: option.msg});
            }
            that.setting.modifyPersonBasicInfo(option.data).success(function (res){
                A.widget.loading.hide();
                //提交成功
                if(option.success) option.success();
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                    that.loadData();
                });
            }).fail(function (res){
                A.widget.loading.hide();
                if(option.error) option.error();
            });            
        },
        /**
        * 修改手机号
        */
        mobileModify: function(){
            var that = this;
            //$('').appendTo(document.body);  
            $('#mobileModifyBtn').on('click', function(event) {
                var form = $(this).closest('form'); 
                var jsonData={
                    oldMobile: form.find('#oldMobile').attr('mobile'),
                    mobile: form.find('#mobile').val(),
                    validateCode : form.find('#mobile-code').val()
                };
                that.login.fastRegisterByMobile(jsonData).success(function (res){
                    A.alert('修改成功');
                        location.href = location.href;
                }).fail(function (){
                    A.alert('修改失败！');      
                });
            });
            $('#onMobileModify').on('click', function(event) {
                $('.modal').modal('hide');
                $('#mobileModify').on('hidden.bs.modal', function(){
                    // $('#loginmodel').modal('show');
                }).on('shown.bs.modal', function(){
                    A.login.center($(this));
                }).modal('show');
            });
            $('.phoneMsg3').getMobileCode();
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
