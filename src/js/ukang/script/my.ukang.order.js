;(function (A) {
    var U = A.ukang,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, {
        onReady: function () {
            var that = this;
            that.order=A.service.order;
            that.family=A.service.family;
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
                var startTimeVal = $('#starttime').val(),
                    endTimeVal = $('#endtime').val(),
                    startTimeBool = startTimeVal!=='' ? true : false,
                    endTimeBool = endTimeVal!=='' ? true : false,
                    startTimeDate = new Date(startTimeVal),
                    endTimeDate = new Date(endTimeVal);
                if(startTimeBool && startTimeVal.toDate() === null){
                    A.alert('开始时间格式不正确,请重新输入');
                    return false;
                }
                if( endTimeBool && endTimeVal.toDate() === null) {
                    A.alert('结束时间格式不正确,请重新输入');
                    return false;
                }
                if(startTimeDate.compare(endTimeDate) > 0){
                    A.alert('开始时间不能大于结束时间');
                    return false;
                }
                that.loadData();
            });
            $('#starttime,#endtime').datetimepicker({
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                format: 'yyyy-mm-dd',
                pickerPosition: "bottom-left",
                endDate: new Date()
            }).on('changeDate', function(e) {
                if(e.target.id === 'starttime'){
                    var Time = new Date($('#endtime').val());
                    if (e.date > Time){
                        A.alert('开始时间不能大于结束时间');
                        e.target.value = Time;
                        e.data = Time;
                    }
                }else{
                    var Time = new Date($('#starttime').val()); 
                    if (e.date < Time){
                        A.alert('结束时间不能大于开始时间');
                        e.target.value = Time;
                        e.data = Time;
                    }
                }
            });
            that.table = A.widget.bTable({
                container: '#order-container',
                tableClass: 'table-condensed table-hover table-bordered',
                groupField: 'mainPaymentId',
                groupStyler: 'display:none',
                groupSort: false,
                onGroupFormatter: function(flag, row){
                    return flag;
                },
                getRowClass: function(row){
                    var classname = ''
                    if(row.isGroup){
                        classname = 'order-group';
                    }
                    else{
                        classname = 'order-not-group';
                    }
                    if(row.status == '0'){
                        classname += ' order-processing';
                    }
                    return classname;
                    // return row.isGroup ? '':'display:none';
                },
                collumns:[{
                        title: '理赔批次号',
                        field: 'mainPaymentId',
                        class: 'mainPaymentId',
                        formatter: function(value, row) {
                            if(row.isGroup){
                                if(row.status == 0){
                                    return value;
                                }
                                return '<span class="glyphicon glyphicon-plus group" groupflag="' + value + '" aria-hidden="true"></span><span>' + value + '</span>';
                            }else{
                                return '<a style="cursor: pointer;text-decoration: underline;">' + row.personId + '(' + row.personName + ')' + '</a>';
                            }
                        }
                    },{
                        title: '时间',
                        field: 'paymentDate',
                        formatter: function(value) {
                            var date = new Date(value);
                            return date.toString('yyyy-MM-dd HH:mm:ss');
                        }
                    },{
                        title: '状态',
                        field: 'status',
                        formatter: function(value, rowValue, index){
                            var buttons = [{
                                    text: that.getStatusTxt(value),
                                    tagName: 'span',
                                    value: 0,
                                    class: 'order-txt'
                            }];
                            if(value != 0 && value != 1000 && value != 1999 && value <2000){
                                buttons.push({
                                    text: '撤销理赔',
                                    value: -1,
                                    class: 'btn btn-default'
                                });
                            }
                            if(rowValue.familyStatus == '0'){
                                buttons.push({
                                    text: '补充家属信息',
                                    value: -2,
                                    class: 'btn btn-danger'
                                });
                            }

                            return buttons;
                        },
                        onClick: function(rowValue, rowIndex, target){
                            var value = target.data('value'),
                                _this = this;
                            if(value == '-1'){
                                A.widget.dialog.show({
                                    title: '提示',
                                    modalDialog: 'modal-sm',
                                    message: '是否取消该理赔单？',
                                    buttons:[
                                        {text: '取消', class: 'btn btn-default', value: 0, dismiss: 'modal'},
                                        {text: '确定', class: 'btn btn-danger', value: 1,dismiss: 'modal'}],
                                    onClick:function(value, e){
                                        if(value == '1'){
                                            //todo 调用ajax取消该订单
                                            that.cancelPayment(rowValue.mainPaymentId, rowValue.personId, rowIndex);
                                        }
                                    }
                                });
                                return false;
                            }else if(value == '-2'){
                                location.href = 'family.html?id=' + rowValue.personId;
                                return false;
                            }
                            return true;
                        }
                    }],
                onClick: function(rowValue, index){
                    var status = rowValue.status;
                    if(rowValue.isGroup){//展开或收起相关的行
                        if(status == 0){
                            that.startQueryTimer(rowValue);
                            return;
                        }else{
                            that.toggleTr(rowValue);
                            return;
                        }
                    }
                    if(rowValue.familyStatus == '0'){//家属信息不全
                        that.familyModel(rowValue)
                        // A.alert('家属<a href="family.html?id=' + rowValue.personId + '" title="点击补全家属信息" class="btn btn-link">' + (rowValue.personName || '点击补全家属信息') + '</a>的信息不全，请补全该家属的信息。');
                        return;
                    }
                    if(status > 1000 && status < 1999){
                        A.alert(that.getStatusTxt(status));
                        return;
                    }
                    if(status == 1999 || status == 2000 || status == 399 || status == 1000){
                        window.location = 'detail.html?id=' + rowValue.mainPaymentId 
                            + '&date=' + rowValue.paymentDate + '&status=' + rowValue.status + '&person=' + rowValue.personId;
                    }else{
                        A.alert('正在处理中，请稍后');
                    }
                }
            });
        },
        familyModel: function(v){
            var that = this;
            $('\
                <div id="familyModel" class="modal in" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
                    <div class="modal-dialog" role="document" style="margin-top: 201.667px;">\
                        <div class="modal-content">\
                            <div class="modal-header" style="border-bottom: 1px solid #e5e5e5;">\
                                查看图片检查姓名是否正确\
                            </div>\
                            <div class="modal-body" id="familyName"></div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                                <button type="button" class="btn btn-danger" id="submitFamilyName">确认提交</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>').appendTo(document.body);
            that.family.confirmPersonFamily(v.mainPaymentId,v.personId).success(function(res){
                    var btnTop = '<img class="buttons" src="'+that.ServerPath + 'upload/downloadNamePhoto?fileName=' + res.namePhoto + '" alt="姓名图片" title="请检查图片名字是否是家属？">\
                                    <input type="hidden" value="'+v.mainPaymentId+'" id="paymentId">\
                                    <input type="hidden" value="" id="personId">\
                                    <input type="hidden" value="" id="familyId">\
                                    <button type="button" class="btn btn-default buttons" name="'+v.personId+'">是本人</button>',
                    btnBottom = '<button type="button" class="btn btn-default buttons cur">以上都是不是</button>',
                        btn = btnTop,data,bool=true
                        familyName = $('#familyName'),
                        submitFamilyName = $('#submitFamilyName'),
                        list = res.personRelationList||'';
                    for (var i = 0;i < list.length; i++) {
                        btn+='<button type="button" class="btn btn-default buttons" id="'+list[i].id+'" name="'+v.personId+'">是'+list[i].name+'</button>'
                    };
                    $('#familyModel').modal('show');
                    familyName.html(btn+btnBottom);
                    var paymentId = $('#paymentId'),
                        personId = $('#personId'),
                        familyId = $('#familyId');
                    familyName.off('click');
                familyName.on('click', 'button', function(e) {
                        bool=false;
                    var _this = $(e.target);
                    _this.addClass('btn-info').siblings('button').removeClass('btn-info');
                    if(_this.hasClass('cur')){
                            familyId.val('');personId.val('');
                        }else{
                        personId.val(e.target.name);familyId.val(e.target.id);
                        }
                    });
                    submitFamilyName.off('click');
                    submitFamilyName.on('click', function(event) {
                        if(bool) return;
                        var val1=paymentId.val(),val2=personId.val(),val3=familyId.val();
                        if(val3==''&&val2==''){
                            window.location = 'family.html'
                        return
                        }else if(val3==''){
                            data = {paymentId:val1,personId:val2}
                        update(data)
                        }else{
                            data = {paymentId:val1,personId:val2,familyId:val3}
                        update(data)
                        }
                    function update(data){
                        that.family.updatePersonFamialyStatus(data).success(function (res){
                            if(val3=='')
                            {
                                    window.location = 'detail.html?id=' + v.mainPaymentId + '&date=' + v.paymentDate + '&status=' + v.status + '&person=' + res.currPersonId;
                            }
                            else{
                                    window.location = 'detail.html?id=' + v.mainPaymentId + '&date=' + v.paymentDate + '&status=' + v.status + '&person=' + val3;
                                }
                        }).fail(function (res){
                            A.alert(res.rtnMsg);
                        }); 
                            }
                    
                    });
            }).fail(function (res){
                A.alert(res.rtnMsg);
                    // clearInterval(that.queryStatusTimer);
            });
        },
        startQueryTimer: function(rowValue){
            var that = this,
                html = '<div class="iloading-icon iloading-icon-loading" style="width:50p;height:50px;"></div><div style="text-align:center">正在处理中，请稍后</div>';
            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: html,
                buttons:[{text: '确定', class: 'btn btn-default', value: 0, dismiss: 'modal'}],
                events: {
                    "hide.bs.modal":function(){
                        clearInterval(that.queryStatusTimer);
                    }
                }
            });
            queryAjax();
            that.queryStatusTimer = setInterval(function(){
                queryAjax();
            }, 10000);
            function queryAjax(){
                if(that.queryAjax) that.queryAjax.abort();
                var jsonData={
                    startDate: '', 
                    endDate: '',
                    paymentId:rowValue.mainPaymentId,
                    pageNum : 1, 
                    pageSize:10
                };
                that.queryAjax = that.order.getPaymentList(jsonData).success(function (res){
                            var payment = res.paymentList[0],
                                isRight = true;
                            A.each(payment.subPayment, function(index, subPayment){
                                var _status = subPayment.status;
                                if(_status != 1999 && _status != 2000 && _status != 1000 && _status != 399){
                                    isRight = false;
                                }
                            })
                            if(isRight) {
                                clearInterval(that.queryStatusTimer);
                                var subPayment = payment.subPayment || [];
                                if(subPayment.length == 1){
                                    window.location = 'detail.html?id=' + payment.mainPaymentId + '&date=' + payment.paymentDate + '&status=' + payment.status + '&person=' + subPayment[0].personId;     
                                }else{
                                    that.queryEnd(payment);
                                }                                     
                            };
                }).fail(function (res){
                    A.alert(res.rtnMsg);
                        // clearInterval(that.queryStatusTimer);
                });
            }
        },
        queryEnd: function(payment){
            var that = this,
                table = that.table,
                data = table.data,
                mainPaymentId = payment.mainPaymentId;
            var subPayment = payment.subPayment || [];
            var status = payment.status;
            var index = -1;
            A.each(data, function(_index, d){
                if(d.mainPaymentId == mainPaymentId){
                    index = _index;
                    return false;
                }
            });
            var grouprow = {
                mainPaymentId: mainPaymentId,
                paymentDate: payment.paymentDate,
                status: status,
                isGroup: true
            };
            data.splice(index, 1, grouprow);
            index++;
            A.each(subPayment, function(_index, subdata){
                subdata.mainPaymentId = mainPaymentId;
                data.splice(index, 0, subdata);
                index++;
            });
            table.loadData(data);
            that.toggleTr(grouprow);
            A.widget.dialog.hide();
        },
        /**
        * 取消理赔
        */
        cancelPayment: function(paymentId, personId, rowIndex){
            var that = this;
            A.widget.loading.show({message:'理赔单取消中...'});
            that.order.canclePayment(paymentId,personId).success(function (res){
                    A.widget.loading.hide();
                    that.table.delRow(rowIndex);
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
        toggleTr: function(rowValue){
            var tbody = this.table.tbody,
                flag = rowValue.mainPaymentId,
                target = tbody.find('span.group[groupflag="' + flag + '"]');
            if(target.hasClass('glyphicon-minus')){
                target.removeClass('glyphicon-minus');
                target.addClass('glyphicon-plus');
                tbody.find('tr[flag="' + flag + '"]').hide();
                target.parent().parent().parent().show();
            }else{
                target.removeClass('glyphicon-plus');
                target.addClass('glyphicon-minus');
                tbody.find('tr[flag="' + flag + '"]').show();
            }
        },
        loadData: function(newPageNum){
            var that = this,
                pageNum = newPageNum || 1;
            A.widget.loading.show({message: '数据查询中...'});
            var jsonData={
                startDate: $('#starttime').val(), 
                endDate: $('#endtime').val(),
                paymentId: $('#searchVal').val(), 
                pageNum : pageNum, 
                pageSize:10
            };
            that.order.getPaymentList(jsonData).success(function (res){
                    res.pageNum = pageNum;
                    A.widget.loading.hide();
                        that.showData(res);
            }).notLogin(function (res){
                A.widget.loading.hide();
                        A.login.show(function(user){
                            that.onLogin(user);
                    that.loadData(newPageNum);
                        });
            }).fail(function (res){
                    A.widget.loading.hide();
                A.alert(res.rtnMsg);
            }); 
        },
        showData: function(res){
            var that = this,
                retData = res.paymentList||[],
                data = [];
            A.each(retData, function(index, payment){
                var subPayment = payment.subPayment || [];
                var status = 0;
                var group = {
                    mainPaymentId: payment.mainPaymentId,
                    paymentDate: payment.paymentDate,
                    status: 0,
                    isGroup: true
                };
                data.push(group);
                A.each(subPayment, function(_index, subdata){
                    var subStatus = subdata.status;
                    if(subStatus == 0) {
                        return false;
                        status = 0;
                    }
                    else if(subStatus > 1000 && subStatus < 1999){
                        status = subStatus;
                    }else if(subStatus == 1999 || subStatus == 2000){
                        if(status > 1000 && status < 1999) return;
                        else status = subStatus;
                    }else if(status == 0){
                        status = subStatus;
                    }
                });
                if(status == 0) return;
                group.status = status;
                A.each(subPayment, function(_index, subdata){
                    subdata.mainPaymentId = payment.mainPaymentId;
                    data.push(subdata);
                });
            });
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
