;
(function(A) {
    var U = A.admin,
        S = A.service,
        CT = function() {};
    A.extend(CT.prototype, A.base, U, S, {
        onReady: function() {
            var that = this;
            that.initData();
        },
        initData: function() {
            var that = this;
            that.initHeader(function() {
                that.initEvent();
                // that.loadData();
            });
        },
        initEvent: function() {
            var that = this,
                params = A.getParams();

            if (params.tenantId) {
                $('#tenantId').val(params.tenantId);
                $('#SN').val(params.tenantId);
            }

            $('#search').on('click', function() {
                that.loadData();
            });

            $('#exportExcel').on('click', function() {
                that.exportExcel();
            });

            $('#SN').change(function(event) {
                var tenantId = $('#SN option:selected').val();
                if (tenantId == "") {
                    location.href = location.href.split('?')[0]
                    return;
                }
                localStorage.setItem('tenantId', tenantId)
                that.order.bindTenant(tenantId).success(function(res) {
                    location.href = location.href.split('?')[0] + '?tenantId=' + tenantId
                }).fail(function(res) {
                    A.alert(res.rtnMsg)
                }).notLogin(function() {
                    A.login.show(function(user) {
                        that.loadData()
                    });
                })
            });
            that.getCustomReport();
            //平安增加案件挂起查询条件
            // if (localStorage.getItem('tenantId') == 10007 || localStorage.getItem('tenantId') == 10008) {
            if ($('#SN option:selected').val() == 10007 || $('#SN option:selected').val() == 10008) {
                var hangStr = '<div class="col-md-1">\
                        <input type="button" id="hangSearch" class="btn btn-primary" value="挂起查询" />\
                    </div>'
                $('#search').parent().after(hangStr);
                $('#hangSearch').on('click', function() {
                    that.hangFlag = true;
                    that.loadData();
                    that.hangFlag = false;
                });
                //平安增加解挂所有案件功能
                var hangDownAll = '<div class="col-md-1">\
                        <input type="button" id="hangDownAll" class="btn btn-primary" value="解挂所有" />\
                    </div>'
                $('#hangSearch').parent().after(hangDownAll);
                $('#hangDownAll').on('click', function() {
                    that.hangDownAllCase();
                })
            }
            that.timeEvent();
            that.table = A.widget.bTable({
                container: '#order-container',
                tableClass: 'table-condensed table-hover table-bordered',
                groupField: 'mainPaymentNo',
                groupStyler: 'display:none',
                groupSort: false,
                onGroupFormatter: function(flag, row) {
                    return flag;
                },
                getRowClass: function(row) {
                    var classname = '';
                    if (row.isGroup) {
                        classname = 'order-group';
                    } else {
                        classname = 'order-not-group';
                    }
                    return classname;
                },
                collumns: [{
                    title: '赔案号',
                    field: 'mainPaymentNo',
                    class: 'mainPaymentNo',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            return '<span class="glyphicon glyphicon-plus group" groupflag="' + value + '" aria-hidden="true"></span><span>' + row.caseNo + '</span><div>(' + row.tenantName + ')</div>';
                        } else {
                            var pretreatmentBy = row.pretreatmentBy || '',
                                pretreatmentDate = row.pretreatmentDate || '',
                                pretreatmentEndDate = row.pretreatmentEndDate || '';
                            return '图像预处理人:' + pretreatmentBy + '<div><a style=" cursor:text;text-decoration:none;">图像预处理时间:<br/>开始:' + pretreatmentDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束:' + pretreatmentEndDate + '</a></div>';
                        }
                    }
                }, {
                    title: '理赔批次号',
                    field: 'mainPaymentNo',
                    width: '220px',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            return value;
                        } else {
                            var sendDate = row.sendDate || '',
                                sendEndDate = row.sendEndDate || '';
                            return value + '<div><a style=" cursor:text;text-decoration:none;">回传时间:<br/>开始：' + sendDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束:' + sendEndDate + '</a></div>';
                        }
                    }
                }, {
                    title: '单据优先级',
                    field: 'rank',
                    formatter: function(value, rowValue) {

                        var bool = value == 4 ? 'checked="checked"' : '',
                            status = rowValue.status,
                            type = rowValue.type || '',
                            rank = value || 1,
                            html = '';
                        if (rowValue.isGroup) {
                            if (status == 20100 || status == 30100 || status == 35100) {
                                html = '<label>调高批次：</label><span><input class="check"' + rowValue.mainPaymentNo + ' type="checkbox" /></span><button style="margin-left:10px;" data-value="' + rank + '" class="full_rank btn btn-danger" id="' + rowValue.id + '">确认</button>'
                            }
                            return html;
                        } else {
                            type = that.getTypeName(type);
                            if (status == 20100 || status == 30100 || status == 35100) {
                                html = '<br/><span class="order-checkbox"><label>调高：</label><input type="checkbox" ' + bool + '></span><button style="margin-left:10px;" data-value="' + rank + '" class="customeraction btn btn-danger" id="' + rowValue.id + '">确认</button>'
                            }
                            return type + html;
                        }
                    },
                    onClick: function(rowValue, rowIndex, target) {

                        var value = target.data('value'),
                            input = target.prev().find('input')[0],
                            bool = input ? input.checked : false;
                        if (target.hasClass('customeraction')) { //单个调整
                            if (value == 4) {
                                A.alert('已经是最高优先级')
                                return
                            } else if (!bool) {
                                A.alert('请点击调高框')
                            } else {
                                that.order.raisePaymentRank({
                                    'autoId': rowValue.autoId
                                }).success(function(res) {
                                    A.alert('修改成功')
                                    target.data('value', 4)
                                }).fail(function(res) {
                                    A.alert(res.rtnMsg)
                                })
                            }
                        };
                        //全选调整
                        if (target.hasClass('full_rank')) {
                            if (!bool) {
                                A.alert('请点击调高框')
                            } else {
                                that.order.raisePaymentsRank({
                                    'paymentNo': rowValue.mainPaymentNo,
                                    "sn": rowValue.sn
                                }).success(function(res) {
                                    A.alert('修改成功')
                                    target.data('value', 4)
                                }).fail(function(res) {
                                    A.alert(res.rtnMsg)
                                })
                            }
                        };
                    }
                }, {
                    title: '理赔单时间',
                    field: 'paymentDate',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            if (!value) {
                                return ''
                            } else {
                                var date = new Date(value);
                                return date.toString('yyyy-MM-dd HH:mm:ss');
                            };
                        } else {
                            var entryBy = row.entryBy || '',
                                paymentDate = row.paymentDate || '',
                                paymentEndDate = row.paymentEndDate || '';
                            return '<div><a style=" cursor:text;text-decoration:none;">理赔单时间:<br/>开始:' + paymentDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束:' + paymentEndDate + '</a></div>';
                        }
                    }
                }, {
                    title: '录入开始时间',
                    field: 'entryDate',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            if (!value) {
                                return ''
                            } else {
                                var date = new Date(value);
                                return date.toString('yyyy-MM-dd HH:mm:ss');
                            };
                        } else {
                            var entryBy = row.entryBy || '',
                                entryDate = row.entryDate || '',
                                entryEndDate = row.entryEndDate || '';
                            return '录入人:' + entryBy + '<div><a style=" cursor:text;text-decoration:none;">录入时间:<br/>开始:' + entryDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束:' + entryEndDate + '</a></div>';
                        }
                    }
                }, {
                    title: '审核结束时间',
                    field: 'verifyEndDate',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            if (!value) {
                                return ''
                            } else {
                                var date = new Date(value);
                                return date.toString('yyyy-MM-dd HH:mm:ss');
                            };
                        } else {
                            if (value == null) {
                                return '未审核完成'
                            } else {
                                var verifyBy = row.verifyBy || '',
                                    verifyEndDate = row.verifyEndDate || '',
                                    verifyDate = row.verifyDate || '';
                                return '审核人:' + verifyBy + '<div><a style=" cursor:text;text-decoration:none;">审核时间:<br/>开始:' + verifyDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束:' + verifyEndDate + '</a></div>';
                            }
                        }
                    }
                }, {
                    title: '理赔人',
                    field: 'claimer',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            if (!value) {
                                return ''
                            } else {
                                return value;
                            };
                        } else {
                            var ocrDate = row.ocrDate || '',
                                ocrEndDate = row.ocrEndDate || '',
                                personName = row.personName || '';
                            return '理赔人姓名：' + personName + '(' + row.autoId + ')' + '<div><a style=" cursor:text;text-decoration:none;">OCR时间:<br/>开始：' + ocrDate + '</a><br/><a style=" cursor:text;text-decoration:none;">结束：' + ocrEndDate + '</a></div>';
                        }
                    }
                }, {
                    title: '状态',
                    field: 'status',
                    formatter: function(value, row, index) {
                        if (row.isGroup) {
                            if (!value) {
                                return ''
                            } else {
                                var buttons = []
                                buttons.push({
                                    text: that.getStatusTxt(value),
                                    tagName: 'span',
                                    value: 0,
                                    class: 'order-txt'
                                });
                                return buttons;
                            };
                        } else {
                            var status = row.status || '';
                            var buttons = []
                            buttons.push({
                                text: that.getStatusTxt(status),
                                tagName: 'span',
                                value: 0,
                                class: 'order-txt'
                            });
                            return buttons;
                        }
                    }
                }, {
                    title: '下载影像',
                    field: 'claimer',
                    formatter: function(value, row) {
                        if (row.isGroup) {
                            // return '<button data-value="0" class="btn btn-primary">下载</button>';
                            //平安添加解挂功能
                            if (row.isHangs) {
                                return '<button data-value="0" class="btn btn-primary">下载</button>\
                                        <button data-value="2" class="btn btn-primary">解挂</button>';
                            } else {
                                return '<button data-value="0" class="btn btn-primary">下载</button>';
                            }
                        } else {
                            return '<button data-value="1" class="btn btn-primary">查看单据</button>'
                        }
                    },
                    onClick: function(rowValue, rowIndex, target) {
                        var value = target.data('value');
                        if (value == '0') {
                            window.open(that.ServerPath + 'upload/downloadImagesFile?paymentNo=' + rowValue.mainPaymentNo + '&sn=' + rowValue.sn);
                            return false;
                        }
                        if (value == '1') {
                            that.goDetail(rowValue)
                            return false;
                        }
                        if (value == '2') {
                            that.hangDown(rowValue, target);
                            return false;
                        }
                    }
                }],
                onClick: function(rowValue, index) {
                    var status = rowValue.status;
                    //展开或收起相关的行
                    if (rowValue.isGroup) {
                        //获得相应案例的详情
                        if (!rowValue.sn) {
                            var data = { "paymentNo": rowValue.mainPaymentNo };
                            that.getPaymentDetailList(data, rowValue);
                        } else {
                            that.toggleTr(rowValue);
                        }
                        /*that.toggleTr(rowValue);
                        return;*/
                    }
                }
            });
        },
        goDetail: function(rowValue) {
            var data = rowValue.autoId + '&status=' + rowValue.status + '&type=' + rowValue.type;
            url = 'review.html?autoId=' + data;
            window.open(url, '_blank')
        },
        toggleTr: function(rowValue) {
            var tbody = this.table.tbody,
                flag = rowValue.mainPaymentNo,
                target = tbody.find('span.group[groupflag="' + flag + '"]');
            if (target.hasClass('glyphicon-minus')) {
                target.removeClass('glyphicon-minus');
                target.addClass('glyphicon-plus');
                tbody.find('tr[flag="' + flag + '"]').hide();
                target.parent().parent().parent().show();
            } else {
                target.removeClass('glyphicon-plus');
                target.addClass('glyphicon-minus');
                tbody.find('tr[flag="' + flag + '"]').show();
            }
        },
        loadData: function(newPageNum, checkUpdate) {
            var that = this,
                pageNum = newPageNum || 1,
                searchData = {
                    pageNum: pageNum,
                    pageSize: 10
                };
            if (!checkUpdate) {
                A.widget.loading.show({
                    message: '数据查询中...'
                });
            }
            A.each($('.form-control'), function(index, el) {
                if (el.value != '') searchData[el.id] = el.value
            });
            if ($('#SN').val()) {
                searchData['tenantId'] = $('#SN').val();
            }
            if (that.hangFlag) {
                searchData['hangSearch'] = true;
            }
            if (checkUpdate && that.listAjax) that.listAjax.abort();
            that.listAjax = A.ajax({
                url: that.ServerPath + 'getPaymentList',
                emulate: true,
                data: searchData,
                dataType: 'json',
                success: function(res) {
                    res.pageNum = pageNum;
                    A.widget.loading.hide();
                    if (res.rtnCode === '2000') {
                        //缓存一下数据
                        that.bufferData = res;
                        that.showData(res);
                    } else if (res.rtnCode === '2001') {
                        if (checkUpdate) {
                            return;
                        }
                        A.login.show(function(user) {
                            that.onLogin(user);
                            that.loadData(newPageNum);
                        });
                    } else {
                        if (checkUpdate) {
                            return;
                        }
                        that.showData(res);
                        A.alert('没有查出理赔单！');
                    }
                },
                error: function(xhr, txt, status) {
                    if (checkUpdate) return;
                    A.widget.loading.hide();
                    A.alert('查询失败，请重试！');
                }
            });
            if (!checkUpdate) that.listAjax = null;
        },
        showData: function(res) {
            var that = this,
                retData = res.paymentList || [],
                data = [];
            A.each(retData, function(index, payment) {
                var subPayment = payment.subPayment || [];
                var status = payment.status;
                var group = {
                    mainPaymentNo: payment.mainPaymentNo,
                    paymentDate: payment.paymentDate,
                    status: status,
                    caseNo: payment.caseNo,
                    sn: subPayment[0] ? subPayment[0].sn : '',
                    type: subPayment[0] ? subPayment[0].type : '',
                    tenantName: payment.tenantName,
                    //tenantName: that.getTenantName(subPayment[0].tenantId),
                    isGroup: true,
                    entryDate: payment.entryDate,
                    verifyEndDate: payment.verifyEndDate,
                    claimer: payment.claimer,
                    /*是否挂起状态*/
                    isHangs: payment.isHangs,
                };
                data.push(group);
                if (status == 0) return;
                var groupRate = 1;
                A.each(subPayment, function(_index, subdata) {
                    var paymentRate = 1;
                    A.each(subdata.rateList, function(__, rate) {
                        var _rate = parseFloat(rate.photoRate);
                        if (paymentRate > _rate) paymentRate = _rate;
                    });
                    subdata.rate = paymentRate;
                    subdata.mainPaymentNo = payment.mainPaymentNo;
                    data.push(subdata);
                });
            });
            if (data.length === 0) {
                $('#pagination-container-tips').removeClass('hide');
            } else {
                $('#pagination-container-tips').addClass('hide');
            }
            // that.table.data.insert()
            // that.table.loadData(that.table.data);
            that.table.loadData(data);
            if (!that.pagination) {
                A.widget.pagination({
                    container: '#pagination-container',
                    containerClass: 'order-pagination',
                    size: 5,
                    pageNumber: res.pageNum,
                    pageSize: 10,
                    total: res.total,
                    onPageChange: function(oldPaage, newPage) {
                        that.loadData(newPage)
                    }
                });
            } else {
                that.pagination.refresh({
                    pageNumber: res.pageNum,
                    total: res.total
                })
            }
        },
        /**
         * 处理时间
         */
        timeEvent: function() {
            $('#endTime,#startTime').datetimepicker({
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                format: 'yyyy-mm-dd',
                pickerPosition: "bottom-left-right-top"
            }).on('changeDate', function(e) {
                var Time = new Date(),
                    date = Time.toString('yyyy-MM-dd');
                if (e.target.className.match('validDate')) {
                    if (e.date < Time) {
                        A.alert('证件有效期不能小于' + date);
                        e.target.value = Time;
                        e.data = Time;
                    }
                } else if (e.target.className.match('birthDate')) {
                    if (e.date > Time) {
                        A.alert('出生日期不能大于' + date);
                        e.target.value = Time;
                        e.data = Time;
                    }
                }
            });
        },
        exportExcel: function() {
            A.widget.loading.show({
                message: '导出报表中...'
            });
            var that = this,
                data = {},
                reportId = $('#exportExcelId option:selected').val()
            A.each($('.form-control'), function(index, el) {
                if (el.id == 'startTime') data.paymentDateFrom = el.value;
                if (el.id == 'endTime') data.paymentDateTo = el.value;
                if (el.id == 'tenantId') data.tenantId = el.value;
            });
            if (data.tenantId == '') {
                A.alert('选择保险公司')
            } else if (data.paymentDateFrom == '' || data.paymentDateTo == '') {
                A.alert('开始和结束日期不能为空')
            } else {
                window.open(that.ServerPath + 'exportPaymentExcel?paymentDateFrom=' + data.paymentDateFrom + ' 00:00:00&paymentDateTo=' + data.paymentDateTo + ' 23:59:59&tenantId=' + data.tenantId)
            }
            A.widget.loading.hide()
        },
        //下载影像文件
        downloadImagesFile: function(data) {
            var that = this;
            that.order.downloadImagesFile(data).success(function(res) {
                A.alert('下载成功');
            }).notLogin(function(res) {
                A.login.show(function(user) {
                    that.onLogin(user);
                });
            }).fail(function(res) {
                A.alert(res.rtnMsg);
            });
        },
        getCustomReport: function() {
            var that = this;
            that.customReport.getList({ 'tenantId': $('#tenantId').val() }).success(function(res) {
                var option = '<option value="">全部</option>';
                A.each(res.data, function(index, el) {
                    option += '<option value="' + el.id + '">' + el.name + '</option>';
                });
                $('#exportExcelId').html(option)
            }).fail(function(res) {
                A.alert(res.rtnMsg);
                A.widget.loading.hide();
            })
        },
        //获得相应案例的详情
        getPaymentDetailList: function(data, rowValue) {
            var that = this;
            A.ajax({
                url: that.ServerPath + '/getPaymentDetailList',
                emulate: true,
                data: data,
                dataType: 'json',
                success: function(res) {
                    if (res.rtnCode === '2000') {
                        A.each(that.bufferData.paymentList, function(index, ele) {
                            if (ele.mainPaymentNo == res.subPayment[0].subPaymentId) {
                                ele.subPayment = [];
                                A.each(res.subPayment, function(_index, _ele) {
                                    ele.subPayment.push(_ele);
                                })
                            }
                        });
                        that.showData(that.bufferData);
                        that.toggleTr(rowValue);
                    } else {
                        A.alert('没有查出详情！');
                    }
                },
                error: function(xhr, txt, status) {
                    A.alert('查询失败，请重试！');
                }
            });
        },
        /**
         * 平安案件解挂
         **/
        hangDown: function(rowValue, target) {
            var that = this,
                data = { 'paymentNo': rowValue.mainPaymentNo, 'hangup': 0 };
            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: '确认是否解挂',
                buttons: [
                    { text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal' },
                    { text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal' }
                ],
                onClick: function(value, e) {
                    if (value == 0) {
                        that.order.hangUpForPingAn(data).success(function(res) {
                            $(target).remove();
                        }).fail(function(res) {
                            A.alert(res.rtnMsg)
                        })
                    }
                }
            });
        },
        /**
         * 平安解挂所有案件
         **/
        hangDownAllCase: function() {
            var that = this,
                data = { 'hangup': 0 };

            A.each($('.form-control'), function(index, el) {
                if (el.value != '') data[el.id] = el.value
            });

            A.widget.dialog.show({
                title: '提示',
                modalType: '',
                modalDialog: 'modal-sm',
                message: '确认解挂所有案件？',
                buttons: [
                    { text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal' },
                    { text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal' }
                ],
                onClick: function(value, e) {
                    if (value == 0) {
                        that.order.hangDownAllCase(data).success(function(res) {
                            A.alert(res.rtnMsg, function() {
                                that.reload();
                            })
                        }).fail(function(res) {
                            A.alert(res.rtnMsg)
                        })
                    }
                }
            });
        }


    });

    $(function() {
        var page = new CT();
        page.onReady();
    });

})(my);
