;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.ukang, {
        onReady: function () {
            var that = this;
            that.detail=A.service.detail;
            that.initData();
            that.initEvent();
        },
        initData: function(){
            var that = this;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                    that.loadData();
                });
            });
            var params = A.getParams();
            $('#paymentNo').html(params.id);
            $("#payment").html(that.getStatusTxt(A.getParams().status));
            $('#paymentDate').html((new Date(parseInt(params.date))).toString('yyyy-MM-dd'));
            that.loadData();
        },
        initEvent: function(){
            var that = this;
            that.table = A.widget.bTable({
                container: '#drug-container',
                tableClass: 'table table-bordered table-hover lipeidan-person',
                collumns:[{
                        title: '就诊日期',
                        field: 'visitDate',
                        class: 'visitDate',
                        editor : {
                            type: 'datetimepicker',
                            pattern: {
                                '^\\S+$': '请输入就诊日期'
                            },
                            options: {
                                endDate: new Date()
                            }
                        },
                        formatter: function(value, rowValue, index){
                            var date = (new Date(value)).toString('yyyy-MM-dd');
                            return value=='合计' ? value : date;
                        }
                    },{
                        title: '收据数量',
                        field: 'invoiceNum',
                        class: 'invoiceNum',
                        editor : {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入收据数量'
                            }
                        },
                    },{
                        title: '收据金额',
                        field: 'invoiceAmount',
                        class: 'invoiceAmount',
                        editor : {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入收据金额'
                            }
                        },
                        formatter: function(value){
                            return value.toFixed(2);
                        }
                    },{
                        title: '病因',
                        field: 'diseaseCause',
                        class: 'diseaseCause',
                        editor : {
                            type: 'text',
                            pattern: {
                                '^\\S+$': '请输入病因'
                            }
                        }
                    }]
            });
            
            //切换理赔单和详情，重新调整高度
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                that.resizeHeight();
                A.widget.tabDetail.cancelEdit()
            });
        },
        handleEvent: function(e){
            var that = this,
                target = e.target,
                className = target.className;
            if(className == 'beforeedit'){//点击使之处于可编辑状态
                target.parentNode.className = 'editing-flag';
                $('.personinfo-close').removeClass('hide');
                $('.personinfo-submit').removeClass('hide');
                $('.personinfo-edit').addClass('hide');
                return;
            }
            var id = target.id,
                messages = {
                    'receipt-defect':'由于单据不全拒绝该次理赔吗？',
                    'payment-commit': '您确定要审核完成吗？',
                    'personinfo-defect': '由于理赔人信息不全拒绝该次理赔吗'
                };
            if(messages[id]){
                A.widget.dialog.show({
                    title: '提示',
                    modalType: '',
                    modalDialog: 'modal-sm',
                    message: messages[id],
                    buttons:[{text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'},{text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'}],
                    onClick:function(value, e){
                        if(value == 0){
                            that.statusEdit(target.getAttribute('data-value'));
                        }
                    }
                });
                return;
            }
            // if(target.tagName == 'INPUT' && className.indexOf('editInput') >= 0){
            //     A.widget.tooltip.show({
            //         message: '<img src="' + target.getAttribute('data-img') +'">',
            //         placement: 'top',
            //         target: $(target)
            //     });
            // }
            var ret = A.widget.tabDetail.processEvent(target);
            if(ret === true) return;
            //其他未处理的事件
        },
        loadData: function(){
            var that = this;
            A.widget.loading.show({message: '数据查询中...'});
            var params = A.getParams();
            that.detail.getPaymentDetail(params.id,params.person).success(function (res){
                A.widget.loading.hide();
                that.showReceipt(res);
            }).notLogin(function (res){
                A.widget.loading.hide();
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            });
            that.detail.getPaymentSummary(params.id,params.person).success(function (res){
                A.widget.loading.hide();
                that.showBasicInfo(res);
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
        /**
        * 修改status状态
        */
        statusEdit: function(status){
            var that = this,
                params = A.getParams();   
            A.widget.loading.show({message: '数据提交中...'});
            var jsonData={
                paymentId: params.id,
                personId:params.person,
                status:status
            };
            that.detail.updatePayment(jsonData).success(function (res){
                A.widget.loading.hide();
                A.alert('修改完成');
            }).notLogin(function (res){
                A.widget.loading.hide(); 
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            }); 
        },
        /**
        * 显示处方、收据等信息
        **/
        showReceipt: function(res){
            var that = this;
            res.imgPath = that.ServerPath + 'upload/download?fileName=';
            A.each(res.prescriptionList || [], function(_index, prescription){
                var sex = prescription.patientSex;
                if(sex == '1' || sex == '女'){
                    prescription._patientSex = '女';
                }else{
                    prescription._patientSex = '男';
                }
                prescription.visitDate = (new Date(parseInt(prescription.visitDate))).toString('yyyy-MM-dd')
            });
            A.each(res.receiptList || [], function(_index, receipt){
                var sex = receipt.receiptSex;
                if(sex == '1' || sex == '女'){
                    receipt.receiptSex = '女';
                }else{
                    receipt.receiptSex = '男';
                }
                receipt.tollDate = (new Date(parseInt(receipt.tollDate))).toString('yyyy-MM-dd')
            });
            A.widget.tabDetail._processProperty(res);
            A.widget.tabDetail({
                container:'.prescriptionDetail',
                data:res,
                templateId: 'tabDetail_template_002'
            });
            A.widget.tabDetail({
                container:'.receiptDetail',
                data:res,
                templateId: 'tabDetail_template_003'
            });
            if(res.receiptList.length==0){
                $('.receiptDetail').html('<h3 class="text-center" id="pagination-container-tips">您目前没有收据</h3>')
            }
            if((res.otherList || []).length==0){
                $('.otherDetail').html('<h3 class="text-center" id="pagination-container-tips">您目前没有其他单据</h3>')
            }
        },
        /*
        * 显示理赔人的基本信息
        */
        showBasicInfo: function(res){
            var that = this;
            var data = res.invocieInfo || [],
                userData = {},
                string = '',
                status = res.status;
            that.status = status;
            that.checkStatus(status);
            
            //显示订单状态
            // $('#payment').html(that.getStatusTxt(res.status));
            for (var i = data.length - 1; i >= 0; i--) {
                string += data[i].diseaseCause+' '
                data[i].visitDate = (new Date(data[i].visitDate)).toString('yyyy-MM-dd');
                data[i].invoiceAmount = res.invoiceAmountTotal;
                data.length > 0 ? data.push({visitDate:'合计',invoiceNum:res.invoiceNumTotal,invoiceAmount:res.invoiceAmountTotal,diseaseCause:string}) : null;
            };
            that.table.loadData(data);
            $('#drug-container').find('tr').eq(0).addClass('info');
            userData = res.userBasicInfo;
            userData.familyPerson = res.familyPerson || {};

            A.widget.tabDetail({
                container:'#lipeidanInfo',
                data:userData,
                templateId: 'tabDetail_template_001'
            });
            
            //更新左侧导航栏的高度
            that.resizeHeight();
            A.widget.loading.hide();
        },
        checkStatus: function(status){
            // var that = this;
            // if(status == 1000){//只有审核中的单据能编辑
            //     A.on(that, 'click', $('#detail-content')[0]);
            // }else{
            //     $('.personinfo-edit').remove();
            // }
            // if(status == 1999 || status == 1000){//只有审核中或审核完成的单子才能提交理赔单或完成理赔单
            //     A.on(that, 'click', $('#status-contianer')[0]);
            // }else{
            //     $('#status-contianer').remove();
            // }
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);

