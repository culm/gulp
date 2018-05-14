;
(function(A) {
    var U = A.admin,
        S = A.service,
        CT = function() {};
    A.extend(CT.prototype, A.base, S, U, A.customerTemplate, {
        paramsId: A.getParams().autoId,
        /**
         * 医院id
         */
        hospitalId: null,
        refuseVal: '',
        refuseText: '',
        onReady: function() {
            var that = this;

            that.init();
            that.initHeader(function() {
                that.isAutoTask()
                if (that.paramsId) {
                    that.isAutoTask = true;
                }
                if (that.isAutoTask) {
                    that.loadData()
                }

            });
        },
        init: function() {
            var that = this;
            // 获取当前需要修改的类型单据,为区分单据审核和单据录入
            that.status = document.querySelector('#status').value;
            // 获取清单属性
            that.hospitallist = document.querySelector('#hospitallist') ? document.querySelector('#hospitallist').value : null;
            // 刷新或关闭网页提示
            // 默认开启关闭提示
            window.onbeforeunload = function(e) {
                e = e || window.event;
                if (e) {
                    e.returnValue = '离开之后数据可能无法保存';
                }
                return '离开之后数据可能无法保存';
            };
            that.moveTargetParent = $('#receipt-name')[0].parentNode.parentNode;
            A.on(that, 'mousedown', $('#receipt-name')[0]);
            $('#choose-reject').change(function(){
                var val = this.value;
                if(val != 'other'){
                    $('#refuse-text').hide();
                }else{
                    $('#refuse-text').val('');
                    $('#refuse-text').show();
                    that.refuseVal = '';
                }
                that.refuseVal = val;
            })
        },
        /**
         * 是否自动获取单据
         **/
        isAutoTask: function() {
            var that = this;
            var auto = localStorage.getItem('isAutoTask');
            $('.btn-submit').on('click', function(event) {
                that.loadData()
            });
            $('#isAutoTask').on('click', function(event) {
                localStorage.setItem('isAutoTask', this.checked)
            });
            if (auto === 'true') {
                that.isAutoTask = true;
            } else {
                that.isAutoTask = false;
            }
            $('#isAutoTask').attr('checked', that.isAutoTask);
            $(window).off('keyup').on('keyup', function(event) {
                event.preventDefault();
                var code = event.keyCode;
                if (code == 113) {
                    $('.btn-submit').click()
                    $('.iconfirmcontainer').modal('hide')
                }
            })
        },
        /**
         * 获取基本数据
         **/
        loadData: function() {
            var that = this,
                tenantId = localStorage.getItem('tenantId'),
                data = { "tenantId": tenantId, "status": that.status, "hospitallist": that.hospitallist },
                url = that.paramsId ? "getPayment" : "getNextPayment";
            // 判断保险公司
            that.isTenant(tenantId || "")
                // 如果有paramsId，产看历史单据
            if (that.paramsId) {
                window.onbeforeunload = null;
                data = A.getParams();
            }
            A.widget.loading.show({
                message: '数据查询中...'
            });
            // 获取理赔单据信息
            that.order[url](data).success(function(res) {
                if (res.autoId == null) {
                    A.widget.loading.show({
                        message: '暂时没有数据，请耐心等待10秒钟...'
                    });
                    that.reload(10000);
                    return false;
                };
                $('.isAutoTaskHide').removeClass('isAutoTaskHide');
                // 显示获取到的单据信息
                that.showData(res);
                var excel = $('#exportexcell');
                excel.prop('href', '/ukang-admin-web/invoiceDetailExportExcel?autoId=' + res.autoId + '&tenantId=' + res.tenantId + '&isTemporaryFlag=' + excel.attr('data-isTemporaryFlag'));
                // 获取所有图片显示
                that.loadLeftImg();
            }).fail(function(res) {
                if (res.rtnMsg == "请先选择公司") {
                    // 没有选择保险公司，重新选择保险公司
                    that.refreshTenant();
                    that.reload(10000);
                } else if (res.rtnMsg) {
                    A.alert(res.rtnMsg);
                } else {
                    A.widget.loading.show({
                        message: '暂时没有数据，请耐心等待10秒钟...'
                    });
                    that.reload(10000);
                }
                A.widget.loading.hide();
            })
        },
        /**
         * 加载所有左侧图片
         **/
        loadLeftImg: function() {
            var that = this;
            var data = {
                paymentNo: that.dataInfo.paymentNo,
                tenantId: that.res.tenantId,
                dataId: that.res.dataId
            }
            if (data.paymentNo) {
                that.order.getPreprocessImageList(data).success(function(res) {
                    //显示图片
                    var imgList = res.casePaymentList;
                    $('.picBox').find('img').remove();
                    for (var i = 0; i < imgList.length; i++) {
                        var img = imgList[i].imgName,
                            type = imgList[i].picType,
                            autoId = imgList[i].id,
                            status = imgList[i].status,
                            bigImg = imgList[i].bigImgName,
                            cur = bigImg == that.dataInfo.imageName ? 'cur' : '',
                            image = '<img class="' + cur + '" id="' + autoId + '" data-status="' + status + '" data-type="' + type + '" data-img="' + that.getImgPath(bigImg, data.paymentNo) + '" src="' + that.getImgPath(img, data.paymentNo) + '">';
                        if (cur != '') $('#pic000').append(image).show();
                        $('#pic' + type).append(image).show();
                    }
                }).fail(function(res) {
                    A.alert(res.rtnMsg);
                }).notLogin(function(res) {
                    A.widget.loading.hide();
                })
                $('.picTitle').on('click', function(event) {
                    var parent = $(this).parent();
                    var icon = $(this).find('.glyphicon');
                    if (parent.hasClass('active')) {
                        parent.removeClass('active');
                        icon.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
                    } else {
                        parent.addClass('active');
                        icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
                    }

                });
            }
        },
        /**
         * 显示获取到的单据信息
         **/
        showData: function(res) {
            var that = this;
            var dataInfo = null;
            that.dataType = res.type;
            that.province = res.provinceCode == 11 ? '1000' : res.provinceCode == 31 ? '2000' : '0000'
            if (res.type == 100) { // 处方
                dataInfo = res.prescriptionList[0];
            } else if (res.type == 200 || res.type == 800 || res.type == 900 || res.type == 910) { // 门诊发票||结算单||门特
                dataInfo = res.receiptList[0];
            } else if (res.type == 300) { // 住院发票
                dataInfo = res.hospitalInvoiceList[0];
            } else if (res.type == 400 || res.type == 410) { // 住院清单&&门诊清单
                dataInfo = res.hospitalCostsList[0];
                /*if (res.tenantId == 10008 && $('#status').val() != 35100) {
                    dataInfo.detailList = dataInfo.majorItemList.concat(dataInfo.detailList);
                }*/
            } else if (res.type == 600) { // 出院小结
                dataInfo = res.dischargeList[0];
            } else if (res.type == 3000) { // 申请书
                var claim = res.claimApplicationList[0];
                var newData = claim.insurancedPerson || {},
                    list1 = claim.applyPersonList,
                    list2 = claim.recipientPersonList;
                A.each(claim, function(key, value) {
                    if (typeof value == 'string') {
                        newData[key] = value
                    }
                });
                newData.detailList = [];
                A.each(list1, function(a, apply) {
                    apply.recipient = 0;
                    newData.detailList[a] = apply;
                    A.each(list2, function(b, recipient) {
                        if (recipient.name == apply.name) {
                            recipient.recipient = 1;
                            newData.detailList[a] = recipient
                        } else {
                            recipient.recipient = 1;
                            newData.detailList.push(recipient)
                        }
                    });
                });
                if (newData.relation == 401) {
                    newData.bankName = newData.detailList[0].bankName;
                    newData.bankAccountNo = newData.detailList[0].bankAccountNo;
                    newData.detailList = []
                }
                dataInfo = newData;
            } else { //其他单据
                dataInfo = res.otherList[0];
                dataInfo.detailList = [];
                if (that.paramsId) {
                    that.typeBool = true;
                }
            }
            //合并数组数据
            if (res.tenantId == 10008 && (res.type ==200 || res.type == 300)) {
                // if (dataInfo.detailList.length > 0 && $('#status').val() != 35100) {
                if (dataInfo.detailList.length > 0 ) {
                    A.each(dataInfo.detailList, function(index, element) {
                        if (!element.belongsType) element.belongsType = 9999;
                    });
                }
                dataInfo.detailList = dataInfo.majorItemList.concat(dataInfo.detailList);
            }
            // 全局保存单据数据
            that.res = res;
            that.dataInfo = dataInfo;
            // 下载图片路径
            var imgPath = that.ServerPath + 'upload/download?fileName=';
            // 修改图片标题ttile
            $('.receiptName').html(res.hospitalName + ' 票据');
            // 平安结算方式
            var means = "结算方式:";
            if (res.sattledType == 01) {
                means += "直结";
            } else if (res.sattledType == 02) {
                means += "事后";
            } else if (res.sattledType === null) {
                means = "历史案件";
            } else {
                means = "";
            };
            // 理赔号
            $('#paymentNo').html(dataInfo.paymentNo + '&nbsp;&nbsp;' + means);
            // 处理人显示
            $('#userId').html('预处理人ID:' + res.dealUserId + ' 录入人ID:' + res.inputUserId);
            // 医院显示
            $('#hospitalName').val(res.hospitalName);
            if (res.hospitalName && that.isPingan) {
                that.getHospitalCode(res.hospitalName)
            }
            // 显示大图
            $('#imgRepeat').attr('src', imgPath + dataInfo.imageName + '&paymentNo=' + dataInfo.paymentNo);
            //平安生产轮询检查案件是否撤回
            if (that.tenantId == 10007) that.isWithdraw();
            // 全局保存单据医院名称和id
            that.dataInfo.hospitalId = res.hospitalId;
            // 显示mapping模板
            that.showMapping(that.dataInfo);
            that.initEvent();

            //查询退回原因
             that.order.returnPaymentRetroversion({
                paymentId: that.res.autoId,
                tenantId: that.res.tenantId
             }).success(function(res){
                if(res.message){
                    $('#order-refuse .refuse-message').html(res.message);
                    $('#order-refuse').removeClass('hide');
                }
             }).fail(function(res){
                A.alert(JSON.stringify(res))
             })
        },
        /**
         * 初始化事件
         **/
        initEvent: function() {
            var that = this;
            // 绑定左侧图片点击事件
            $('.left-menu').on('click', 'img', function(event) {
                var img = event.target,
                    id = img.id,
                    src = img.getAttribute('data-img'),
                    type = img.getAttribute('data-type'),
                    status = img.getAttribute('data-status');
                if (that.paramsId) {
                    var url = 'review.html?autoId=' + id + '&status=' + status + '&type=' + type;
                    window.open(url, '_self')
                }
                $('.imgRepeatBox img').attr({ 'src': src });
                $('.left-menu img').removeClass('cur')
                $(this).addClass('cur');
                //当前图片
                $('#picTitle000 img').attr({ 'src': src });
                // id = that.changeStatusId;
                that.changeStatusId = id;
            });

            //切换理赔单和详情，重新调整高度
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                that.resizeHeight();
            });
            A.on(that, 'click', document.querySelector('#main'));
            // 模糊搜索医院
            that.fuzzySearch({
                id: 'hospitalName',
                searchUrl: '/RestServiceCall/TenantService/searchTenantList',
                paramsName: 'tenantName',
                returnList: 'tenantList',
                returnName: 'name',
                returnId: 'id',
                callback: that.getPinganHospitalCode
            });


            // 图片拖拽
            that.dragImg();
            // 改变页面高度
            that.checkHeight();
            // 创建下拉选项卡
            that.createMenu(that.dataType);
            // 运营需求
            that.productFunction();
            // 热键
            that.hotKey();

            $(window).resize(function() {
                    that.checkHeight();
            });
            //平安自带大项禁止修改
            if (that.res.tenantId == 10008) {
                A.each(that.dataInfo.detailList, function(index, el) {
                    if (!el.belongsType) {
                        $('input[name="belongsType"]').eq(index).attr('disabled', true);
                        // $('.belongsType').eq(index).closest('.detail-tr').find('input').attr('disabled', true).end().find('span').remove();
                        // $('.belongsType').eq(index).addClass('disabled');
                        $('.type').eq(index).addClass('disabled');
                    }
                });
            }
            //增加案件挂起功能
            if (that.isPingan) {
                $('.hang').remove();
                $('input[name="receiptStatus"]').next().after('&nbsp;&nbsp<button type="button" class="btn btn-primary hang">挂起</button>');
                if (that.paramsId) $('.hang').attr('disabled', true);
            }
        },
        start: 0,
        marginTop: 20,
        movingTimer: null,
        onMouseDown: function(e){
            var that = this;
            that.start = e.pageY;
            console.log('onMouseDown:' + e.pageY)
            A.on(that, 'mousemove', document.body);
            //A.on(that, 'mouseout', e.target);
            A.on(that, 'mouseup', document.body);
        },
        onMouseMove: function(e){
            var that = this,
                marginTop = that.marginTop - that.start + e.pageY;
            console.log('onMouseMove:' + marginTop + ',pageY:' + e.pageY);
            if(marginTop < -650) marginTop = -650;
            if(marginTop > 100) marginTop = 100;
            if(that.movingTimer) cancelAnimationFrame(that.movingTimer);
            that.movingTimer = requestAnimationFrame(function(){
                that.moveTargetParent.style.marginTop = marginTop + 'px'; 
            });
        },
        onMouseUp: function(e){
            var that = this;
            that.marginTop = that.marginTop - that.start + e.pageY;
            if(that.marginTop < -650) that.marginTop = -650;
            if(that.marginTop > 100) that.marginTop = 100;
            console.log('onMouseUp:' + that.marginTop);
            A.off(that, 'mouseup', document.body);
            A.off(that, 'mousemove', document.body);
        },
        /**
         * 默认监听事件
         **/
        handleEvent: function(e) {
            var that = this,
                target = e.target,
                className = target.className,
                parent = target.parentNode;
            if(e.type == 'mousedown'){
                that.onMouseDown(e);
                return;
            }else if(e.type == 'mousemove'){
                that.onMouseMove(e);
                return;
            }else if(e.type == 'mouseup'){
                that.onMouseUp(e);
                return;
            }
            // 旋转图片
            if (className.match('glyphicon-repeat')) {
                that.rotationImg(className, target);
                return;
            };
            // 点击保存按钮
            if (className.match('btn-save')) {
                that.submitInfo(target);
                return;
            };
            // 点击审核完成按钮
            if (className.match('btn-status')) {
                that.submitInfo(target, 'save');
                return;
            };
            // 点击暂存按钮
            if (className.match('btn-cache')) {
                that.submitInfo(target, 'cache');
                return;
            };
            // 删除药品项
            if (className == 'glyphicon glyphicon-remove remove') {
                if (!that.paramsId) {
                    that.removeTr(target);
                }
            }
            // 平安案件挂起
            if (className.match('hang')) {
                that.hangUp(className, target)
            }
            // 按钮组切换  
            if (className.match('btn')) {
                if (!target.parentNode.className.match('btn-group')) return;
                that.groupBtn(target, className)
            }
            // 切换左侧缩略图
            if (className.match('glyphicon')) {
                that.toggleMenu(target, className);
                return;
            }
        },
        /**
         * 删除详细项
         **/
        removeTr: function(target) {
            var that = this,
                tr = $(target).closest('.detail-tr'),
                input = tr.find('input'),
                id = input.eq(0).val();
            tr.remove();
            // that.detailIndex -= 1
            if (id) that.order.deleteDetail({ 'id': id, type: that.dataType })
        },
        /**
         * [productFunction 运营需求]
         **/
        productFunction: function() {
            var that = this;
            // 金饭碗续打发票
            if (that.res.parentId && that.isJinfanwan) {
                A.alert('请判断是否是续打发票')
                $('.isContinue').removeClass('hide')
                var btn = $('.glyphicon-triangle-right').get(0)
                that.toggleMenu(btn, btn.className)
            }
            // 新安怡
            if (that.isXinanyi) {
                if (that.dataType == 300 || that.dataType == 200) {
                    that.itemXinanyi();
                    var isMedicare = that.dataInfo.socialMedicalType == 1 ? true : false;
                    var btns = $('.isMedicare button');
                    var target = isMedicare ? btns.get(1) : btns.get(0);
                    $('.isMedicare').removeClass('hide');
                    that.groupBtn(target, target.className);
                }

                if (that.dataType == 3000) {
                    $('.detail-body').eq(1).find('.detail-title').text('申请人信息')
                        // 银行模糊匹配接口
                    that.bankName();
                    // 显示是否是本人按钮组
                    $('.isSelf').removeClass('hide');
                    var isSelf = that.dataInfo.relation == 401 ? true : false;
                    if (!that.dataInfo.relation && that.status == 30100) {
                        isSelf = true;
                    }
                    var btns = $('.isSelf button');
                    var target = isSelf ? btns.get(1) : btns.get(0);
                    if (target) { //临时改动
                        that.groupBtn(target, target.className);
                    }
                }
            }
            // 新安怡、太保移动、fesco
            if ((that.dataType == 300 || that.dataType == 200) && (that.isXinanyi || that.isTaibaoMobel || that.isFesco)) {
                // 疾病代码模糊匹配接口
                // 兼容多个疾病代码，快速上线，以后优化
                that.fuzzySearch({ id: 'inHospitalDiagnoseCh', searchUrl: 'diagnosiscpic/list/getByName', siblings: 'inHospitalDiagnose', paramsName: 'name', returnList: 'list', returnName: 'name', returnId: 'code' });
                that.fuzzySearch({ id: 'inHospitalDiagnose', searchUrl: 'diagnosiscpic/getByCode', siblings: 'inHospitalDiagnoseCh', paramsName: 'code', returnList: 'object', returnName: 'name', returnId: 'code' });
                if (that.isXinanyi || that.isTaibaoMobel) {
                    that.fuzzySearch({ id: 'inHospitalDiagnoseCh2', searchUrl: 'diagnosiscpic/list/getByName', siblings: 'inHospitalDiagnose2', paramsName: 'name', returnList: 'list', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnose2', searchUrl: 'diagnosiscpic/getByCode', siblings: 'inHospitalDiagnoseCh2', paramsName: 'code', returnList: 'object', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnoseCh3', searchUrl: 'diagnosiscpic/list/getByName', siblings: 'inHospitalDiagnose3', paramsName: 'name', returnList: 'list', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnose3', searchUrl: 'diagnosiscpic/getByCode', siblings: 'inHospitalDiagnoseCh3', paramsName: 'code', returnList: 'object', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnoseCh4', searchUrl: 'diagnosiscpic/list/getByName', siblings: 'inHospitalDiagnose4', paramsName: 'name', returnList: 'list', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnose4', searchUrl: 'diagnosiscpic/getByCode', siblings: 'inHospitalDiagnoseCh4', paramsName: 'code', returnList: 'object', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnoseCh5', searchUrl: 'diagnosiscpic/list/getByName', siblings: 'inHospitalDiagnose5', paramsName: 'name', returnList: 'list', returnName: 'name', returnId: 'code' });
                    that.fuzzySearch({ id: 'inHospitalDiagnose5', searchUrl: 'diagnosiscpic/getByCode', siblings: 'inHospitalDiagnoseCh5', paramsName: 'code', returnList: 'object', returnName: 'name', returnId: 'code' });
                }
            }
            // 玩家
            if (that.isWanjia) {
                that.itemDrug();
                that.itemDiagnose();
            }
            // 平安和太保移动
            if (that.isPingan || that.isTaibaoMobel) that.itemTernary(that.res.tenantId)
                // 平安
            if (that.isPingan) {
                that.fuzzySearch({
                    id: 'inHospitalDiagnoseCh',
                    searchUrl: '/dict/disease/getDiseaseByName',
                    siblings: 'inHospitalDiagnose',
                    paramsName: 'name',
                    returnList: 'data',
                    returnName: 'name',
                    returnId: 'code',
                    tenantId: that.res.tenantId,
                    callback: that.pinganGather,
                });
                $('#depName').closest('.inputEdit').hide();
                var disName = $('#disName').val()
                $('#disName').after('<textarea class="form-control" data-type="text" type="text" name="disName" >' + disName + '</textarea>').remove();
                var disNameBack = $('#disNameBack').val()
                if (disNameBack) disNameBack = disNameBack + '|';
                $('#disNameBack').after('<textarea class="form-control" data-type="text" type="text" name="disNameBack" >' + disNameBack + '</textarea>').remove();
                $('.btn-cache').removeClass('hide');
                $('.isAutoTask').addClass('cur');
            }
            // 历史数据
            if (that.paramsId) {
                var status = A.getParams().status;
                var type = A.getParams().type;

                $('.btn-status,.btn-save').remove();
                if (status < 30100 || type == 500 || type == 600 || type == 700 || type == 1000 || type == 9000) {
                    $('#detail-keyBox').html('')
                    $('#detail-table').html('')
                }
                A.each($('.form-control'), function(index, el) {
                    $(el).attr('disabled', true)
                });
                $('input[name="belongsType"]').attr('disabled', true);
                $('.dropdown-toggle').attr('disabled', true);
            }
            $('.receiptName').html(that.getTenantName(that.res.tenantId) + '-' + that.userName + '-' + $('.receiptName').html())
        },
        /**
         * 按钮组
         */
        groupBtn: function(target, className) {
            var that = this,
                parent = target.parentNode.parentNode,
                class1 = parent.className;

            $(target).addClass('cur').siblings('button').removeClass('cur');
            if (className.match('reject')) {
                if (class1.match('isContinue')) {
                    that.isContinue = 1;
                    return;
                }
                if (class1.match('isMedicare')) {
                    that.isMedicare = 1;
                    return;
                }
                if (class1.match('isSelf')) {
                    that.isSelfFunction(true)
                    return;
                }
            } else {
                if (class1.match('isContinue')) {
                    that.isContinue = 0;
                    return;
                }
                if (class1.match('isMedicare')) {
                    that.isMedicare = 2;
                    return;
                }
                if (class1.match('isSelf')) {
                    that.isSelfFunction(false)
                    return;
                }
            }
        },
        /**
         * 判断是否是本人
         */
        isSelfFunction: function(bool) {
            var that = this;
            if (bool) {
                $('.detail-body').eq(1).hide();
            } else {
                $('.detail-body').eq(1).show();
            }
            that.isSelf = bool;
            that.checkHeight();
        },
        /**
         * 创建下拉菜单
         */
        createMenu: function(type) {
            var that = this;
            if (that.isFesco) {
                A.widget.dropdownMenu({
                    title: '是否为大项',
                    menus: [{ id: '', text: '是否为大项' }, { id: 0, text: '大项' }, { id: 1, text: '小项' }],
                    name: 'detailParent'
                })
            };
            A.widget.dropdownMenu({
                title: '请选择证件类型',
                menus: [{ id: '', text: '请选择证件类型' }, { id: 10, text: '身份证' }, { id: 11, text: '居住证' }, { id: 12, text: '护照' }, { id: 13, text: '港澳通行证' }, { id: 14, text: '户口本' }, { id: 15, text: '军官证' }, { id: 0, text: '其他' }],
                name: 'cardType'
            });
            A.widget.dropdownMenu({
                title: '请选择证件类型',
                menus: [{ id: '', text: '请选择证件类型' }, { id: 10, text: '身份证' }, { id: 11, text: '居住证' }, { id: 12, text: '护照' }, { id: 13, text: '港澳通行证' }, { id: 14, text: '户口本' }, { id: 15, text: '军官证' }, { id: 0, text: '其他' }],
                name: 'certificateType'
            });
            A.widget.dropdownMenu({
                title: '请选择出险类型',
                menus: [{ id: '', text: '请选择出险类型' }, { id: 1, text: '意外' }, { id: 2, text: '疾病' }, { id: 3, text: '其他' }],
                name: 'accidentCode'
            });
            A.widget.dropdownMenu({
                title: '请选择性别',
                menus: [{ id: '', text: '请选择性别' }, { id: 1, text: '男' }, { id: 2, text: '女' }, { id: 0, text: '其他' }],
                name: 'gender'
            });
            if (type == 300 && that.isXinanyi) {
                A.widget.dropdownMenu({
                    title: '请选择费用类型',
                    menus: [{ id: '', text: '请选择费用类型' }, { id: '000001', text: '诊疗费' }, { id: '000002', text: '治疗费' }, { id: '000003', text: '手术费' }, { id: '000004', text: '检查费' }, { id: '000005', text: '化验费' }, { id: '000006', text: '摄片费' }, { id: '000007', text: '透视费' }, { id: '000008', text: '西药费' }, { id: '000009', text: '中成药费' }, { id: '000010', text: '中草药费' }, { id: '000011', text: '挂号费' }, { id: '000012', text: '材料费' }, { id: '000014', text: '护理费' }, { id: '000015', text: '输血费' }, { id: '000016', text: '输氧费' }, { id: '000017', text: '住院床位费' }],
                    name: 'itemCode'
                });
            }
            if (that.isTaibaoMobel) {
                A.widget.dropdownMenu({
                    title: '请选择费用类型',
                    menus: [{ id: '', text: '请选择费用类型' }, { id: '000001', text: '诊疗费' }, { id: '000002', text: '治疗费' }, { id: '000003', text: '手术费' }, { id: '000004', text: '检查费' }, { id: '000005', text: '化验费' }, { id: '000006', text: '摄片费' }, { id: '000007', text: '透视费' }, { id: '000008', text: '西药费' }, { id: '000009', text: '中成药费' }, { id: '000010', text: '中草药费' }, { id: '000011', text: '挂号费' }, { id: '000012', text: '材料费' }, { id: '000014', text: '护理费' }, { id: '000015', text: '输血费' }, { id: '000016', text: '输氧费' }, { id: '000017', text: '住院床位费' }],
                    name: 'bigItemCode'
                });
            }
            A.widget.dropdownMenu({
                title: '请选择单据状态',
                menus: window.menuData,
                name: 'receiptStatus',
                onClick: function(el, name, menuBox) {
                    var that = this;
                    menuBox.prev().val(el.id);
                    menuBox.find('.' + name).html(el.innerHTML + ' <b class="caret"></b>');
                    if(el.id == '20100' || el.id == '30100'){
                        $('#choose-reject').show();
                    }else{
                        $('#choose-reject').hide();
                    }
                    if(el.id == '30100'){
                        $('#choose-reject').val('')
                        $('.review-30100').hide();
                        $('.review-20100').show();
                    }
                    if(el.id == '20100'){
                         $('#choose-reject').val('')
                        $('.review-20100').hide();
                        $('.review-30100').show();
                    }
                }
            });
            A.widget.dropdownMenu({
                title: '与被保险人关系',
                menus: [{ id: '', text: '与被保险人关系' }, { id: 401, text: '本人' }, { id: 402, text: '配偶' }, { id: 403, text: '父子' }, { id: 404, text: '父女' }, { id: 405, text: '受益人' }, { id: 406, text: '被保人' }, { id: 407, text: '投保人' }, { id: 408, text: '其他' }, { id: 409, text: '母子' }, { id: 410, text: '母女' }, { id: 411, text: '兄弟' }, { id: 412, text: '姊妹' }, { id: 413, text: '兄妹' }, { id: 414, text: '姐弟' }, { id: 415, text: '祖孙' }, { id: 416, text: '雇佣' }, { id: 417, text: '业务员' }],
                name: 'relation'
            });
            A.widget.dropdownMenu({
                title: '是否是领款人',
                menus: [{ id: '', text: '是否是领款人' }, { id: 1, text: '是' }, { id: 0, text: '否' }],
                name: 'recipient'
            });
            if (that.isPingan) {
                A.widget.dropdownMenu({
                    title: '请选择科室名称',
                    menus: [{ id: '', text: '请选择科室名称' }, { id: '001', text: '内科' }, { id: '002', text: '消化内科' }, { id: '003', text: '内分泌内科' }, { id: '004', text: '呼吸内科' }, { id: '005', text: '血液内科' }, { id: '006', text: '泌尿内科' }, { id: '007', text: '神经内科' }, { id: '008', text: '心血管内科' }, { id: '009', text: '外科' }, { id: '010', text: '神经外科' }, { id: '011', text: '骨科' }, { id: '012', text: '烧伤科' }, { id: '013', text: '脑外科' }, { id: '014', text: '胸外科' }, { id: '015', text: '肿瘤科' }, { id: '016', text: '中医科' }, { id: '017', text: '妇产科' }, { id: '018', text: '儿科' }, { id: '019', text: '耳鼻喉科' }, { id: '020', text: '眼科' }, { id: '021', text: '口腔科' }, { id: '022', text: '皮肤科' }, { id: '023', text: '急诊科' }, { id: '024', text: '儿科' }, { id: '025', text: '放射科' }, { id: '026', text: '麻醉科' }, { id: '027', text: '泌尿外科' }],
                    name: 'depCode',
                    onClick: function(el, name, menuBox) {
                        menuBox.prev().val(el.id);
                        menuBox.find('.' + name).html(el.innerHTML + ' <b class="caret"></b>');
                        $('#depName').val(el.innerHTML)
                    }
                });
                A.widget.dropdownMenu({
                    title: '请选择申请原因',
                    menus: [{ id: '', text: '请选择申请原因' }, { id: "01", text: "意外死亡" }, { id: "02", text: "疾病死亡" }, { id: "03", text: "意外残疾" }, { id: "04", text: "疾病残疾" }, { id: "09", text: "重大疾病" }, { id: "05", text: "意外医疗" }, { id: "06", text: "疾病医疗" }],
                    default: { id: "06", text: "疾病医疗" },
                    name: 'applicantCauseCode'
                });
                A.widget.dropdownMenu({
                    title: '请选择币种',
                    menus: [{ id: '', text: '请选择币种' }, { id: 'CNY', text: '人民币元' }, { id: 'USD', text: '美元' }, { id: 'ASF', text: '瑞士法郎' }, { id: 'AED', text: '阿联酋迪拉姆' }, { id: 'ALL', text: '阿尔巴尼亚列克' }, { id: 'AOA', text: '安哥拉宽扎' }, { id: 'ARS', text: '阿根廷比索' }, { id: 'AUD', text: '澳元' }, { id: 'BAM', text: '波黑马克' }, { id: 'BGN', text: '保加利亚列维' }, { id: 'BHD', text: '巴林第纳尔' }, { id: 'BND', text: '文莱元' }, { id: 'BOB', text: '玻利维亚诺' }, { id: 'BRL', text: '巴西雷亚尔' }, { id: 'BWP', text: '博茨瓦纳普拉' }, { id: 'BYR', text: '白俄罗斯卢布' }, { id: 'CAD', text: '加元' }, { id: 'CHF', text: '瑞士法郎' }, { id: 'CLP', text: '智利比索' }, { id: 'COP', text: '哥伦比亚比索' }, { id: 'CZK', text: '捷克克朗' }, { id: 'DKK', text: '丹麦克朗' }, { id: 'DZD', text: '阿尔及利亚第纳尔' }, { id: 'EGP', text: '埃及镑' }, { id: 'EUR', text: '欧元' }, { id: 'GBP', text: '英镑' }, { id: 'GHS', text: '加纳塞地' }, { id: 'GYD', text: '圭亚那元' }, { id: 'HKD', text: '港元' }, { id: 'HRK', text: '克罗地亚库纳' }, { id: 'HUF', text: '匈牙利福林' }, { id: 'IDR', text: '印度尼西亚卢比' }, { id: 'ILS', text: '以色列谢客尔' }, { id: 'INR', text: '印度卢比' }, { id: 'IQD', text: '伊拉克第纳尔' }, { id: 'IRR', text: '伊朗里亚尔' }, { id: 'ISK', text: '冰岛克朗' }, { id: 'JOD', text: '约旦第纳尔' }, { id: 'JPY', text: '日元' }, { id: 'KES', text: '肯尼亚先令' }, { id: 'KRW', text: '韩元' }, { id: 'KWD', text: '科威特第纳尔' }, { id: 'KZT', text: '哈萨克斯坦坚戈' }, { id: 'LAK', text: '老挝基普' }, { id: 'LBP', text: '黎巴嫩镑' }, { id: 'LKR', text: '斯里兰卡卢比' }, { id: 'LTL', text: '立陶宛立特' }, { id: 'LYD', text: '利比亚第纳尔' }, { id: 'MAD', text: '摩洛哥迪拉姆' }, { id: 'MDL', text: '摩尔多瓦列伊' }, { id: 'MKD', text: '马其顿第纳尔' }, { id: 'MMK', text: '缅甸缅元' }, { id: 'MNT', text: '蒙古图格里克' }, { id: 'MOP', text: '澳门元' }, { id: 'MUR', text: '毛里求斯卢比' }, { id: 'MVR', text: '马尔代夫卢非亚' }, { id: 'MWK', text: '马拉维克瓦查' }, { id: 'MXN', text: '墨西哥比索' }, { id: 'MYR', text: '马来西亚林吉特' }, { id: 'NGN', text: '尼日利亚奈拉' }, { id: 'NOK', text: '挪威克朗' }, { id: 'NPR', text: '尼泊尔卢比' }, { id: 'NZD', text: '新西兰元' }, { id: 'OMR', text: '阿曼里亚尔' }, { id: 'PEN', text: '秘鲁索尔' }, { id: 'PHP', text: '菲律宾比索' }, { id: 'PKR', text: '巴基斯坦卢比' }, { id: 'PLN', text: '波兰兹罗提' }, { id: 'PYG', text: '巴拉圭瓜拉尼' }, { id: 'QAR', text: '卡塔尔里亚尔' }, { id: 'RON', text: '罗马尼亚列伊' }, { id: 'RSD', text: '塞尔维亚第纳尔' }, { id: 'RUB', text: '俄罗斯卢布' }, { id: 'SAR', text: '沙特里亚尔' }, { id: 'SDG', text: '新苏丹镑' }, { id: 'SDR', text: '特别提款权' }, { id: 'SEK', text: '瑞典克朗' }, { id: 'SGD', text: '新加坡元' }, { id: 'SLL', text: '塞拉利昂利昂' }, { id: 'SRD', text: '苏里南元' }, { id: 'SSP', text: '南苏丹镑' }, { id: 'SYP', text: '叙利亚镑' }, { id: 'THB', text: '泰铢' }, { id: 'TND', text: '突尼斯第纳尔' }, { id: 'TRY', text: '土耳其里拉' }, { id: 'TWD', text: '台湾元' }, { id: 'TZS', text: '坦桑尼亚先令' }, { id: 'UAH', text: '乌克兰格里夫那' }, { id: 'UGX', text: '乌干达先令' }, { id: 'UYU', text: '乌拉圭比索' }, { id: 'UZS', text: '乌兹别克斯坦苏姆' }, { id: 'VEF', text: '委内瑞拉博利瓦' }, { id: 'VND', text: '越南盾' }, { id: 'XAF', text: '刚果中非共同体法郎' }, { id: 'YER', text: '也门里亚尔' }, { id: 'ZAR', text: '南非兰特' }, { id: 'ZMW', text: '赞比亚克瓦查' }],
                    default: { id: 'CNY', text: '人民币元' },
                    name: 'currencyCode',
                });
                A.widget.dropdownMenu({
                    title: '请选择材料类型',
                    menus: [{ id: '', text: '请选择材料类型' }, { id: 1, text: '原件' }, { id: 2, text: '复印件' }],
                    default: { id: 1, text: '原件' },
                    name: 'materialType'
                });
                A.widget.dropdownMenu({
                    title: '请选择治疗类型',
                    menus: [{ id: '', text: '请选择治疗类型' }, { id: '1', text: '门诊' }, { id: '2', text: '住院' }, { id: '3', text: '其它' }, { id: '4', text: '女性生育' }, { id: '5', text: '牙科' }, { id: '6', text: '眼科' }, { id: '7', text: '体检' }, { id: '8', text: '临终关怀' }, { id: '9', text: '家庭护理' }],
                    name: 'therapyType'
                });
                // A.widget.dropdownMenu({
                //     title: '请选择大项分类',
                //     menus : [{ "id": '', "text": '请选择大项分类' },{"id":"10","text":"抢救费-10"},{"id":"11","text":"床位费-11"},{"id":"12","text":"药品费-12"},{"id":"13","text":"治疗费-13"},{"id":"14","text":"护理费-14"},{"id":"15","text":"检查费-15"},{"id":"16","text":"特殊检查治疗费-16"},{"id":"17","text":"救护车费-17"},{"id":"18","text":"手术费-18"},{"id":"19","text":"住院器官移植费-19"},{"id":"20","text":"杂项费-20"},{"id":"21","text":"无关费用-21"},{"id":"22","text":"其余费用-22"},{"id":"23","text":"全额自费费用-23"},{"id":"24","text":"部分自费费用-24"},{"id":"25","text":"住院相关门诊费用-25"},{"id":"26","text":"诊疗费-26"},{"id":"27","text":"膳食费-27"},{"id":"28","text":"住院医师费-28"},{"id":"29","text":"检查化验费-29"},{"id":"31","text":"手术（包括门诊手术）费"},{"id":"32","text":"门诊药品费（西医开出）"},{"id":"33","text":"门诊西医治疗费-33"},{"id":"34","text":"门诊中医治疗费(含中医开出的药品费)"},{"id":"35","text":"门诊肾透析费-35"},{"id":"36","text":"门诊恶性肿瘤电/放/化疗费"},{"id":"37","text":"补充器官移植手术费-37"},{"id":"38","text":"产前检查费-38"},{"id":"39","text":"分娩费-39"},{"id":"40","text":"新生儿护理费-40"},{"id":"41","text":"流产费-41"},{"id":"42","text":"重症监护费-42"},{"id":"43","text":"子女入院加床费-43"},{"id":"44","text":"紧急救援牙科费用-44"},{"id":"45","text":"紧急救援住院及门诊费用-45"},{"id":"47","text":"遗体转送回国费用-47"},{"id":"48","text":"骨灰转送回国费用-48"},{"id":"49","text":"就地安葬费用-49"},{"id":"50","text":"紧急救援服务费用-50"},{"id":"51","text":"非器官移植手术费-51"},{"id":"52","text":"大病门诊费-52"},{"id":"61","text":"个人现金支付-61"},{"id":"62","text":"社保（当年）个人账户支付"},{"id":"63","text":"社保历年个人账户支付-63"},{"id":"64","text":"社保统筹支付-64"},{"id":"65","text":"社保其他支付-65"},{"id":"66","text":"社保全额自费费用-66"},{"id":"67","text":"社保部分自费费用-67"},{"id":"68","text":"大病门诊特诊自负费用-68"},{"id":"69","text":"住院起付线费用-69"},{"id":"70","text":"住院共付段自付费用-70"},{"id":"71","text":"大额医疗费用-71"},{"id":"72","text":"大额个人自付费用-72"},{"id":"73","text":"大额以上医疗费用-73"},{"id":"74","text":"医务室费用-74"},{"id":"80","text":"住院床位费-80"},{"id":"81","text":"特殊床位费-81"},{"id":"82","text":"其他床位费-82"},{"id":"83","text":"处方药品费-83"},{"id":"84","text":"非处方药品费-84"},{"id":"85","text":"住院治疗费-85"},{"id":"86","text":"门诊治疗费-86"},{"id":"87","text":"生育治疗费-87"},{"id":"88","text":"特殊治疗费-88"},{"id":"89","text":"其他治疗费-89"},{"id":"90","text":"家庭护理费-90"},{"id":"91","text":"检验费-91"},{"id":"92","text":"检查检验费-92"},{"id":"93","text":"特殊检查费-93"},{"id":"94","text":"器官移植手术费-94"},{"id":"95","text":"住院医疗费-95"},{"id":"96","text":"门诊医疗费-96"},{"id":"97","text":"生育医疗费-97"},{"id":"98","text":"新生儿医疗费-98"},{"id":"99","text":"合计费用-99"},{"id":"100","text":"重症监护费-100"},{"id":"101","text":"临终医疗费-101"},{"id":"102","text":"合理医疗费-102"},{"id":"103","text":"特殊医疗费-103"},{"id":"104","text":"其他医疗费-104"},{"id":"105","text":"意外牙科治疗-105"},{"id":"106","text":"疾病牙科治疗-106"},{"id":"107","text":"普通牙科治疗-107"},{"id":"108","text":"特殊牙科治疗-108"},{"id":"109","text":"膳食费-109"},{"id":"110","text":"加床费-110"},{"id":"111","text":"免疫费-111"},{"id":"112","text":"体检费-112"},{"id":"113","text":"口腔保健费-113"},{"id":"114","text":"疫苗费-114"},{"id":"115","text":"糖尿病用品费-115"},{"id":"116","text":"眼镜费用-116"},{"id":"117","text":"护工费-117"},{"id":"118","text":"医用材料费-118"},{"id":"119","text":"麻醉费-119"},{"id":"120","text":"中草药-120"},{"id":"121","text":"医用设备费-121"},{"id":"122","text":"新生儿检查检验费-122"},{"id":"123","text":"手术材料费-123"},{"id":"124","text":"检查材料费-124"},{"id":"160","text":"膏方-160"},{"id":"9999","text":"其他"}],
                //     name: 'belongsType',
                //     siblings: 'feeName'
                // });
                // var that = this;
                var inputs = $('#detail-table input[name="belongsType"]');
                A.each(inputs, function(index, input){
                    if(input.id) return;
                    that.createAutoComplete(input);
                });
                
                A.widget.dropdownMenu({
                    title: '请选择材料类型',
                    menus: [{ id: '', text: '请选择材料类型' }, { id: 1, text: '诊疗' }, { id: 2, text: '手术' }, { id: 3, text: '检查' }, { id: 4, text: '检验' }, { id: 5, text: '药品' }, { id: 6, text: '材料' }],
                    name: 'type',
                    siblings: 'feeType'
                });
            }

        },
        createAutoComplete: function(input){
            var that = this;
            input.id = 'createAutoComplete-' + new Date().getTime();
            input.setAttribute('placeholder', '请选择大项分类');
            if(input.value){
                var data = that.getAutoCompleteData('', input.value);
                input.setAttribute('data-id', data.id);
                input.setAttribute('data-text', data.text);
                input.value = data.text;
            }
            $(input).off('keydown').on('keydown', function(){
                that.activeInput = this;
                if(that.showTimer) clearTimeout(that.showTimer);
                that.showTimer = setTimeout(function(){
                    that._createAutoComplete();
                }, 100)
            });
        },
        unRegisterChange: function(){
            var that = this;
            var activeInput = that.activeInput;
            if(!activeInput || !activeInput.nextElementSibling) return;
            if(activeInput.nextElementSibling.style.display != 'block') return;
            activeInput.value = activeInput.getAttribute('data-text');
            activeInput.nextElementSibling.style.display = 'none';
        },
        _createAutoComplete: function(){
            var that = this,
                val = that.activeInput.value,
                ul = that.activeInput.nextElementSibling;
            if(!that.activeInput.nextElementSibling){
                ul = document.createElement('ul');
                ul.className = 'dropdown-menu';
                ul.style.cssText = 'display: block; max-height:200px;overflow: auto;';
                that.activeInput.parentNode.appendChild(ul);
            }
            ul.style.display = 'block';
            var data = that.getAutoCompleteData(val);
            var html = [];
            data.forEach(function(d, _){
                html.push('<li data-id="' + d.id + '" data-text="' + d.text + '"><a href="javascript:;" data-id="' + d.id + '" data-text="' + d.text + '">' + d.text + '</a></li>');
            });
            ul.innerHTML = html.join('');
            $(ul).off('click').on('click', function(e){
                var T = $(e.target);
                var id = T.data('id') || '';
                that.activeInput.setAttribute('data-id', id);
                var txt = T.data('text');
                if(!id) txt = '';
                that.activeInput.value = txt;
                that.activeInput.setAttribute('data-text', txt);
                that.activeInput.nextElementSibling.style.display = 'none';
                that.activeInput  = null;
            });
        },
        getAutoCompleteData: function(val, id){
            var data = [{"id":"10","text":"抢救费-10"},{"id":"11","text":"床位费-11"},{"id":"12","text":"药品费-12"},{"id":"13","text":"治疗费-13"},{"id":"14","text":"护理费-14"},{"id":"15","text":"检查费-15"},{"id":"16","text":"特殊检查治疗费-16"},{"id":"17","text":"救护车费-17"},{"id":"18","text":"手术费-18"},{"id":"19","text":"住院器官移植费-19"},{"id":"20","text":"杂项费-20"},{"id":"21","text":"无关费用-21"},{"id":"22","text":"其余费用-22"},{"id":"23","text":"全额自费费用-23"},{"id":"24","text":"部分自费费用-24"},{"id":"25","text":"住院相关门诊费用-25"},{"id":"26","text":"诊疗费-26"},{"id":"27","text":"膳食费-27"},{"id":"28","text":"住院医师费-28"},{"id":"29","text":"检查化验费-29"},{"id":"31","text":"手术（包括门诊手术）费"},{"id":"32","text":"门诊药品费（西医开出）"},{"id":"33","text":"门诊西医治疗费-33"},{"id":"34","text":"门诊中医治疗费(含中医开出的药品费)"},{"id":"35","text":"门诊肾透析费-35"},{"id":"36","text":"门诊恶性肿瘤电/放/化疗费"},{"id":"37","text":"补充器官移植手术费-37"},{"id":"38","text":"产前检查费-38"},{"id":"39","text":"分娩费-39"},{"id":"40","text":"新生儿护理费-40"},{"id":"41","text":"流产费-41"},{"id":"42","text":"重症监护费-42"},{"id":"43","text":"子女入院加床费-43"},{"id":"44","text":"紧急救援牙科费用-44"},{"id":"45","text":"紧急救援住院及门诊费用-45"},{"id":"47","text":"遗体转送回国费用-47"},{"id":"48","text":"骨灰转送回国费用-48"},{"id":"49","text":"就地安葬费用-49"},{"id":"50","text":"紧急救援服务费用-50"},{"id":"51","text":"非器官移植手术费-51"},{"id":"52","text":"大病门诊费-52"},{"id":"61","text":"个人现金支付-61"},{"id":"62","text":"社保（当年）个人账户支付"},{"id":"63","text":"社保历年个人账户支付-63"},{"id":"64","text":"社保统筹支付-64"},{"id":"65","text":"社保其他支付-65"},{"id":"66","text":"社保全额自费费用-66"},{"id":"67","text":"社保部分自费费用-67"},{"id":"68","text":"大病门诊特诊自负费用-68"},{"id":"69","text":"住院起付线费用-69"},{"id":"70","text":"住院共付段自付费用-70"},{"id":"71","text":"大额医疗费用-71"},{"id":"72","text":"大额个人自付费用-72"},{"id":"73","text":"大额以上医疗费用-73"},{"id":"74","text":"医务室费用-74"},{"id":"80","text":"住院床位费-80"},{"id":"81","text":"特殊床位费-81"},{"id":"82","text":"其他床位费-82"},{"id":"83","text":"处方药品费-83"},{"id":"84","text":"非处方药品费-84"},{"id":"85","text":"住院治疗费-85"},{"id":"86","text":"门诊治疗费-86"},{"id":"87","text":"生育治疗费-87"},{"id":"88","text":"特殊治疗费-88"},{"id":"89","text":"其他治疗费-89"},{"id":"90","text":"家庭护理费-90"},{"id":"91","text":"检验费-91"},{"id":"92","text":"检查检验费-92"},{"id":"93","text":"特殊检查费-93"},{"id":"94","text":"器官移植手术费-94"},{"id":"95","text":"住院医疗费-95"},{"id":"96","text":"门诊医疗费-96"},{"id":"97","text":"生育医疗费-97"},{"id":"98","text":"新生儿医疗费-98"},{"id":"99","text":"合计费用-99"},{"id":"100","text":"重症监护费-100"},{"id":"101","text":"临终医疗费-101"},{"id":"102","text":"合理医疗费-102"},{"id":"103","text":"特殊医疗费-103"},{"id":"104","text":"其他医疗费-104"},{"id":"105","text":"意外牙科治疗-105"},{"id":"106","text":"疾病牙科治疗-106"},{"id":"107","text":"普通牙科治疗-107"},{"id":"108","text":"特殊牙科治疗-108"},{"id":"109","text":"膳食费-109"},{"id":"110","text":"加床费-110"},{"id":"111","text":"免疫费-111"},{"id":"112","text":"体检费-112"},{"id":"113","text":"口腔保健费-113"},{"id":"114","text":"疫苗费-114"},{"id":"115","text":"糖尿病用品费-115"},{"id":"116","text":"眼镜费用-116"},{"id":"117","text":"护工费-117"},{"id":"118","text":"医用材料费-118"},{"id":"119","text":"麻醉费-119"},{"id":"120","text":"中草药-120"},{"id":"121","text":"医用设备费-121"},{"id":"122","text":"新生儿检查检验费-122"},{"id":"123","text":"手术材料费-123"},{"id":"124","text":"检查材料费-124"},{"id":"160","text":"膏方-160"},{"id":"9999","text":"其他"}];
            var arr = [];
            if(id){
                data.forEach(function(d, index){
                    if(d.id == id){
                        arr.push(d);
                    }
                });
                return arr[0];
            }
            data.forEach(function(d, index){
                if(d.text.indexOf(val) >=0){
                    arr.push(d);
                }
            });
            if(arr.length == 0){
                arr.push({id: '', text: '暂无数据'})
            }
            return arr;
        },
        /**
         * 银行模糊匹配接口
         **/
        bankName: function(bool) {
            var that = this;
            var name = $('input[name="bankName"]');
            A.each(name, function(index, el) {
                $(el).attr('id', 'bankName' + index)
                that.fuzzySearch({
                    id: 'bankName' + index,
                    searchUrl: '/bank/data/get',
                    paramsName: 'bankName',
                    returnList: 'bankList',
                    returnName: 'bankName',
                    returnId: 'bankCode',
                    tenantId: that.res.tenantId
                });
            });
        },
        /**
         * 详细项名称匹配各种代码
         **/
        itemTernary: function(tenantID) {
            var that = this,
                input = $('input[name="item"]').length > 0 ? $('input[name="item"]') : $('input[name="itemName"]');
            A.each(input, function(index, el) {
                var dom = $(el),
                    parent = dom.closest('.detail-tr'),
                    itemType = parent.find('input[name="itemType"]').length > 0 ? parent.find('input[name="itemType"]') : parent.find('input[name="type"]');
                date = new Date().getTime();

                if (dom.attr('id')) return;
                dom.attr('id', 'item' + index + date)
                that.fuzzySearch({
                    id: 'item' + index + date,
                    searchUrl: function() {
                        return itemType.val() == 2 ? '/healthInsurance/materialtreatmentList' : '/healthInsurance/drugList'
                    },
                    paramsName: 'name',
                    returnList: 'data',
                    returnName: 'customerProductName',
                    returnId: 'feeCode',
                    callback: that.isPingan ? that.pinganCallback : that.taibaoCallback,
                    tenantId: that.res.tenantId
                });
            });
        },
        /**
         * 太保移动匹配类型回调函数
         **/
        taibaoCallback: function(fuc, op, item) {
            var that = this,
                dom = $(fuc.target),
                parent = dom.closest('.detail-tr'),
                itemCode = parent.find('input[name="itemCode"]'),
                index = itemCode.attr('data-index'),
                spec = parent.find('input[name="spec"]').length > 0 ? parent.find('input[name="spec"]') : parent.find('input[name="dosageForm"]'),
                feeName = parent.find('input[name="feeName"]'),
                belongsType = parent.find('input[name="bigItemCode"]'),
                belongsTypeBtn = parent.find('.bigItemCode');

            // 规格
            spec.val(item.drugSpecific || item.specType)
                // itemCode
            itemCode.val(item.customerDrugId || (item.productCode || item.code));

            fuc.GetTarget().val(item.productName ? item['productName'] : item[op.returnName]);
        },
        /**
         * 平安匹配类型回调函数
         **/
        pinganCallback: function(fuc, op, item) {
            var that = this,
                dom = $(fuc.target),
                parent = dom.closest('.detail-tr'),
                itemCode = parent.find('input[name="itemCode"]'),
                index = itemCode.attr('data-index'),
                spec = parent.find('input[name="spec"]').length > 0 ? parent.find('input[name="spec"]') : parent.find('input[name="dosageForm"]'),
                feeType = parent.find('input[name="feeType"]'),
                feeName = parent.find('input[name="feeName"]'),
                type = parent.find('input[name="type"]'),
                typeBtn = parent.find('.type'),
                belongsType = parent.find('input[name="belongsType"]'),
                belongsTypeBtn = parent.find('.belongsType');

            // 规格
            spec.val(item.drugSpecific || item.specType)
                // itemCode
            itemCode.val(item.customerDrugId || (item.productCode || item.code));
            // 费用类型代码和费用类型
            type.val((item.feeTypeCode || item.categoryCode) || '');
            feeType.val((item.feeType || item.categoryName) || '');
            typeBtn.html((item.feeType || item.categoryName || '请选择费用类型') + ' <b class="caret"></b>');
            // 费用代码和费用名称
            belongsType.attr('data-id', item.feeCode);
            belongsType.attr('data-text', item.feeName + '-' + item.feeCode);
            belongsType.val(item.feeName + '-' + item.feeCode);
            feeName.val(item.feeName || item.typeName);
            belongsTypeBtn.html((item.feeName || item.typeName || '请选择大项分类') + '-' + item.feeCode + ' <b class="caret"></b>');

            fuc.GetTarget().val(item.productName ? item['productName'] : item[op.returnName]);

        },
        /**
         * 平安疾病名称及编码
         **/
        pinganGather: function(fuc, op, item) {
            var diseaseAndCode = $('textarea[name="disNameBack"]').val();
            /*diseaseAndCode += fuc.GetTarget().val() + '##' + $('input[name="' + op.siblings + '"]').val() + '|';*/
            diseaseAndCode += $('input[name="inHospitalDiagnoseCh"]').val() + '##' + $('input[name="inHospitalDiagnose"]').val() + '|';
            $('textarea[name="disNameBack"]').val(diseaseAndCode);
            // fuc.GetTarget().select();
            if (fuc) {
                setTimeout("$('#inHospitalDiagnoseCh').select()", 0)
            } else {
                $('input[name="inHospitalDiagnoseCh"]').select()
            };
        },
        /**
         * 匹配费用类型
         **/
        itemXinanyi: function() {
            var that = this;
            input = $('input[name="item"]')
            A.each(input, function(index, el) {
                var dom = $(el),
                    timer = null
                dom.off('input').on('input', function(e) {
                    var lastTime = e.timeStamp;
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        if (lastTime - e.timeStamp != 0) return;
                        var name = e.target.value,
                            parent = dom.closest('.detail-tr'),
                            menu = parent.find('.btn-group'),
                            buttn = menu.find('.itemCode'),
                            item = menu.find('li a'),
                            type = parent.find('input[name="itemCode"]')
                        that.order.getInvoiceMapping(name).success(function(res) {
                            A.each(item, function(index, el) {
                                if (el.id == res.data) {
                                    type.val(el.id)
                                    buttn.html($(el).text() + ' <b class="caret"></b>')
                                }
                            });
                        }).fail(function(res) {
                            if (res.rtnCode != 2005) A.alert(res.rtnMsg);
                        });
                    }, 300);
                })
            });
        },
        /**
         *  万家匹配药品类型
         **/
        itemDrug: function() {
            var that = this;
            input = $('input[name="type"]')
            A.each(input, function(index, el) {
                var dom = $(el),
                    timer = null
                dom.off('input').on('input', function(e) {
                    var itemType = e.target.value,
                        parent = dom.closest('.detail-tr'),
                        value = parent.find('input[name="item"]').val(),
                        grade = parent.find('input[name="grade"]'),
                        level = parent.find('input[name="selfPayRate"]'),
                        data = {
                            types: 'TREATMENTS',
                            region: 110000,
                            words: value
                        }
                    if (value == '') {
                        A.alert('项目名称不能为空')
                        return false;
                    }
                    if (itemType == 1) {
                        data.types = 'MEDICATIONS'
                    } else if (itemType == 2) {
                        data.types = 'TREATMENTS'
                    } else {
                        if (itemType != '') A.alert('类型只能输入1和2');
                        return false;
                    }
                    that.order.deductibles(data).then(function(res) {
                        var levelVal = res.data.lexemDeductablePercentage || '';
                        var gradeVal = res.data.lexemDeductableLevel || '';
                        grade.val(gradeVal);
                        level.val(levelVal);
                    }, function(res) {
                        if (res.rtnCode != 2005) A.alert(res.rtnMsg);
                    });
                })
            });
        },
        /**
         * 万家匹配疾病诊断名称
         **/
        itemDiagnose: function() {
            var that = this;
            that.fuzzySearch({
                id: 'inHospitalDiagnoseCh',
                searchUrl: '/dict/disease/getDiseaseByName',
                siblings: 'inHospitalDiagnose',
                paramsName: 'name',
                returnList: 'data',
                returnName: 'name',
                returnId: 'code',
                tenantId: that.res.tenantId
            });
        },
        /**
         * 新安怡匹配详细项类型
         **/
        itemMedication: function() {
            var that = this,
                input = $('input[name="itemName"]');
            A.each(input, function(index, el) {
                var dom = $(el),
                    timer = null
                dom.off('input').on('input', function(e) {
                    var lastTime = e.timeStamp;
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        if (lastTime - e.timeStamp != 0) return;
                        var name = e.target.value,
                            parent = dom.closest('.detail-tr'),
                            type = parent.find('input[name="type"]')
                        that.order.isMedication(name).success(function(res) {
                            type.val(el.id)
                        }).fail(function(res) {
                            if (res.rtnCode != 2005) A.alert(res.rtnMsg);
                        });
                    }, 300);
                })
            });
        },
        /**
         * 处理页面高度
         **/
        checkHeight: function(bool) {
            var that = this,
                winHeight = window.innerHeight,
                newHeight = (winHeight - 20) * .6,
                newHeight2 = (winHeight - 20) * .4,
                box = document.querySelector('.detail-box'),
                leftMenu = document.querySelector('.left-menu'),
                pic = leftMenu.querySelector('.pic'),
                body = box.querySelectorAll('.detail-body'),
                keyBox = box.querySelector('#detail-keyBox'),
                imgBox = box.querySelector('.imgRepeatBox'),
                tbody = box.querySelector('.detail-tbody');
            detail = box.querySelector('.detail-table');
            //box.style.height = winHeight + 'px';
            leftMenu.style.height = winHeight + 'px';
            pic.style.height = winHeight + 'px';
            //body[0].style.height = newHeight + 'px';
            //body[1].style.height = newHeight2 + 'px';
            keyBox.style.height = newHeight - 120 + 'px';
            imgBox.style.height = newHeight - 120 + 'px';
            //detail.style.height = newHeight2 - 93 + 'px';
            if (tbody) tbody.style.height = newHeight2 - 133 + 'px';

            var t = that.dataType
            if (t == 900 || t == 910 || t == 3000) {
                body[0].style.height = that.isSelf ? winHeight + 'px' : newHeight + 'px';
                keyBox.style.height = that.isSelf ? winHeight - 50 + 'px' : keyBox.style.height + 'px';
            }
        },
        /**
         * 旋转图片
         **/
        rotationImg: function(className, target) {
            var box = target.parentNode,
                target = box.querySelector('img'),
                className = target.className,
                w = target.offsetWidth,
                h = target.offsetHeight,
                offset = w > h ? parseInt((w - h) / 2) : parseInt((h - w) / 2);
            box.style.padding = 0;
            if (className.match('rotate90')) {
                target.className = 'img-responsive imgRepeat rotate180'
            } else if (className.match('rotate180')) {
                target.className = 'img-responsive imgRepeat rotate270'
            } else if (className.match('rotate270')) {
                target.className = 'img-responsive imgRepeat'
            } else {
                target.className = 'img-responsive imgRepeat rotate90'
            }
        },
        /**
         * 平安案件挂起
         **/
        hangUp: function() {
            var that = this;
            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: '确认是否挂起',
                buttons: [
                    { text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal' },
                    { text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal' }
                ],
                onClick: function(value, e) {
                    if (value == 0) {
                        that.submitData('cache', 'hang');
                    }
                }
            });

        },
        /**
         * 切换左侧缩略图菜单
         **/
        toggleMenu: function(target, className) {
            var parent = target.parentNode,
                body = document.querySelector('.right-body'),
                imgBox = body.querySelector('.imgRepeatBox');
            if (className.match('glyphicon-triangle-left')) {
                body.className = 'right-body active';
                target.className = 'glyphicon glyphicon-triangle-right';
                parent.style.left = '-200px';
                target.style.color = '#ff9729';
                target.style.background = '#fff';
                var width = imgBox.parentNode.className.match('col-md-12') ? imgBox.parentNode.offsetWidth - 30 : imgBox.parentNode.offsetWidth
                imgBox.style.width = width + 'px';
            } else if (className.match('glyphicon-triangle-right')) {
                body.className = 'right-body';
                target.className = 'glyphicon glyphicon-triangle-left';
                parent.style.left = 0;
                target.style.color = '#fff';
                target.style.background = '#ff9729';
                var imgWidth = ((body.offsetWidth - 200) / body.offsetWidth) * (imgBox.parentNode.offsetWidth + 170)
                imgBox.style.width = imgWidth + 'px'
            };
        },
        /**
         * 处理单据图片功能
         **/
        dragImg: function() {
            var detail = document.querySelector('.detail-show'),
                box = detail.querySelector('.imgRepeatBox'),
                img = box.querySelector('img'),
                width = box.parentNode.clientWidth,
                height = img.clientHeight,
                clientX = 0,
                clientY = 0,
                left = 0,
                top = 0;
            box.style.width = width + 'px';
            /**
             * 拖拽图片
             **/
            img.ondragstart = function(event) {
                clientX = event.clientX || event.screenX;
                clientY = event.clientY || event.screenY;
                left = parseInt(img.style.left.split('px')[0]) || 0;
                top = parseInt(img.style.top.split('px')[0]) || 0;
            }
            img.ondrag = function(event) {
                event.preventDefault();
                var oLeft = (event.clientX || event.screenX) - clientX + left,
                    oTop = (event.clientY || event.screenY) - clientY + top;
                img.style.position = 'absolute';
                img.style.left = oLeft + 'px';
                img.style.top = oTop + 'px';
            }
            img.ondragend = function(event) {
                    event.preventDefault();
                    left = (event.clientX || event.screenX) - clientX + left;
                    top = (event.clientY || event.screenY) - clientY + top;
                    img.style.position = 'absolute';
                    img.style.left = left + 'px';
                    img.style.top = top + 'px';
                }
                /**
                 * 鼠标滚轮单据图片放大
                 **/
            var scrollFunc = function(event) {
                event.preventDefault();
                if (event.wheelDelta) {
                    scrollImg(event.wheelDelta)
                } else if (event.detail) {
                    scrollImg(event.detail)
                }
            }
            var scrollImg = function(detail) {
                    var img = box.querySelector('img'),
                        width = img.clientWidth;
                    if (detail > 0 && width < 1660) {
                        width += 10;
                        img.style.width = width + 'px'
                    } else {
                        if (width < 400) return;
                        width -= 10;
                        img.style.width = width + 'px'
                    }
                }
                /*注册事件*/
            if (document.addEventListener) {
                box.addEventListener('DOMMouseScroll', scrollFunc, false);
            }
            box.onmousewheel = scrollFunc;
        },
        /**
         * enter键功能
         **/
        enterKey: function(dom) {
            var that = this,
                _this = $(dom),
                keyBoxInput = $('#detail-keyBox [data-type]'),
                keyBoxLen = keyBoxInput.length,
                keyBoxName = keyBoxInput.eq(keyBoxLen - 1).attr('name'),
                detailInput = _this.closest('.detail-tr').find('input'),
                detailLen = detailInput.length,
                detailName = detailInput.eq(detailLen - 1).attr('name');
            $(window).off('keyup')
            if (keyBoxName == dom.name || detailName == dom.name) {
                $(window).off('keyup').on('keyup', function(event) {
                    if (event.keyCode == 13) {
                        that.addTollList()
                    }
                })
            }
            if (dom.name == 'selfPayRate') {
                var value = dom.value
                if (that.isWanjia) return;
                if (parseFloat(value)) {
                    if (value > 100) {
                        A.alert('比例数值太大，无法计算')
                    } else {
                        value > 1 ? _this.val(parseFloat(value / 100).toFixed(2)) : _this.val(parseFloat(value))
                    }
                }
            }
            if (dom.name == 'actualPrice') {
                var tr = _this.closest('.detail-tr'),
                    amount = tr.find('[name="amount"]').val() * 1000,
                    price = tr.find('[name="price"]').val() * 10;
                if (amount == 0 || price == 0) return
                try {
                    dom.value = parseFloat(((amount * price) / 10000).toFixed(2))
                } catch (e) {
                    dom.value = parseFloat((amount * price).toFixed(2))
                }
            }

            if (dom.getAttribute('data-img')) {
                var img = '<img src="' + dom.getAttribute('data-img') + '"><br><img src="' + dom.getAttribute('data-Original') + '">'
                A.widget.tooltip.show({
                    message: img,
                    placement: 'top',
                    toImg: true,
                    target: _this
                });
            }
        },
        /**
         * 增加一条收据药品项
         **/
        addTollList: function() {
            var that = this,
                dom = $('#detail-table .detail-tbody'),
                detailIndex = that.detailIndex || 0;

            that.detailIndex = detailIndex + 1;

            dom.append(that.mappingList)

            var tr = dom.find('.detail-tr').eq(dom.find('.detail-tr').length - 1),
                input = tr.find('input'),
                width = (100 / (input.length - 1)) + '%';
            input.each(function(index, el) {
                el.removeAttribute('data-img', '')
                el.removeAttribute('data-original', '')
                el.setAttribute('data-index', detailIndex)
                el.setAttribute('value', '')
                if (el.type != 'hidden') {
                    el.parentNode.style.width = width
                    el.parentNode.style.float = 'left'
                }
            });
            that.createMenu(that.dataType);
            input.off('focus').on('focus', function(event) {
                // if(this.name == 'belongsType'){
                //     that.activeInput = this;
                //     that.registerChange();
                // }
                that.enterKey(event.target);
            }).on('blur', function(ev) {
                if(that.activeInput){
                    setTimeout(function(){
                        that.unRegisterChange();
                    }, 500)
                }
                that.inputBlur(ev.target);
            });
            input.eq(0).focus();
            // 费用类型
            if (that.isXinanyi) {
                if (that.dataType == 300) that.itemXinanyi();
                // if ( that.dataType == 400 ) that.itemMedication();
                // 银行模糊匹配接口
                if (that.dataType == 3000) that.bankName();
            }
            if (that.dataType && that.isWanjia) that.itemDrug();
            if (that.isPingan || that.isTaibaoMobel) that.itemTernary(that.res.tenantId)

        },
        /**
         * 输入框blur事件
         **/
        inputBlur: function(dom) {
            var that = this,
                _this = $(dom);
            if (that.isPingan) {
                // 根据自负比例计算出自费金额
                if (dom.name == 'selfPayRadio' || dom.name == 'egoRatio') {
                    var value = parseFloat(dom.value)
                    if (value == 0 ? true : value) {
                        var tr = _this.closest('.detail-tr'),
                            moneyAmount = tr.find('[name="moneyAmount"]').length > 0 ? tr.find('[name="moneyAmount"]').val() : tr.find('[name="actualPrice"]').val(),
                            zifei = tr.find('[name="zifei"]').length > 0 ? tr.find('[name="zifei"]') : tr.find('[name="egoPrice"]'),
                            type = dom.name == 'egoRatio' ? tr.find('[name="medicareType"]') : tr.find('[name="grade"]');
                        if (value == 0) {
                            type.val('甲类')
                        } else if (value >= 100) {
                            type.val('丙类')
                        } else {
                            type.val('乙类')
                        }
                        zifei.val(parseFloat((parseInt(moneyAmount * 100) * value) / 10000).toFixed(2))
                    }
                };
                if (dom.name == 'inHospitalDiagnose') {
                    var diagnose = $('input[name="inHospitalDiagnoseCh"]').val();
                    if (_this.val() == 'HJZX10' && diagnose) {
                        that.pinganGather();
                    }
                }
            }

            //fesco明细大小项自动带出功能
            if (that.isFesco && dom.name == 'item') {
                var item = dom.value,
                    parent = _this.closest('.detail-tr'),
                    detailParent = parent.find('.detailParent'),
                    detailParentInput = parent.find('input[name="detailParent"]'),
                    data = {
                        name: item,
                        type: that.dataType,
                        tenantId: that.isFesco//10005
                    };
                that.order.isBigItem(data).then(function(res) {
                    if (res.data == "true") {
                        detailParent.html('大项' + ' <b class="caret"></b>');
                        detailParentInput.val(0);
                    } else if (res.data == "false") {
                        detailParent.html('小项' + ' <b class="caret"></b>');
                        detailParentInput.val(1);
                    }
                }, function(res) {
                    if (res.rtnCode != 2000) A.alert(res.rtnMsg);
                });
            }
            //太保移动明细大小项自动带出功能
            if (that.isTaibaoMobel && (dom.name == 'item' || dom.name == 'itemName')) {
                var item = dom.value,
                    parent = _this.closest('.detail-tr'),
                    detailParent = parent.find('.detailParent'),
                    detailParentInput = parent.find('input[name="detailParent"]'),
                    grade = parent.find('input[name="grade"]').length > 0 ? parent.find('input[name="grade"]') : parent.find('[name="medicareType"]'),
                    level = parent.find('input[name="egoRatio"]').length > 0 ? parent.find('input[name="egoRatio"]') : parent.find('input[name="selfPayRadio"]'),
                    data = {
                        name: item,
                        type: that.dataType,
                        tenantId: that.res.tenantId,
                        isGetSelfPayRadio: true,
                        hospitalId: that.dataInfo.hospitalId
                    };
                that.order.getItemInfo(data).then(function(res) {
                    var data = res.data;
                    grade.val(data.grade || "")
                    level.val(data.selfPayRadio || "")
                }, function(res) {
                    if (res.rtnCode != 2000) A.alert(res.rtnMsg);
                });
            }
        },
        //拒单
        refuseOrder: function(){
            var that = this;
            A.widget.loading.show({
                message: '数据提交中...'
            });
            that.order.changeStatusState({
                id: that.changeStatusId || that.res.autoId,
                destStatus: $('input[name="receiptStatus"]').val(),
                message: that.refuseVal
            }).success(function(res) {
                that.reload();
            }).fail(function(res) {
                A.alert(res.rtnMsg)
                A.widget.loading.hide()
            }).notLogin(function() {
                A.login.show(function(user) {
                    that.loadData()
                });
            });
            // that.order.savePaymentRetroversion({
            //     message: that.refuseVal,
            //     caseNo: that.dataInfo.caseNo,
            //     paymentNo: that.dataInfo.paymentNo,
            //     paymentId: that.dataInfo.id,
            //     tenantId: that.dataInfo.tenantId
            // }).success(function(res){
            //     that.reload();
            // }).fail(function(error){
            //     A.widget.loading.hide();
            //     A.alert(JSON.stringify(error))
            // }).notLogin(function(){
            //     A.alert('未登录');
            // });
        },
        /**
         * 提交信息处理函数
         **/
        submitInfo: function(ev, bool) {
            //to do 获取update的数据，获取insert的数据
            // ev.setAttribute('disabled', true);
            var that = this,
                id = that.dataInfo.id,
                data = that.dataInfo,
                receiptStatus = $('input[name="receiptStatus"]').val();
            //检查页面是否拒绝
            if(receiptStatus == '30100' || receiptStatus == '20100'){
                if(that.refuseVal){
                    if(that.refuseVal == 'other'){
                        var val = $('#refuse-text').val();
                        if(val == ''){
                            A.alert('请输入拒绝原因');
                            return;
                        }
                        that.refuseVal = val;
                    }
                    that.refuseOrder();
                    return;
                }else{
                    A.alert('请选择拒绝原因');
                    return;
                }
            }
            
            if(!that.checkFormData()) {
                A.alert('日期字段不合法，请重新输入');
                return;
            }

            A.widget.loading.show({
                message: '数据修改中...'
            });
            if (that.hospitalId && data.hospitalId != that.hospitalId) {
                // 修改医院
                that.correctHospital({
                    "id": that.res.autoId,
                    "type": that.dataType,
                    "hospitalId": that.hospitalId
                })
            } else if (receiptStatus) { // 判断是否修改单据类型
                that.changeStatus(receiptStatus);
            } else { // 不改类型正常提交
                if (bool) {
                    that.submitData(bool);
                } else {
                    that.submitData();
                }
                // 续打发票
                if (that.isContinue == 1) {
                    that.order.addRelate({
                        currentId: that.res.autoId,
                        parentId: that.res.parentId
                    })
                }
            }
        },
        checkFormData: function(){
            var that = this,
                isValid = true,
                isDateRight = function(val, format){
                    var date = val.toDate(format);
                    if(!date || val != date.toString(format)) return false;
                    return true
                };
            A.each($('.main-Tpl [data-type]'), function(i, dom) {
                var name = dom.name,
                    value = dom.value;
                if(name.match('Date') && value){
                    if(!isDateRight(value, 'yyyyMMdd') && !isDateRight(value, 'yyyy-MM-dd')){
                        isValid = false;
                        return false;
                    }
                }
            });
            return isValid;
        },
        /**
         * 处理提交数据
         **/
        submitData: function(bool, flag) {
            var that = this,
                type = that.dataType,
                interface = '',
                costAll = 0,
                data = that.getMappingData();
            // 处方信息
            if (type == 100) {
                interface = 'upPrescription'
                if (!bool) that.order.updateStatus(that.res.autoId);
                // 收据、门特、结算单
            } else if (type == 200 || type == 300 || type == 800 || type == 900 || type == 910) {
                interface = 'upReceipt';
                if (type == 300) data.socialMedicalType = that.isMedicare;
                // 收据清单
            } else if (type == 400 || type == 410) {
                interface = 'upHospitalCosts'
                    // 住院小结
            } else if (type == 600) {
                interface = 'updateDischargeSummary'
                    // 理赔申请书
            } else if (type == 3000) {
                var newData = {
                    insurancedPerson: {},
                    applyPersonList: [],
                    recipientPersonList: []
                };
                A.each(data, function(i, k) {
                    if (i == 'detailList') {
                        A.each(data[i], function(index, el) {
                            if (el.recipient == 1) {
                                newData.recipientPersonList.push(el);
                                if (data[i].length == 1) newData.applyPersonList.push(el);
                            } else {
                                newData.applyPersonList.push(el);
                            }
                        });
                    } else if (i == 'accidentDate' || i == 'accidentCode' || i == 'paymentNo') {
                        newData[i] = data[i];
                    } else {
                        newData.insurancedPerson[i] = data[i];
                    }
                })
                if (that.isSelf) {
                    newData.applyPersonList = [];
                    newData.insurancedPerson.relation = 401
                    newData.recipientPersonList[0] = newData.insurancedPerson;
                    newData.applyPersonList[0] = newData.insurancedPerson;
                }
                newData.autoId = that.res.autoId;
                data = newData
                interface = 'updateClaim'
            }

            if (bool == 'cache') {
                data.isTemporaryFlag = true;
                if (flag == 'withDraw') data.isCaseBack = true;
            } else {
                data.isTemporaryFlag = false;
            }
            if (interface == '') {
                A.alert('未知单据, 请联系相关的研发人员')
                return false;
            } else {
                that.order[interface](data).success(function(res) {
                    if (bool == 'cache') {
                        if (flag == 'hang') {
                            var pram = { 'paymentNo': that.dataInfo.paymentNo, 'hangup': 1 };
                            that.order.hangUpForPingAn(pram).success(function(res) {
                                that.reload();
                            }).fail(function(res) {
                                A.alert(res.rtnMsg)
                            })
                        } else {
                            A.alert('暂存数据成功');
                            A.widget.loading.hide();
                            that.reload();
                        }
                    } else if (bool == 'save') {
                        if (that.isXinanyi) {
                            that.order.getXml(data.paymentNo).success(function(res) {
                                if (res.rtnMsg == 'false') {
                                    that.order.paymentCheckComplate({ 'id': that.res.autoId }).success(function() {
                                        that.reload();
                                    })
                                } else {
                                    A.widget.loading.hide()
                                    that.showXmlData(res)
                                }
                            })
                        } else if (that.isWanjia && (that.dataType == 200 || that.dataType == 300 || that.dataType == 800)) {
                            that.showWanjiaCode()
                        } else if (that.isPingan) {
                            that.reload();
                        } else {
                            that.order.paymentCheckComplate({ 'id': that.res.autoId }).success(function() {
                                that.reload();
                            })
                        }
                    } else {
                        that.reload();
                    }
                }).fail(function(res) {
                    A.alert(res.rtnMsg);
                    A.widget.loading.hide();
                }).notLogin(function() {
                    A.login.show(function(user) {
                        that.loadData()
                    });
                })
            }
        },
        showWanjiaCode: function() {
            var that = this,
                timer = null;
            A.widget.loading.hide();
            that.order.getPaymentWanjiaHostpital(that.res.autoId).success(function(res) {
                $('#wanjiaHospitalName').val(res.hostpitalName)
                $('#wanjiaHospitalCode').val(res.hostpitalCode)
            }).fail(function(res) {
                A.alert(res.rtnMsg)
            })
            $('#wanjiaHospitalName').off('input').on('input', function(e) {
                var lastTime = e.timeStamp;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    if (lastTime - e.timeStamp != 0) return;
                    that.order.getWanjiaHostpital(e.target.value).success(function(res) {
                        $('#wanjiaHospitalCode').val(res.hostpitalCode)
                    }).fail(function(res) {
                        A.alert(res.rtnMsg)
                    })
                }, 300)
            });
            $('#modifyHospital').modal('show');
            $('#modifyHospitalBtn').on('click', function(event) {
                var data = {
                    autoId: that.res.autoId,
                    hospitalName: $('#wanjiaHospitalName').val(),
                    hospitalCode: $('#wanjiaHospitalCode').val()
                }

                that.order.updateWanjiaHostpital(data).success(function(res) {
                    that.order.paymentCheckComplate({ 'id': that.res.autoId }).success(function() {
                        that.reload();
                    })
                }).fail(function(res) {
                    A.alert(res.rtnMsg)
                })
            })
        },
        /**
         * 处理数据
         */
        JSONFormat: function(data) {
            var _toString = Object.prototype.toString;

            function format(object, indent_count) {
                var html_fragment = '';
                switch (_typeof(object)) {
                    case 'Null':
                        0
                        html_fragment = _format_null(object);
                        break;
                    case 'Boolean':
                        html_fragment = _format_boolean(object);
                        break;
                    case 'Number':
                        html_fragment = _format_number(object);
                        break;
                    case 'String':
                        html_fragment = _format_string(object);
                        break;
                    case 'Array':
                        html_fragment = _format_array(object, indent_count);
                        break;
                    case 'Object':
                        html_fragment = _format_object(object, indent_count);
                        break;
                }
                return html_fragment;
            };

            function _format_null(object) {
                return '<span class="json_null">null</span>';
            }

            function _format_boolean(object) {
                return '<span class="json_boolean">' + object + '</span>';
            }

            function _format_number(object) {
                return '<span class="json_number">' + object + '</span>';
            }

            function _format_string(object) {
                object = object.replace(/\</g, "&lt;");
                object = object.replace(/\>/g, "&gt;");
                if (0 <= object.search(/^http/)) {
                    object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
                }
                return '<span class="json_string">"' + object + '"</span>';
            }

            function _format_array(object, indent_count) {
                var tmp_array = [];
                for (var i = 0, size = object.length; i < size; ++i) {
                    tmp_array.push(indent_tab(indent_count) + format(object[i], indent_count + 1));
                }
                return '<span data-type="array" data-size="' + tmp_array.length + '">[<br/>' + tmp_array.join(',<br/>') + '<br/>' + indent_tab(indent_count - 1) + ']</span>';
            }

            function _format_object(object, indent_count) {
                var tmp_array = [];
                for (var key in object) {
                    tmp_array.push(indent_tab(indent_count) + '<span class="json_key">"' + key + '"</span>:' + format(object[key], indent_count + 1));
                }
                return '<span  data-type="object">{<br/>' + tmp_array.join(',<br/>') + '<br/>' + indent_tab(indent_count - 1) + '}</span>';
            }

            function indent_tab(indent_count) {
                return (new Array(indent_count + 1)).join('&nbsp;&nbsp;&nbsp;&nbsp;');
            }

            function _typeof(object) {
                var tf = typeof object,
                    ts = _toString.call(object);
                return null === object ? 'Null' :
                    'undefined' == tf ? 'Undefined' :
                    'boolean' == tf ? 'Boolean' :
                    'number' == tf ? 'Number' :
                    'string' == tf ? 'String' :
                    '[object Function]' == ts ? 'Function' :
                    '[object Array]' == ts ? 'Array' :
                    '[object Date]' == ts ? 'Date' : 'Object';
            };

            function loadCssString() {
                var style = document.createElement('style');
                style.type = 'text/css';
                var code = Array.prototype.slice.apply(arguments).join('');
                try {
                    style.appendChild(document.createTextNode(code));
                } catch (ex) {
                    style.styleSheet.cssText = code;
                }
                document.getElementsByTagName('head')[0].appendChild(style);
            }

            loadCssString(
                '.json_key{ color: #92278f;font-weight:bold;}',
                '.json_null{color: #f1592a;font-weight:bold;}',
                '.json_string{ color: #3ab54a;font-weight:bold;}',
                '.json_number{ color: #25aae2;font-weight:bold;}',
                '.json_link{ color: #717171;font-weight:bold;}',
                '.json_array_brackets{}');

            return format(data, 1);
        },
        /**
         * 显示xml结构化数据
         */
        showXmlData: function(res) {
            var that = this,
                bankCode = [],
                hospitalCode = [],
                requestData = res.data.requestData,
                returnData = res.data.returnData,
                string = that.JSONFormat(returnData);
            A.each(returnData.xinAnYiLingKuanRenInfo, function(index, el) {
                bankCode.push('<span class="banks">银行名称：<input class="form-control" name="bankName" value="' + el.bankName + '">&nbsp;&nbsp;银行code：<input class="form-control" name="bankCode" value="' + el.bankCode + '"><input class="form-control" type="hidden" name="id" value="' + el.id + '"></span>')
            });
            A.each(returnData.xinAnYiEventInfo, function(index, el) {
                hospitalCode.push('<span class="hospitals">医院名称：<input class="form-control" name="hospitalName" value="' + el.hospitalName + '">&nbsp;&nbsp;医院code：<input class="form-control" name="hospitalCode" value="' + el.hospitalCode + '"><input class="form-control" type="hidden" name="invoiceId" value="' + el.invoiceId + '"></span>')
            });
            $('.title-input').html(bankCode.join('') + hospitalCode.join(''))
            var type = { '10': '身份证', '11': '居住证', '12': '护照', '13': '港澳通行证', '14': '户口本', '15': '军官证', '0': '其他' };
            var gender = ['其他', '男', '女'];
            var accident = ['', '意外', '疾病', '其他'];
            var ceshi = ['caseNo', 'tenantAccidentDate', 'tenantAccidentCode', 'idNumber', 'gender', 'name', 'certificateType', 'branchId', 'subbranchId']
            A.each($('.title-sub-list'), function(index, dom) {
                var val = requestData[ceshi[index]];
                if (index == 1) val = new Date(val).toString()
                if (index == 2) val = accident[val]
                if (index == 4) val = gender[val]
                if (index == 6) val = type[val]
                $(dom).html(val)
            });
            $('#showXml .modal-body').html(string)
            $('#showXml').modal('show');
            $('#showXmlBtn').on('click', function(event) {
                var data = { "paymentNo": that.dataInfo.paymentNo, banks: [], hospitals: [] }
                var getData = function(className, spanIndex, spanEl) {
                    data[className][spanIndex] = {}
                    my.each($(spanEl).find('input'), function(index, el) {
                        var key = el.name,
                            val = el.value
                        data[className][spanIndex][key] = val;
                    });
                }
                my.each($('.title-input .banks'), function(spanIndex, spanEl) {
                    getData('banks', spanIndex, spanEl)
                });
                my.each($('.title-input .hospitals'), function(spanIndex, spanEl) {
                    getData('hospitals', spanIndex, spanEl)
                });
                that.order.upCode(data).success(function(res) {
                    that.order.paymentCheckComplate({ 'id': that.res.autoId }).success(function() {
                        that.reload();
                    })
                }).fail(function(res) {
                    A.alert(res.rtnMsg)
                })
            });
        },
        /**
         * 单据类型改成其他单据
         **/
        otherOrder: function(pic_type) {
            var that = this,
                data = { autoId: that.res.autoId, type: pic_type }
                // 拒单
            that.order.otherOrder(data).success(function(res) {
                A.widget.loading.hide();
                that.reload()
            }).fail(function(res) {
                A.alert(res.rtnMsg)
            }).notLogin(function() {
                A.login.show(function(user) {
                    that.loadData()
                });
            })
        },
        /**
         * 修改医院
         **/
        correctHospital: function(data) {
            var that = this;
            that.order.correctPaymentInfo(data).success(function(res) {
                that.reload();
            }).fail(function(res) {
                A.alert(res.rtnMsg)
                A.widget.loading.hide()
            }).notLogin(function() {
                A.login.show(function(user) {
                    that.loadData()
                });
            })
        },
        /**
         * 单据状态重置
         **/
        changeStatus: function(status) {
            var that = this;
            var data = {
                id: that.changeStatusId || that.res.autoId,
                destStatus: status
            };
            A.widget.loading.hide();
            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: '请确认要重置的是当前看的影像',
                buttons: [
                    { text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal' },
                    { text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal' }
                ],
                onClick: function(value, e) {
                    if (value == 0) {
                        that.order.changeStatusState(data).success(function(res) {
                            that.reload();
                        }).fail(function(res) {
                            A.alert(res.rtnMsg)
                            A.widget.loading.hide()
                        }).notLogin(function() {
                            A.login.show(function(user) {
                                that.loadData()
                            });
                        })
                    }
                }
            });

        },
        /**
         * 快捷键操作
         **/
        hotKey: function() {
            var that = this;
            $(window).off('keyup').on('keyup', function(event) {
                event.preventDefault();
                var code = event.keyCode;
                if (code == 33) {
                    var imgs = $('.pic img');
                    var imgId = $('.pic .cur').eq(1).attr('id');
                    A.each(imgs, function(index, el) {
                        if (imgId == el.id) {
                            imgs.eq(index - 1).click();
                        }
                    });
                }
                if (code == 34) {
                    var imgs = $('.pic img');
                    var imgId = $('.pic .cur').eq(1).attr('id');
                    A.each(imgs, function(index, el) {
                        if (imgId == el.id) {
                            imgs.eq(index + 1).click();
                            return;
                        }
                    });
                }
            });
        },
        /**
         * 案件撤回检查 
         */
        isWithdraw: function() {
            var that = this;
            var searchData = { "paymentNo": that.dataInfo.paymentNo };
            var request = A.ajax({
                url: that.ServerPath + '/casePreprocess/checkWithdraw',
                emulate: true,
                data: searchData,
                type: "GET",
                dataType: 'json',
                timeout: 60000,
                success: function(res) {
                    if (res.data.isBack == 1) {
                        that.submitData('cache', 'withDraw');
                    } else if (res.data.isBack == 0) {
                        that.isWithdraw();
                    }
                },
                error: function(xhr, txt, status) {
                    if (txt == 'timeout') {
                        request.abort();
                        that.isWithdraw();
                    }
                }
            });
        },
         /**
          * 模糊查询时缓存医院信息
          */
         getPinganHospitalCode: function(fuc, op, item) {
            var that = this;
            if (that.isPingan) that.getHospitalCode(item.name);
         }
    });

    $(function() {
        var page = new CT()
        page.onReady()
    });

})(my);
