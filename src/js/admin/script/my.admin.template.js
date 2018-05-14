;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
    	items: [],
    	keyItems: {},
        UploadPhoto:'',
        testTemplateImg:'',
        oldPhoto:'',
        originalImagePath:'',
        count: 0,
        jsonJiaozheng:[],
        typeVal:'',
        keyT:'',
        tempType:'',
        hospitalId:'',
        title_image:[],
        onReady: function () {
            var that = this;
            that.template=A.service.template;
            that.createItemData(); //初始化数据
            that.initEvent();
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            });
            that.templateId=A.getQueryString('id');
            //查看和复制模板时禁用voucherType类型选框
            if(A.getQueryString('id')){$('#voucherType').attr('disabled','disabled')};
            that.clone=A.getQueryString('clone');
            //查看模板时禁用医院和地区选择
            if(A.getQueryString('id') && (!A.getQueryString('clone'))){
                $('#hospitalName').attr('disabled','disabled');
                $('#provinceSelector').attr('disabled','disabled');
                $('#citySelector').attr('disabled','disabled');
                $('#countySelector').attr('disabled','disabled');
            };
            that.loadData(that.templateId);
            A.widget.provinceCity.init();
            // that.checkHospital();
            //显示从其他医院载入
            if(!that.templateId)
            {
                $('#otherHosLoad').show();
            }
        },
        initEvent: function(){
        	var that = this,
        		target = $('#templatecontainer')[0];
        	A.on(this, 'mousedown', target);
        	A.on(this, 'click', target);
            that.dragImg();
        	$('#add-item').on('click', function(){
        		that.showNewItem();
        	});
        	$('#save-template').on('click', function(){
        		that.saveTemplate();
        	});
            $('#templatecontainer').attr('tabindex', 1).keydown(function (ev){
                var keyT=that.keyT;
                //如果是校正 显示
                var Mark=$('#voucherType option:selected').attr('mark');
                if(Mark=='jiaozheng')
                {
                }
                that.keyMove(ev,keyT);
                return false;
            });
            $('#autoJiaoZheng').on('click', function(event) {
                A.widget.loading.show("自动矫正中")
                that.autoCorrect()
            });
            //判断选择项
            var Mark=$('#voucherType option:selected').attr('mark');
            if(Mark=='jiaozheng')
            { 
                $('#jiaozhengBtn').show();
                //自动校正，手动校正显示
                $('.loadOriginal').show();
                $('.manualLevel').show();
                $('.scaleImg').show();
                $('.point').show();
                $('.correctCharSize').show();
            }
            //点击矫正矫正图片
            $('#jiaozhengBtn').on('click', function(){
                that.correctImage();
            });
            //从其他医院载入
            $('#otherHosLoad').click(function (){
                var voucherTypeXml=$('#voucherType option:selected').text();
                if(voucherTypeXml=='请选择')
                {
                    A.alert('请选择类型');
                    return;
                }
                if($('#hospitalName').val()=='')
                {
                    A.alert('请填写医院名称');
                    return;
                }
                 that.newTemplateData();   
            });
            //测试模板 测试
            $('.testTemplateBtn').click(function (){
                that.testTemplate();
            });
            $('.closeTemp').click(function (){
                $('.testTemplate').hide();
            });

           //载入原图
           $('.loadOriginal').click(function (){
                var originalImagePath=that.ServerPath+'upload/downloadNamePhoto?fileName='+that.originalImagePath;
                $('#templatecontainer .templateimg').attr('src',originalImagePath);
           });
           //手动拉平
           $('.manualLevel').click(function(){
                that.correctTemplateImage();   
           });
           //按字体大小校正
           $('.scaleImg').click(function(){
                that.correctCharSize();
           });
            var jsonval={
                '100':[],
                '110':[],
                '120':[],
                '130':[],
                '140':[],
                '200':[],
                '210':[],
                '220':[],
                '230':[],
                '300':[],
                '310':[],
                '400':[],
                '410':[],
                '810':[],
                '820':[]
            }

            $('#voucherType').on('change', function (){
                if($('#voucherType').val()==''){
                    A.alert('请先选择类型');
                }else{
                    if(!that.photoUploader)
                    {
                        that.photoUploader = new A.widget.fileupload({
                            container: '#upload-avatar',
                            accept: 'image/gif,image/jpeg,image/x-png',
                            title: '你可以选择 png/jpg/gif 图片（建议大小140*140）',
                            path: that.ServerPath+'upload/batchUploadTemplateImg',
                            batchVal: '1',
                            onShowFile: function(dataKey, src){
                                A.widget.loading.show({message: '图片上传中...'});
                                return false;
                            },
                            onUploadError: function(){
                                A.widget.loading.hide();
                                A.alert('上传文件失败');
                            },
                            onUploadSuccess: function(ret, file){
                                A.widget.loading.hide();
                                that.UploadPhoto=ret.imageList[0];
                                if(that.UploadPhoto)
                                {
                                    $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+that.UploadPhoto);
                                }
                                if($('#voucherType option:selected').attr('mark')=='jiaozheng')
                                {
                                    that.autoCorrectTemplate(that.UploadPhoto);
                                }   
                            }
                        });
                    }
                    //判断类型
                    var Mark=$('#voucherType option:selected').attr('mark');
                    if(Mark=='jiaozheng')
                    {
                        $('#jiaozhengBtn').show();
                        //自动校正，手动校正显示
                        $('.loadOriginal').show();
                        $('.manualLevel').show();
                        $('.scaleImg').show();
                        $('.point').show();
                        $('.correctCharSize').show();
                    }
                    else
                    {
                        $('#jiaozhengBtn').hide();
                        //自动校正，手动校正显示
                        $('.loadOriginal').hide();
                        $('.manualLevel').hide();
                        $('.scaleImg').hide();
                        $('.point').hide();
                        $('.correctCharSize').hide();
                    }
                    //修改类型时，保留每次改变之前的数据
                    var lastTypeVal=that.typeVal;
                    that.typeVal=$('#voucherType').val();
                    if(lastTypeVal=='')lastTypeVal=that.typeVal;
                    jsonval[lastTypeVal]=that.items;
                    that.items=[];
                    $('#templatecontainer .template-item').remove();
                    for(var i in jsonval)
                    {
                        if(that.typeVal==i && jsonval[i][0])
                        {
                           that.items=jsonval[i];
                            var j=jsonval[i];
                            A.each(j,function (index,x){
                                document.getElementById('templatecontainer').appendChild(that.getDiv(x));
                            }); 
                        }
                    }
                }
            });
            $('#upload-avatar').click(function (){
                if($('#voucherType').val()=='')
                {
                    A.alert('请先选择类型');
                }
                that.photoUploader = new A.widget.fileupload({
                    container: '#upload-avatar',
                    accept: 'image/gif,image/jpeg,image/x-png',
                    title: '你可以选择 png/jpg/gif 图片（建议大小140*140）',
                    path: that.ServerPath+'upload/batchUploadTemplateImg',
                    batchVal: '1',
                    onShowFile: function(dataKey, src){
                        A.widget.loading.show({message: '图片上传中...'});
                        return false;
                    },
                    onUploadError: function(){
                        A.widget.loading.hide();
                        A.alert('上传文件失败');
                    },
                    onUploadSuccess: function(ret, file){
                        A.widget.loading.hide();
                        that.UploadPhoto=ret.imageList[0];
                        if(that.UploadPhoto)
                        {
                            $('#autoJiaoZheng').show();
                            $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+that.UploadPhoto);
                        }
                        if($('#voucherType option:selected').attr('mark')=='jiaozheng')
                        {
                            that.autoCorrectTemplate(that.UploadPhoto);
                        }   
                    }
                });
            });
            
            that.photoUploader2 = new A.widget.fileupload({
                container: '#uploadTempTemplateImg',
                accept: 'image/gif,image/jpeg,image/x-png',
                title: '你可以选择 png/jpg/gif 图片（建议大小140*140）',
                path: that.ServerPath+'upload/batchUploadTempTemplateImg',
                onShowFile: function(dataKey, src){
                    A.widget.loading.show({message: '图片上传中...'});
                    return false;
                },
                onUploadError: function(){
                    A.widget.loading.hide();
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    A.widget.loading.hide();
                    $('.testTemplate').show();
                    if(ret.imageList[0])
                    {
                        that.testTemplateImg=ret.imageList[0];
                        $('.largeImage img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName=/mydata/lpt/templates/temp/'+that.testTemplateImg);
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
                        //插入属性医院ID
                        that.hospitalId = item.id;
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
            

            //增加定位图片
            that.photoUploadTitleImage = new A.widget.fileupload({
                container: '#add-title-image-btn',
                accept: 'image/gif,image/jpeg,image/x-png',
                title: '你可以选择 png/jpg/gif 图片（建议大小140*140）',
                path: that.ServerPath+'upload/uploadTitleImg',
                onShowFile: function(dataKey, src){
                    A.widget.loading.show({message: '图片上传中...'});
                    return false;
                },
                onUploadError: function(){
                    A.widget.loading.hide();
                    A.alert('上传文件失败');
                },
                onUploadSuccess: function(ret, file){
                    A.widget.loading.hide();
                    that.title_image.push(ret.imageList[0]);//add data
                    that.showUploadTitleImg(ret.imageList[0]);//add view
                    console.log(that.title_image); 
                }
            });
            //删除定位图片
            $('.title_image_list').on('click','.close',function() {
                var _data = {
                    id : A.getParams().id,
                    picName : $(this).attr('data')
                }
                that.template.deleteTitleImg(_data);
                //delete data
                A.each(that.title_image, function(key, data){
                    if(data == _data.picName) that.title_image.splice(key,1); return;
                }); 
                //delete view
                $(this).parent().remove();
                console.log(that.title_image);
            });

            if(A.getParams().id) return;
            that.setParams(A.getParams());
        },
        showTitleImageList:function(data){
            var that = this;
            var title_image_arr = data.split(','),
                len = title_image_arr.length,
                tpl = '',
                num = 0;
            for(var i = 0 ; i < len ; i++){
                num = i+1;
                tpl = tpl + '<li class="list-group-item"><span>定位图片:</span><img src="'+ that.ServerPath + 'upload/downloadNamePhoto?fileName=' +title_image_arr[i] +'"/><button data="'+ title_image_arr[i] +'" type="button" class="close">&times;</button></li>';
            }
            $('.title_image_list ul').html(tpl);
        },
        showUploadTitleImg:function(data){
            var that = this;
            var tpl = '<li class="list-group-item"><span>定位图片:</span><img src="'+ that.ServerPath + 'upload/downloadNamePhoto?fileName=' + data +'"/><button data="'+ data +'" type="button" class="close">&times;</button></li>';
            $('.title_image_list ul').append(tpl);            
        },
        correctImage:function (){
            var that=this;
            var dataTem = [];
            var typeMark=$('#voucherType option:selected').attr('typeMark');
            A.each(that.keyItems, function(key, item){
                item[item.key] = [];
                dataTem.push(item);
            });
            var innerY,outerY,innerW,innerH,outerW,outerH,delta;
            A.each(that.items, function(index, item){
                item.x=parseInt(item.x),item.y=parseInt(item.y),item.w=parseInt(item.w),item.h=parseInt(item.h);
                if(item.name=='inner'){innerY=item.y; innerW=item.w; innerH=item.h;};
                if(item.name=='outer'){outerY=item.y; outerW=item.w; outerH=item.h;};
                if(item.key) return;
                if(item.path){
                    var pathItem = that.keyItems[item.path];
                    pathItem[pathItem.key].push(item);
                }else{
                    dataTem.push(item);
                }
            }); //width:1660
            var Houter=parseInt(outerH*1660/outerW); //外高
            var Winner=parseInt(innerW*1660/outerW); //内宽
            var Hinner=parseInt(innerH*1660/outerW); //内高
                delta=innerY-outerY;
            var del=parseInt(1660*delta/outerW);
            if((that.items[0] && that.items[0].name=='inner') || (that.items[0] && that.items[0].name=='outer')){
                dataTem.push({'name':'correct','Wouter':outerW,'Houter':outerH,'Winner':innerW,'Hinner':innerH,'delta':delta});  
            }

            if(!that.UploadPhoto){
                A.alert('请先上传图片');
                return;
            };
            if($('#provinceSelector').val()=='')
            {
                A.alert('请先选择省份');
                return;
            }

            var data={
                type: $('#voucherType').val(),
                img: that.UploadPhoto,
                hospital:'',
                province: $('#provinceSelector').val(),
                content: A.toJSON(dataTem)
            };
            that.template.correctImage(data).success(function (res){
                $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+res.correctImagePath);
            }).notLogin(function (res){
                
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });
        },
        saveTemplate: function(){
            var that = this,
                dataTem = [];
            //如果是处方，医院必填，如果是收据，省市必填
            var voucherTypeVal=$('#voucherType').val();
            var typeMark=$('#voucherType option:selected').attr('typeMark');
            var voucherTypeXml=$('#voucherType option:selected').text();

            var img=$('.templateimg');
            if(voucherTypeXml=='请选择')
            {
                A.alert('请选择类型');
                return;
            }
            else
            {
                if(typeMark=='chufang') //处方
                {
                    //判断医院必填
                    if($('#hospitalName').val()=='')
                    {
                        A.alert('请填写医院名称');
                        return;
                    }
                }
                else if(typeMark=='shouju') //收据
                {
                    //判断省市必填
                    if($('#provinceSelector').val()=='')
                    {
                        A.alert('请选择省份');
                        return;
                    }
                    if($('#citySelector').val()=='')
                    {
                        A.alert('请选择市');
                        return;
                    }
                }
            }
            A.widget.loading.show({message: '数据保存中...'});
        	A.each(that.keyItems, function(key, item){
        		item[item.key] = [];
        		dataTem.push(item);
        	});
            var innerY,outerY,innerW,innerH,outerW,outerH,delta;
        	A.each(that.items, function(index, item){
                item.x=parseInt(item.x),item.y=parseInt(item.y),item.w=parseInt(item.w),item.h=parseInt(item.h);
                if(item.name=='inner'){innerY=item.y; innerW=item.w; innerH=item.h;};
                if(item.name=='outer'){outerY=item.y; outerW=item.w; outerH=item.h;};
        		if(item.key) return;
        		if(item.path){
        			var pathItem = that.keyItems[item.path];
        			pathItem[pathItem.key].push(item);
        		}else{
        			dataTem.push(item);
        		}
        	}); //width:1660
            var Houter=parseInt(outerH*1660/outerW); //外高
            var Winner=parseInt(innerW*1660/outerW); //内宽
            var Hinner=parseInt(innerH*1660/outerW); //内高
                delta=innerY-outerY;
            var del=parseInt(1660*delta/outerW);
            if((that.items[0] && that.items[0].name=='inner') || (that.items[0] && that.items[0].name=='outer')){
                dataTem.push({'name':'correct','Wouter':outerW,'Houter':outerH,'Winner':innerW,'Hinner':innerH,'delta':delta});  
            }
            var data={
                hospital:$('#hospitalName').val(), 
                province:$('#provinceSelector').val(),
                city:$('#citySelector').val(),
                contry:$('#countySelector').val(),
                type:$('#voucherType').val(),
                year:$('#yearVal').val(),
                img:that.UploadPhoto || that.oldPhoto,
                content:A.toJSON(dataTem),
                titleImg : that.title_image.toString()
            }
            if(that.templateId && !that.clone) //更新
            {
                data.id=that.templateId;
                data.update='update';  
            }
            else //新增
            {
                data.update='add';
            }
            that.template.update(data).success(function (res){
                if(res.title_image)
                {
                    $('.title_image').css('display','inline-block')
                    $('.title_image img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.title_image);
                    
                    that.showTitleImageList(res.title_image);
                }
                if(res.feature_images)
                {
                    $('.feature_images').css('display','inline-block')
                    $('.feature_images img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.feature_images);
                }
                A.widget.loading.hide();
                A.widget.dialog.show({
                    title: '提示',
                    modalType: '',
                    modalDialog: 'modal-sm',
                    message: '保存成功',
                    buttons:[{text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'}],
                    onClick:function(value, e){
                        if(value == 0){
                            //后台将保持的返回的templateid放到rtnMsg中了
                            if(res.rtnMsg){
                                that.templateId=res.rtnMsg;
                            };
                            that.clone = false;
                            //保存成功之后禁用voucherType类型选框
                            $('#voucherType').attr('disabled','disabled');
                            //that.loadData(that.templateId);
                            //location.href='templatelist.html';
                        }
                    }
                });
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            }); 
        },
        createItemData:function (){
            var that=this; 
            that.jsonJiaozheng=[
                {
                    'label':'外框',
                    'name':'outer',
                    'width':'2108',
                    'height':'1480',
                    'delta':'254' 
                },
                {
                    'label':'内框',
                    'name':'inner',
                    'width':'1844',
                    'height':'885',
                    'delta':'254'
                }
            ];
        },
        showNewItem: function(){
        	var that = this;
            var option='';
            var jsonAarr=[];
            var typeMark=$('#voucherType option:selected').attr('typeMark');
            var mark=$('#voucherType option:selected').attr('mark');
            if(!typeMark)
            {
                A.alert('请先选择类型');
                return;
            }
            if($('#hospitalName').val()=='')
            {
                A.alert('请填写医院名称');
                return;
            }
            if(typeMark=='chufang') //处方
            {
                that.tempType='100';
                A.alert('暂时不能新建处方模板');
                return;
            }
            else if(typeMark=='shouju') //收据
            {
                that.tempType='200';
            }
            else if(typeMark=='zhuyuan') //住院
            {
                that.tempType='300';
            }
            else if(typeMark=='fapiao') //明细清单
            {
                that.tempType='400';
                A.alert('暂时不能新建明细清单模板');
                return;
            }
            //矫正处方 jiaozheng-chufang  //矫正收据 jiaozheng-shouju   //矫正住院收据 jiaozheng-zyshouju   //矫正明细清单 jiaozheng-mxqingdan
            if(mark=='jiaozheng') 
            {
                jsonAarr=that.jsonJiaozheng;  //校正单独处理
                var option='';
                for(var i=0;i<jsonAarr.length;i++)
                {
                    option+='<option lang="'+jsonAarr[i].lang+'" type="'+jsonAarr[i].type+'" value="'+jsonAarr[i].name+'">'+jsonAarr[i].label+'</option>';
                }
                that.dialogMessage(option);
            }
            else
            {
                //获取mapping字段
                var mappingData={
                    'paymentType': that.tempType,
                    'hospitalId': that.hospitalId //hosplitalId  
                }
                that.createTemplate(mappingData);
            }   
        },
        createTemplate: function(obj) {
            // obj.paymentType 单据类型
            // obj.hosplitalId 医院id
            var that = this;
            that.template.getTemplate(obj).success(function(res){
                that.test(res.returnObj);
            }).fail(function(res){
                A.alert(res.rtnMsg)
            })
        },
        test:function(res){
            var that = this,
                //mappingBody = $('#select_nameVal'),
                maping1 = res.invoiceTemplateMapping,
                maping2 = res.invoiceDetailTemplateMapping;
                var mappingStr = '';
                var mappingStr1 = '';
                var mappingStr2 = '';
            if(maping1){
                A.each(maping1,function(index, el) {
                    if(index=='DrugDetails')
                    {
                        mappingStr1 +='<option maxLines="'+el.maxLines+'" itemsPerLine="'+el.itemsPerLine+' "key="'+el.key+'" value="'+index+'">'+el.label+'</option>';
                    }
                    else
                    {
                        mappingStr1 +='<option lang="'+el.lang+'" type="'+el.type+'" value="'+index+'">'+el.label+'</option>';
                    }
                                     
                });
                mappingStr1+='';
            }
            if(maping2){
              //副项填值 
                A.each(maping2,function(index, el) {
                    mappingStr2 +='<option lang="'+el.lang+'" type="'+el.type+'" value="'+index+'">'+el.label+'</option>'; 
                });
                mappingStr2 += ''; 
            }
            mappingStr=mappingStr1+mappingStr2;
            that.dialogMessage(mappingStr);
        },
        dialogMessage:function (mappingStr){
            var that=this;
            var message = '\
                <div class="input-group" style="width:100%;">\
                    <select id="select_nameVal" class="form-control">'+mappingStr+'</select>\
                </div>\
                <div class="input-group">\
                        <span class="input-group-addon">label:</span>\
                        <input data-pattern=' + A.toJSON({"^\\S+$":"请输入标签名字"}) + ' id="itemLabel" class="form-control" placeholder="标签名字" />\
                    </div>\
                <input id="itemType_h" type="hidden" class="form-control" />\
                <input id="itemLang_h" type="hidden" class="form-control" />\
                <div class="input-group">\
                    <span class="input-group-addon">name:</span>\
                    <input data-pattern=' + A.toJSON({"^\\S+$":"请输入名字", 'data-checkName':'该名字已经存在'}) + ' id="itemName" class="form-control" placeholder="名字" />\
                </div>\
                <div class="input-group">\
                    <span class="input-group-addon">type:</span>\
                    <select id="itemType" class="form-control">\
                        <option value="0">常规数据</option>\
                        <option value="1">数组</option>\
                    </select>\
                </div>\
                <div class="input-group">\
                    <span class="input-group-addon">父节点:</span>\
                    <select id="itemParent" class="form-control">\
                        <option value=""></option>\
                    </select>\
                </div>\
                <div style="display:none;" class="input-group">\
                    <span class="input-group-addon">key:</span>\
                    <input data-pattern=' + A.toJSON({"data-checkKey":"请输入key的名字"}) + ' id="itemKey" class="form-control" placeholder="名字" />\
                </div>';
            A.widget.dialog.show({
                title: '添加新数据项 ',
                modalType: '',
                modalDialog: 'modal-sm',
                message: message,
                buttons:[{
                    text: '取消', 
                    'class': 'btn btn-default', 
                    value: 0, 
                    dismiss: 'modal'
                },{
                    text: '添加', 
                    'class': 'btn btn-primary', 
                    value: 1
                }],
                events: {
                    'show.bs.modal': function(){
                        //初始化父元素
                        A.each(that.keyItems, function(key, data){
                            $('<option value="' + key + '">' + data.label + '</option>').appendTo('#itemParent')
                        });
                        $('#itemLabel').val('定位图片'); 
                        $('#itemName').val('title');
                        var Mark=$('#voucherType option:selected').attr('mark');
                        if(Mark && Mark=='jiaozheng')
                        {
                            $('#itemLabel').val('外框');
                            $('#itemName').val('outer');
                        }
                        $('#itemType').off('change').on('change', function(){
                            if(this.value == '0'){
                                $('#itemParent').parent().show();
                                $('#itemKey').parent().hide();
                            }else{
                                $('#itemParent').parent().hide();
                                $('#itemKey').parent().show();
                            }
                        });
                        $('#select_nameVal').off('change').on('change',function (){
                            $('#itemLabel').val($('#select_nameVal option:selected').text()); 
                            $('#itemName').val($(this).val());
                            $('#itemType_h').val($('#select_nameVal option:selected').attr('type'));
                            $('#itemLang_h').val($('#select_nameVal option:selected').attr('lang'));
                            //药品列表添加项
                            var selectVal=$('#select_nameVal option:selected').text();
                            if(selectVal=='药品详情列表' || selectVal=='费用明细' || selectVal=='项目明细')
                            {
                                that.key= $('#select_nameVal option:selected').attr('key');
                                that.lineHeight= $('#select_nameVal option:selected').attr('lineHeight');
                                that.maxLines= $('#select_nameVal option:selected').attr('maxLines');
                                that.itemsPerLine= $('#select_nameVal option:selected').attr('itemsPerLine');
                                $('#itemType').val('1');
                                $('#itemParent').parent().hide();
                                $('#itemKey').parent().show();
                                $('#itemKey').val(that.key); 
                            }
                            
                        });
                    }
                },
                onClick: function(value){
                    if(value == '1') that.addItem();
                }
            });
        },
        addItem: function(){
        	var that = this;
        	if(!that.checkPattern($('#itemLabel').parent().parent())){
        		return;
        	}
            if($('#itemType_h').val()=='undefined' || $('#itemType_h').val()=='')
            {
                var d = {
                    'label': $('#itemLabel').val().trim(),
                    'name': $('#itemName').val().trim()
                };
            }
            else
            {
                var d = {
                    'label': $('#itemLabel').val().trim(),
                    'name': $('#itemName').val().trim(),
                    'type': $('#itemType_h').val().trim(),
                    'lang': $('#itemLang_h').val().trim()
                };
            }
        	var itemTypeVal = $('#itemType').val();
        	if(itemTypeVal == '0'){//常规数据
        		d.path = $('#itemParent').val();
        	}else{
        		d.key = $('#itemKey').val().trim();
        	}
            if(that.maxLines && that.lineHeight!='undefined')
            {
                d.maxLines=that.maxLines;
                d.lineHeight=that.lineHeight;
                d.itemsPerLine=that.itemsPerLine;
            }
            if(that.maxLines && that.lineHeight=='undefined')
            {
                d.maxLines=that.maxLines;
                d.itemsPerLine=that.itemsPerLine;
            }
        	var count = that.count + 1;
        		that.count = count;
        		d.index = count + 1;
        	if(itemTypeVal == '1'){
        		that.keyItems[d.name] = d;
        	}
        	that.items.push(d);

        	document.getElementById('templatecontainer').appendChild(that.getDiv(d));
        	A.widget.dialog.hide();
        },
        /**
        * 判断名字是否存在
        **/
        checkName: function(){
        	var that = this;
        	var name = $('#itemName').val().trim();
        	var itemTypeVal = $('#itemType').val();
        	if(itemTypeVal == '0'){
        		var hasName = true;
        		var path = $('#itemParent').val();
        		A.each(that.items, function(index, item){
        			if(path){
        				if(path == item.path && name == item.name){
        					hasName = false;
        					return false;
        				}
        			}else{
        				if(name == item.name) {
        					hasName = false;
        					return false;
        				}
        			}
        		});
        		return hasName;
        	}else{
        		if(that.keyItems[name]){
        			return false;
        		}
        	}
        	return true;
        },
        checkKey: function(){
        	if($('#itemType').val() == '1' && $('#itemKey').val().trim() == '') return false;
        	return true;
        },
        handleEvent: function(e){
        	var that = this;
        	var t = e.target;
        	switch(t.id){
        		case 'attr-add':
        			that.addAttr();
        			return;
        		case 'attr-save':
        			that.saveAttr();
        			return;
        		case 'attr-cancel':
        			that.cancelAttr();
        			return;
        		case 'remove-attr':
        			$(t).parent().parent().remove();
        			return;
        		case 'item-del':
        			that.delItem();
        	}
        	switch(e.type){
        		case 'mousedown':
        			that.onMouseDown(e);
        			return;
        		case 'mousemove': 
        			that.onMouseMove(e);
        			return;
        		// case 'mouseout':
        		case 'mouseup': 
        			that.onMouseUp(e);
        			return;
        		case 'click':
        			that.showItemContainer(e);
        			return;
        	}
        },
        keyMove:function (event,t){
            var that=this;
            event = event || window.event;
            var itemData = that.itemData;
            var left='', top='';
            if(itemData){
                left = itemData.x;
                top = itemData.y;
            }
            var offset = $(t).offset();
            var divx=$('#itemcontainer .attr-items input[data-old="x"]');
            var divy=$('#itemcontainer .attr-items input[data-old="y"]');
            var divw=$('#itemcontainer .attr-items input[data-old="w"]');
            var divh=$('#itemcontainer .attr-items input[data-old="h"]');

            switch (event.keyCode) {
                case 37:
                    t[0].style.left =left-1 + 'px';
                    left=that.itemData.x=parseInt(left)-1; 
                    $('#itemcontainer').css({'left': parseInt(offset.left) + 'px'});
                    $(divx).parents('.col-sm-5').next('.col-sm-5').find('input').val(left);
                    that.saveAttr();
                    break;
                case 38:
                    t[0].style.top =top-1 + 'px';
                    top=that.itemData.y=parseInt(top)-1;
                    $('#itemcontainer').css({'top': parseInt(offset.top) + $(t).height() + 'px'});
                    $(divy).parents('.col-sm-5').next('.col-sm-5').find('input').val(top);
                    that.saveAttr();
                    break;
                case 39:
                    t[0].style.left =left+1 + 'px';
                    left=that.itemData.x=parseInt(left)+1; 
                    $('#itemcontainer').css({'left': parseInt(offset.left) + 'px'});
                    $(divx).parents('.col-sm-5').next('.col-sm-5').find('input').val(left);
                    that.saveAttr();
                    break;
                case 40:
                    t[0].style.top =top+1 + 'px';
                    top=that.itemData.y=parseInt(top)+1;
                    $('#itemcontainer').css({'top': parseInt(offset.top) + $(t).height() + 'px'});
                    $(divy).parents('.col-sm-5').next('.col-sm-5').find('input').val(top);
                    that.saveAttr();
                    break;
            }
            //ctrl+ ↑ ↓ ← → 键增减宽高
            if(event.ctrlKey == true && event.keyCode == 37)
            {
                var width = itemData.w;
                if(width < 10){
                    return;
                }
                t[0].style.width = parseInt(width)+1 + 'px';
                width=that.itemData.w=parseInt(width)+1; 
                $(divw).parents('.col-sm-5').next('.col-sm-5').find('input').val(width);
            }
            if(event.ctrlKey == true && event.keyCode == 38)
            {
                var height = itemData.h;
                if(height < 10){
                    return;
                }
                t[0].style.height = height + 'px';
                height=that.itemData.h=parseInt(height)+1; 
                $(divh).parents('.col-sm-5').next('.col-sm-5').find('input').val(height);
            }
            if(event.ctrlKey == true && event.keyCode == 39)
            {
                var width = itemData.w;
                if(width < 10){
                    return;
                }
                t[0].style.width = parseInt(width)+1 + 'px';
                t[0].style.left = left-1 + 'px';
                left=that.itemData.x=parseInt(left)-1; 
                width=that.itemData.w=parseInt(width)+1; 
                $('#itemcontainer').css({'left': parseInt(offset.left) + 'px'});
                $(divx).parents('.col-sm-5').next('.col-sm-5').find('input').val(left);
                $(divw).parents('.col-sm-5').next('.col-sm-5').find('input').val(width);
                that.saveAttr();
            }
            if(event.ctrlKey == true && event.keyCode == 40)
            {
                var height = itemData.h;
                if(height < 10){
                    return;
                }
                t[0].style.top = top + 'px';
                t[0].style.height = height + 'px';
                top=that.itemData.y=parseInt(top)-1;
                height=that.itemData.h=parseInt(height)+1; 
                $('#itemcontainer').css({'top': parseInt(offset.top) + $(t).height() + 'px'});
                $(divy).parents('.col-sm-5').next('.col-sm-5').find('input').val(top);
                $(divh).parents('.col-sm-5').next('.col-sm-5').find('input').val(height);
                that.saveAttr();
            }
            return false;
        },
        showItemContainer: function(e){
        	var that = this;
        	if(e.target.className != 'item-content') return;
        	if(that.moved) return;
        	var t = $(e.target.parentNode.parentNode),
        		offset = t.offset();
            if(t && t!='undefined')that.keyT=t;
        	var data = A.parseJSON(e.target.parentNode.parentNode.getAttribute('data'));
                    	
            var html = [];
            var Mark=$('#voucherType option:selected').attr('mark');
            var typeMark=$('#voucherType option:selected').attr('typeMark');
            var xdata1=A.parseJSON($($('.template-item')[0]).attr('data'));
            var xdata2=A.parseJSON($($('.template-item')[1]).attr('data'));
            var Houter,outerW,outerY;

            if(Mark && Mark=='jiaozheng')
            {
               if(xdata1 && xdata1.label=='外框')
            {
                Houter=parseInt(xdata1.h*1660/xdata1.w); 
                outerW=xdata1.w;
                outerY=xdata1.y;
                var odataou={
                    'width':1660,
                    'height':Houter
               }
               odataou={
                    'width':xdata1.w,
                    'height':xdata1.h
               }
            }
            else if(xdata2 && xdata2.label=='外框')
            {
                Houter=parseInt(xdata2.h*1660/xdata2.w);
                outerW=xdata2.w;
                outerY=xdata2.y;
                var odataou={
                    'width':1660,
                    'height':Houter
               }
               odataou={
                    'width':xdata2.w,
                    'height':xdata2.h
               }
            }
            if(xdata1 && xdata1.label=='内框')
            {
                var Winner=parseInt(xdata1.w*1660/outerW); //内宽
                var Hinner=parseInt(xdata1.h*1660/outerW); //内高
                var innerY=xdata1.y;
                var odatain={
                    'width':Winner,
                    'height':Hinner
               }
               odatain={
                    'width':xdata1.w,
                    'height':xdata1.h
               }
            }
            else if(xdata2 && xdata2.label=='内框')
            {
                var Winner=parseInt(xdata2.w*1660/outerW); //内宽
                var Hinner=parseInt(xdata2.h*1660/outerW); //内高
                var innerY=xdata2.y;
                var odatain={
                    'width':Winner,
                    'height':Hinner
               }
               odatain={
                    'width':xdata2.w,
                    'height':xdata2.h
               }
            }
                if(typeMark && data.label=='外框')var odata=odataou;
                if(typeMark && data.label=='内框')var odata=odatain;
                var delta=innerY-outerY;
                var del=parseInt(1660*delta/outerW);
                if(isNaN(del))del='';
                odata.delta=del;
                if(isNaN(delta))delta='';
                    odata.delta=delta;
                A.each(data, function(key, value){
                    if(key!='width' && key!='height' && key!='delta' && key!='w' && key!='h' && key!='path')
                    {
                        odata[key]=data[key];
                    }
                });
                A.each(odata, function(key, value){
                    var keys = {
                        'index': 'disabled',
                        'name': 'disabled',
                        'x': 'disabled',
                        'y': 'disabled'
                    }
                    html.push(template("template-attr-item", {key:key, value: value, disabled: keys[key]}))
                });
            }
            else
            {
                A.each(data, function(key, value){
                    var keys = {
                        'index': 'disabled',
                        'name': 'disabled',
                        'path': 'disabled',
                        'x': 'disabled',
                        'y': 'disabled',
                        'w': 'disabled',
                        'h': 'disabled'
                    }
                    if(key == data['key']) return;
                    if(value == '' && key == 'path') return;
                    html.push(template("template-attr-item", {key:key, value: value, disabled: keys[key]}))
                });
            }
        	$('#itemcontainer .attr-items').html(html.join(''));
        	$('#itemcontainer').css({'left': parseInt(offset.left) + 'px', 'top': parseInt(offset.top) + t.height() + 'px'}).show();
        	A.on(that, 'click', $('#itemcontainer')[0]);
        },
        delItem: function(){
        	var that = this;
        	A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: '是否删除该节点及其附属节点',
                buttons:[{text: '取消', class: 'btn btn-default', value: 0, dismiss: 'modal'}, {text: '确定', class: 'btn btn-danger', value: 1, dismiss: 'modal'}],
                onClick:function(value, e){
                    if(value == '1'){
                    	that._delItem();
                    	that.cancelAttr();
                    }
                }
            });
        },
        _delItem: function(){
        	var that = this;
        	var t = $(that.clickTarget).parent().parent();
        	var data = A.parseJSON(t.attr('data'));
            t.remove();
            if(data.key){
            	var name = data.name;
            	delete that.keyItems[name];
            	A.each($('.template-item[path="' + name + '"]'), function(index, dom){
            		var _this = $(dom);
            		var _data = A.parseJSON(_this.attr('data'));
            		_this.remove();
            		that.removeItem(_data.index);
            	})
            }
            that.removeItem(data.index);
        },
        removeItem: function(removeIndex){
        	var that = this,
        		index = -1;
        	A.each(that.items, function(_index, item){
        		if(item.index == removeIndex) {
        			index = _index;
        			return false;
        		}
        	});
        	if(index >=0){
        		that.items.splice(index, 1);
        	}else{
        		console.log('delete fail:' + id);
        	}
        },
        addAttr: function(){
        	$(template("template-attr-item", {key:'', value: ''})).appendTo('#itemcontainer .attr-items');
        },
        cancelAttr: function(){
        	$('#itemcontainer').hide();
        	A.off(this, 'click', $('#itemcontainer')[0]);
        },
        saveAttr: function(){
        	var that = this;
        	if(!that.checkPattern('#itemcontainer')) return;
        	that.cancelAttr();
        	var allKeys = $('#itemcontainer input.attr-label'),
        		allValues = $('#itemcontainer input.attr-value');
        	var data = {};
        	A.each(allKeys, function(index, label){
        		data[label.value] = allValues[index].value;
        	});
        	$(that.clickTarget).parent().parent().attr('data', A.toJSON(data));
        	var newObj = {};
        	A.extend(newObj, data);
        	A.each(that.items, function(index, item){
        		if(item.index == data.index){
        			that.items[index] = newObj;
        			return false;
        		}
        	});
        	if(data.key){
        		that.keyItems[data.name] = newObj;
        	}
        },
        checkAttrkey: function(target){
        	var t = $(target),
        		value = t.val().trim();
        	var elmes = $('#itemcontainer input.attr-label');
        	var count = 0;
        	A.each(elmes, function(index, t){
        		if(t.value.trim() == value) count ++;
        	});
        	return count == 1;
        },
        onMouseUp: function(e){
        	var that = this;
        	A.off(this, 'mousemove', $('#templatecontainer')[0]);
        	A.off(this, 'mouseup', $('#templatecontainer')[0]);
        	A.off(this, 'mouseout', $('#templatecontainer')[0]);
            var className = that.clickTarget.className;
            //如果是correctCharSize
            if(className.match('correctChar'))
            {
                var correctCharSize=$('.correctCharSize')[0];
                that.correctL=$(correctCharSize).position().left;
                that.correctT=$(correctCharSize).position().top;
                that.correctW=correctCharSize.style.width || correctCharSize.offsetWidth;
                that.correctH=correctCharSize.style.height || correctCharSize.offsetHeight;
                that.correctW=that.correctW.substring(0,that.correctW.length-2);
                that.correctH=that.correctH.substring(0,that.correctH.length-2);
            }
        	// var t = $(e.target.parentNode.parentNode);
        	var t = $(that.clickTarget.parentNode.parentNode);
        	// if(t.className != 'item') t = t.parentNode;
        	var deltaX = parseInt(e.pageX) - that.pointX;
			var deltaY = parseInt(e.pageY) - that.pointY;
			if(deltaX == 0 && deltaY == 0){
				that.moved = false;
			}else{
				that.moved = true;
			}
			var offset = t.offset(),
				poffset = $('#templatecontainer').offset(),
				left = parseInt(offset.left) - parseInt(poffset.left),
				top = parseInt(offset.top) - parseInt(poffset.top),
				width = t.width(),
				height = t.height();
			var itemData = that.itemData;
            if(itemData)
            {
    			itemData.x = left;
    			itemData.y = top;
    			itemData.w = width;
    			itemData.h = height;
    			t.attr('data', A.toJSON(itemData));
    			A.each(that.items, function(index, item){
    				if(item.index == itemData.index){
    					item.x = itemData.x;
    					item.y = itemData.y;
    					item.w = itemData.w;
    					item.h = itemData.h;
    					return false;
    				}
    			});
            }
        },
        onMouseMove: function(e){
        	if(e.pageX > 600){
        		var s = 0;
        	}
			var that = this;
            var className = that.clickTarget.className;
            //如果是correctCharSize
            if(className.match('correctChar'))
            {
                var correctCharSize=$('.correctCharSize')[0];
                var deltaX = parseInt(e.clientX - that.correctClientX);
                var deltaY = parseInt(e.clientY - that.correctClientY);
                // correctOffsetLeft correctOffsetTop correctWidth correctHeight
                if(className.match('correctChar-content')) //移动
                {
                    correctCharSize.style.left=deltaX+parseInt(that.correctLeft)+'px';
                    correctCharSize.style.top=deltaY+parseInt(that.correctTop)+'px';
                }
                else if(className.match('correctChar-right')) //右侧增宽
                {
                    correctCharSize.style.width = deltaX + parseInt(that.correctWidth)+ 'px';
                }
                else if(className.match('correctChar-bottom')) //下侧增高
                {
                    correctCharSize.style.height = deltaY + parseInt(that.correctHeight)+ 'px';
                }
            }
			var t = that.clickTarget.parentNode.parentNode;
			var className = that.clickTarget.className;
			var itemData = that.itemData;
			var deltaX = parseInt(e.pageX - that.pointX);
			var deltaY = parseInt(e.pageY - that.pointY);
            if(itemData)
            {
    			var left = deltaX + parseInt(itemData.x);
    			var top = deltaY + parseInt(itemData.y);
            	if(className == 'item-content'){//移动位置
            		t.style.left = left + 'px';
    				t.style.top = top + 'px';
            	}
            	else if(className == 'item-top'){//顶部上下移动
            		var height = itemData.h - deltaY;
            		if(height < 10){
            			return;
            		}
            		t.style.top = top + 'px';
            		t.style.height = height + 'px';
            	}
            	else if(className == 'item-bottom'){//底部上下移动
            		var height = parseInt(itemData.h) + deltaY;
            		if(height < 10){
            			return;
            		}
            		t.style.height = height + 'px';
            	}
            	else if(className == 'item-left'){//左侧侧左右移动
            		var width = parseInt(itemData.w) - deltaX;
            		if(width < 10){
            			return;
            		}
            		t.style.width = width + 'px';
            		t.style.left = left + 'px';
            	}
            	else if(className == 'item-right'){//右侧左右移动
            		// console.log(deltaX)
            		var width = parseInt(itemData.w) + deltaX;
            		if(width < 10){
            			return;
            		}
            		t.style.width = width + 'px';
            	} 
            } 
        },
        onMouseDown: function(e){
        	$('#itemcontainer').hide();
        	if(e.target.tagName == 'IMG') return;
        	var t = e.target.parentNode.parentNode;
        	// if(t.className != 'item') t = t.parentNode;
        	var that = this;
        	that.moved = false;
        	var itemData = A.parseJSON(t.getAttribute('data'));
            //如果是correctCharSize
            if(e.target.className.match('correctChar'))
            {
                var offsetLeft=$('#templatecontainer').offset().left;
                var offsetTop=$('#templatecontainer').offset().top; 
                that.correctLeft=$('.correctCharSize').position().left;
                that.correctTop=$('.correctCharSize').position().top;
                that.correctClientX=e.clientX;
                that.correctClientY=e.clientY; 
                that.correctOffsetLeft=offsetLeft;
                that.correctOffsetTop=offsetTop;
                that.correctWidth=parseInt($('.correctCharSize').width())+2;
                that.correctHeight=parseInt($('.correctCharSize').height())+2;
            }
            if(itemData)
            {
                itemData.x = parseInt(itemData.x, 10);
                itemData.y = parseInt(itemData.y, 10);
                itemData.w = parseInt(itemData.w, 10);
                itemData.h = parseInt(itemData.h, 10);
                that.itemData = itemData;
            }
        	that.clickTarget = e.target;
        	that.pointX = parseInt(e.pageX);
			that.pointY = parseInt(e.pageY);
        	A.on(that, 'mousemove', $('#templatecontainer')[0]);
        	A.on(that, 'mouseup', $('#templatecontainer')[0]);
        	A.on(this, 'mouseout', $('#templatecontainer')[0]);
        },
        //校验医院名称是否填写
        checkHospital:function (){
            var that=this;
            that.checkBlur('.focus-blur');
        },
        loadData: function(templateId){
            var that = this;
            var id=templateId; //模板id，新建时没有id，修改有id，复制也有id
            if(!id)return; //新建模板不用调接口
            A.widget.loading.show({message: '图片加载中...'});
            that.template.detail(id).success(function (res){
                A.widget.loading.hide();
                if(res.original_image)
                {
                    $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+res.original_image);
                    that.oldPhoto=res.original_image;
                };
                if(res.title_image)
                {
                    $('.title_image').css('display','inline-block')
                    $('.title_image img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.title_image);
                    that.title_image = res.title_image.split(',');
                    that.showTitleImageList(res.title_image);
                }
                if(res.feature_images)
                {
                    $('.feature_images').css('display','inline-block')
                    $('.feature_images img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.feature_images);
                }
                $('#hospitalName').val(res.hospital);
                that.hospitalId = res.hospitalId;
                $('#voucherType').val($.trim(res.type));
                A.widget.provinceCity.init({
                    'selectedProvince':res.province,
                    'selectedCity':res.city,
                    'selectedCounty':res.contry
                });
                A.widget.provinceCity.loadCity(res.province);
                A.widget.provinceCity.loadCounty(res.city);
                if(A.parseJSON(res.content)[2] && A.parseJSON(res.content)[2].name=='correct')
                {
                    var ocont=A.parseJSON(res.content);
                    ocont.pop();
                    that.showData(ocont);
                }else
                {
                    that.showData(res.content);
                };
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        newTemplateData: function (){
            var that=this;
            var data={
                hospitalId: that.hospitalId, 
                type:$('#voucherType').val()
            }
            A.widget.loading.show({message: '图片加载中...'});
            that.template.templateDetail(data).success(function (res){
                A.widget.loading.hide();
                if(res.original_image)
                {
                    $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+res.original_image);
                    if(res.original_image.match('/'))
                    {
                        var _index=parseInt(res.original_image.lastIndexOf('/'))+1;
                        var len=res.original_image.length;
                        var oldPhoto=res.original_image.substring(_index,len);
                        that.oldPhoto=oldPhoto;
                    }
                    else
                    {
                        that.oldPhoto=res.original_image;
                    } 
                };
                if(res.title_image)
                {
                    $('.title_image').css('display','inline-block')
                    $('.title_image img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.title_image);
                    that.showTitleImageList(res.title_image);
                }
                if(res.feature_images)
                {
                    $('.feature_images').css('display','inline-block')
                    $('.feature_images img').attr('src',that.ServerPath+'upload/downloadNamePhoto?fileName='+res.feature_images);
                }
                $('#hospitalName').val(res.hospital);
                $('#voucherType').val($.trim(res.type));
                A.widget.provinceCity.init({
                    'selectedProvince':res.province,
                    'selectedCity':res.city,
                    'selectedCounty':res.contry
                });
                A.widget.provinceCity.loadCity(res.province);
                A.widget.provinceCity.loadCounty(res.city);
                if(A.parseJSON(res.content)[2] && A.parseJSON(res.content)[2].name=='correct')
                {
                    var ocont=A.parseJSON(res.content);
                    ocont.pop();
                    that.showData(ocont);
                }else
                {
                    that.showData(res.content);
                };
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        showData: function(data){
            var data=A.parseJSON(data);
        	var that = this,
        		htmlArr = [],
        		frage = document.createDocumentFragment(),
        		count = 0,
        		items = that.items,
        		keyItems = that.keyItems;
        	A.each(data, function(index, d){
        		if(d.key){
        			keyItems[d.name] = d;
        		}
        		count = index;
    			d.index = index;
    			items.push(d);
        	});
        	A.each(keyItems, function(key, d){
        		A.each(d[d.key], function(_index, _d){
        			_d.path = d.name;
        			count++;
        			_d.index = count;
        			items.push(_d);
        		});
        	});

        	A.each(items, function(index, d){
        		var div = that.getDiv(d);
				frage.appendChild(div);
        	});
        	that.count = count;
        	document.getElementById('templatecontainer').appendChild(frage);
        },
        getDiv: function(data){
        	data.x = parseInt(data.x) || 0;
        	data.y = parseInt(data.y) || 0;
        	data.w = parseInt(data.w) || 100;
        	data.h = parseInt(data.h) ||30;
        	var left = data.x,
        		top = data.y,
        		width = data.w;
        		height = data.h;
        		div = document.createElement('div');
        	div.className = 'template-item';
        	if(data.path){
        		div.setAttribute('path', data.path);
        	}
        	div.setAttribute('data', A.toJSON(data));
        	div.setAttribute('style', 'left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px');
        	div.innerHTML = data.label;
        	div.setAttribute('data-index', data.index);
        	div.innerHTML = '\
        		<div class="item">\
        			<div class="item-top"></div>\
        			<div class="item-left"></div>\
        			<div class="item-content">' + data.label + '</div>\
        			<div class="item-right"></div>\
        			<div class="item-bottom"></div>\
        		</div>';
        	return div;
        },
        setParams:function(params){
            var that = this;
            if(params.type){
                that.UploadPhoto = params.img+'&paymentId='+params.paymentId;
                $('#voucherType').find("option[value="+params.type+"]").attr("selected",true);
                $('#voucherType').change();
                $('#hospitalName').val(params.hospitalName)
                $('#templatecontainer img').attr('src',that.UploadPhoto);
                
            }
        },
        // 测试模板 测试
        testTemplate:function (){
            var that=this;
            $('.testTemplate').show();
            var imgData='/mydata/lpt/templates/temp/'+that.testTemplateImg;
            if(!that.testTemplateImg) //没有上传新图片
            {
                var imgsrc=$('#templatecontainer .templateimg').attr('src');
                imgsrc=imgsrc.split('=')[1];
                imgData='/mydata/lpt/templates/temp/'+imgsrc;
                $('.largeImage img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+imgsrc);    
            }
            
            var data={
                templateId: that.templateId,
                imagePath: imgData
            }
            that.template.testTemplate(data).success(function (res){
                A.widget.loading.hide();
                var images=res.images;
                var html='';
                for(var i=0;i<images.length;i++)
                {
                    html+='<div class="smallLeft"><img src="'+that.ServerPath+'upload/downloadNamePhoto?fileName='+images[i]+'" /><span>'+images[i]+'</span></div>';
                }
                $('.testTemplate .smallImage').html(html);
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        //自动校正
        autoCorrect: function(){
            var that = this;
            var type = function(){
                if(that.typeVal < 300 && that.typeVal > 200){
                    return 200
                }
                if(that.typeVal > 300 && that.typeVal < 400){
                    return 300
                }
            }();
            var data = {
                 hospitalId: that.hospitalId,
                 type: type,
                 imageName: that.UploadPhoto,
            }
            that.template.correctImg(data).success(function(res) {
                A.widget.loading.hide()
                $('#templatecontainer img').attr('src',that.ServerPath+'upload/downloadTemplate?fileName='+res.correctImagePath);
            }).fail(function(res) {
                A.widget.loading.hide()
                A.alert(res.rtnMsg)
            })
        },
        //自动校正
        autoCorrectTemplate:function (imageName){
            var that=this;
            var data={
                imageName: imageName
            }
            that.template.autoCorrectTemplate(data).success(function (res){
                //originalImagePath:'原图路径',correctImagePath:'矫正后的图片路径'
                that.originalImagePath=res.originalImagePath;
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        //标注图片四角距离
        dragImg: function() {
            var clientX = 0, clientY = 0, left = 0, top = 0,
                point = document.querySelectorAll('.point');
            A.each(point,function(index, el) {
                var imgBox = el.parentNode,
                    width = imgBox.clientWidth,
                    height = imgBox.clientHeight;
                if(el.className.match('right-top')){
                    el.style.left = width-50+'px'
                }
                if(el.className.match('left-bot')){
                    el.style.top = height-50+'px'
                }
                if(el.className.match('right-bot')){
                    el.style.left = width-50+'px';
                    el.style.top = height-50+'px';
                }
                el.ondragstart = function(event) {
                    clientX = event.clientX;
                    clientY = event.clientY;
                    left = parseInt(el.style.left) || 0;
                    top = parseInt(el.style.top) || 0;
                }
                el.ondrag = function(event) {
                    var oLeft = event.clientX - clientX + left,
                        oTop = event.clientY - clientY + top;
                    el.style.left = oLeft + 'px';
                    el.style.top = oTop + 'px';
                }
                el.ondragend = function(event) {
                    var oLeft = event.clientX - clientX + left,
                        oTop = event.clientY - clientY + top;
                    el.style.left = oLeft + 'px';
                    el.style.top = oTop + 'px';
                }            
            });
        },
        //手动拉平
        correctTemplateImage:function (){ 
            var that=this;
            var leftTopX=$('.left-top').position().left, leftTopY=$('.left-top').position().top, rightTopX=$('.right-top').position().left;
            var rightTopY=$('.right-top').position().top, leftBotX=$('.left-bot').position().left, leftBotY=$('.left-bot').position().top;
            var rightBotX=$('.right-bot').position().left, rightBotY=$('.right-bot').position().top;
            var imageName='';
            if(that.originalImagePath.match('/'))
            {
                var index=parseInt(that.originalImagePath.lastIndexOf('/'))+1;
                imageName=that.originalImagePath.substring(index,that.originalImagePath.length);
            }
            
            var data={
                imageName: imageName,
                leftTopPoint: {x:leftTopX,y:leftTopY},
                leftBottomPoint: {x:leftBotX,y:leftBotY},
                rightTopPoint: {x:rightTopX,y:rightTopY},
                rightBottomPoint: {x:rightBotX,y:rightBotY}
            }
            that.template.correctTemplateImage(data).success(function (res){
                //correctImagePath:'矫正后的图片路径'
                var correctImagePath=that.ServerPath+'upload/downloadNamePhoto?fileName='+res.correctImagePath;
                $('#templatecontainer .templateimg').attr('src',correctImagePath);
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
        },
        //按字体大小校正
        correctCharSize: function (){
            var that=this;
            var imageName='';
            if(that.originalImagePath.match('/'))
            {
                var index=parseInt(that.originalImagePath.lastIndexOf('/'))+1;
                imageName=that.originalImagePath.substring(index,that.originalImagePath.length);
            }
            var data={
                imageName: imageName,
                x: that.correctL,       
                y: that.correctT,
                w: that.correctW,
                h: that.correctH
            }
            that.template.correctCharSize(data).success(function (res){
                //correctImagePath:'矫正后的图片路径'
                var correctImagePath=that.ServerPath+'upload/downloadNamePhoto?fileName='+res.correctImagePath;
                $('#templatecontainer .templateimg').attr('src',correctImagePath);
            }).notLogin(function (res){
                A.widget.loading.hide();
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
