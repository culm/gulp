;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.ukang, {
        /**
        * 选中的医院
        */
        selectedHospital: null,
        upload : A.service.upload,
        imgs : {
            imgs100: [],//处方
            imgs200: [],//门诊收据
            imgs300: [],//住院收据
            imgs400: [],//药房收据
            imgs500: [],//门诊病历
            imgs600: [],//出院小结
            imgs700: [],//增值税发票
            imgs800: [],//北京门特
            imgs900: [],//门诊结算单
            imgs910: [],//住院结算单
            imgs1000: [],//身份证
            imgs3000: [],//理赔申请书                        
        },
        onReady: function () {
            var that = this;
            that.initData();
            that.initEvent();
        },
        initData: function(){
        	var that = this;
            //关闭登录框时，不返回index页面
            A.login.logoutPage = null;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            });
        },
        initEvent: function(){
        	var that = this;
        	$('#submit').on('click', function(){
                that.onSubmit();
        	});
            $('.tenantId').on('change', function(event) {
                $('#tenantId').val($(this).val())
            });
            var autoComplete = new A.widget.AutoComplete('#hospitalname', {
                getTitleHtml:function(type){
                    return '<span class="title">输入医院名字或↑↓选择</span>';
                },
                PageCount:10,
                ShowNavigate: 1,
                pageIndex:0,
                // SearchSource:0,//0:从网站搜索,1:从百度地图去数据
                GetUrl: function(){ return that.ServerPath + "searchTenantList"; },
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
                        that.selectedHospital = item;
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
                GetDefaultValue: function(){return '医院名字';}
            });
            // 处方
            that.fileupload100 = that.initFileupload('#fileupload-container100', '100');
            // 门诊收据
            that.fileupload200 = that.initFileupload('#fileupload-container200', '200')
            // 住院收据
            that.fileupload300 = that.initFileupload('#fileupload-container300', '300')
            // 住院清单
            that.fileupload400 = that.initFileupload('#fileupload-container400', '400')
            // 门诊病历
            that.fileupload500 = that.initFileupload('#fileupload-container500', '500');
            // 出院小结
            that.fileupload600 = that.initFileupload('#fileupload-container600', '600')
            // 增值税发票
            that.fileupload700 = that.initFileupload('#fileupload-container700', '700')
            // 北京门特
            that.fileupload800 = that.initFileupload('#fileupload-container800', '800')
            // 门诊结算单
            that.fileupload900 = that.initFileupload('#fileupload-container900', '900')
            // 住院结算单
            that.fileupload910 = that.initFileupload('#fileupload-container910', '910')            
            // 身份证
            that.fileupload1000 = that.initFileupload('#fileupload-container1000', '1000')
            // 理赔申请书
            that.fileupload3000 = that.initFileupload('#fileupload-container3000', '3000')
        },
        initFileupload: function(container, type){
            var that = this;
            return new A.widget.fileupload({
                type: type,
                container: container,
                path: that.ServerPath + 'upload/image/save',
                title: '图片请选择jpg、png、tiff类型',
                onUploadError: function(){
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    var imgName = ret.imageList[0],
                        key = this._getkey(file),
                        option = this.options;
                    that.imgs['imgs' + option.type].push(imgName);
                    if(file.type == 'image/tiff'){//用上传的图片替换目前的tiff图片
                        var img = new Image();
                        img.src = that.ServerPath + 'upload/download?fileName=' + imgName;
                        img.onload = function(){
                            $('div[data-key="' + key + '"]').next().prop('src', this.src);
                        }
                        img.style.display = 'none';
                        document.body.appendChild(img);
                    }
                    $(option.container + ' div[data-key="' + key + '"]').attr('data-url', imgName);
                },
                onRemove:function(target){
                    var option = this.options,
                        imgs = that.imgs['imgs' + option.type];
                    var index = imgs.indexOf($(target).data('url'));
                    if (index > -1) {
                        imgs.splice(index, 1);
                    }
                }
            });
        },
        checkForm: function(){
            var that = this;
            var name = $('#hospitalname').val().trim();
            if(name == '' || !that.selectedHospital){
                $('#hospitalname').focus();
                return false;
            }
            if(!that.fileupload100.hasFinished() ||
                !that.fileupload200.hasFinished() ||
                !that.fileupload300.hasFinished() ||
                !that.fileupload400.hasFinished() ||
                !that.fileupload500.hasFinished() ||
                !that.fileupload600.hasFinished() ||
                !that.fileupload700.hasFinished() ||
                !that.fileupload800.hasFinished() ||
                !that.fileupload900.hasFinished() ||
                !that.fileupload910.hasFinished() ||
                !that.fileupload1000.hasFinished() ||
                !that.fileupload3000.hasFinished()){
                return false;
            }
            if(that.imgs.imgs100.length == 0 && 
                that.imgs.imgs200.length == 0 && 
                that.imgs.imgs300.length == 0 && 
                that.imgs.imgs400.length == 0 && 
                that.imgs.imgs500.length == 0 && 
                that.imgs.imgs600.length == 0 && 
                that.imgs.imgs700.length == 0 && 
                that.imgs.imgs800.length == 0 && 
                that.imgs.imgs900.length == 0 && 
                that.imgs.imgs910.length == 0 && 
                that.imgs.imgs1000.length == 0 && 
                that.imgs.imgs3000.length == 0){
                A.alert('请上传扫描的处方、收据图片');
                return false;
            }
            var login = A.login;
            if(!login.loginStatus){
                login.show(function(user){
                    that.onLogin(user);
                    that.onSubmit();
                });
                return false;
            }
            return true;
        },
        checkSelf:function(){
            var that = this;
            $('.modal').modal('hide');
            $('#checkSelf').modal('show');
            that.photograph = A.ukang.photograph({
                canvas:'canvas',
                video:'video',
                graph:'snap',
                imgX: 200,
                imgY: 200,
                callback:function(url){
                    $('#canvas').animate({'left': '300px','margin-left': 0,'opacity': 1},300);
                    $('#video').animate({'left': '50px','margin-left': 0},300);
                }
            });
            return true;
        },
        onSubmit: function(){
            var that = this;
            if(!that.checkForm()){
                return;
            }

            var imgs = [];
            A.each(that.imgs, function(key, val){
                A.each(val,function(index,src){
                    imgs.push({imageName: src, type: key.split('imgs')[1]});
                })
            })
            A.widget.loading.show({message: '数据上传中...'});
            var data = {
                tenantId : $('#tenantId').val(),
                hospitalId : that.selectedHospital.id,
                imageList : imgs
            }
            that.upload.submitUploadInfo(data).success(function (res){
                        //清空当前页面的数据
                        A.each(that.imgs,function(key, val) {
                            that.imgs[key] = []
                            that['fileupload' + key.split('imgs')[1]].initData();
                        });
                        that.selectedHospital = '';
                        $('#hospitalname').val('');

                        A.widget.dialog.show({
                            title: '提示',
                            modalType: '',
                            modalDialog: 'modal-sm',
                            message: '提交理赔单成功，是否再次提交?',
                            buttons:[
                                {text: '继续提交', class: 'btn btn-default btn-ref', value: 0, dismiss: 'modal'},
                                {text: '查看理赔单', class: 'btn btn-primary  btn-list', value: 1}
                            ],
                            onClick: function(value, e){
                                if(value == 1){
                                    location.href = 'order.html';
                                }
                            }
                        });
                    A.widget.loading.hide();
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                    that.onSubmit();
                });
            }).fail(function (res){
                A.widget.loading.hide();
                if(res.rtnCode === '-3'||res.rtnCode === '-1'||res.rtnCode === '-2'){
                        A.alert('无法识别处方图片, 请上传正确的图片');
                    }else if(res.rtnCode === '-4'){
                        A.alert('亲，您的图片已经ps过！\n['+res.pictureList[0]+']');
                    }else if(res.rtnCode === '-5'){
                        A.alert('亲，您上传的图片已经在我们理赔名单里！\n【'+res.pictureList[0]+'】');
                    }
                A.alert('上传失败，请重新上传');
            });
        }
    });
    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
