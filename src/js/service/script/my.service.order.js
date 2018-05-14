;
(function(A) {
    var CT = function() {},
        S = A.service;
    A.extend(CT.prototype, S, {
        ServerPath: A.getServer(),
        /**
         * [/caseEntryAudit/getNextPayment 获取理赔单]
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{"status":单据状态}]
         */
        getNextPayment_pingan: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/caseEntryAudit/getNextPayment',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getNextPayment 获取理赔单]
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{"status":单据状态}]
         */
        getNextPayment: function(data) {
            var that = this,
                d = A.defer(),
                dataUrl = 'getNextPayment';
            if (data.tenantId == 10007 || data.tenantId == 10008) {
                dataUrl = 'caseEntryAudit/getNextPayment';
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/caseEntryAudit/getPayment 根据id获取理赔单]
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{"id":单据id}]
         */
        getPayment_pingan: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/caseEntryAudit/getPayment',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getPayment 根据id获取理赔单]
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{"id":单据id}]
         */
        getPayment: function(data) {
            var that = this,
                d = A.defer(),
                dataUrl = 'getPayment';
            if (data.tenantId == 10007 || data.tenantId == 10008) {
                dataUrl = 'caseEntryAudit/getPayment';
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getUnKnownHospitalPaymentDetail 人工介入理赔单/获取10001状态的理赔单]
         * @html admin/verify.html
         * @param {object} data [空对象]
         */
        getUnKnownPayment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getUnKnownHospitalPaymentDetail',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/getPreprocessPayment 获取案件的单据]
         * @html admin/verify.html
         * @param {number} data [医院名称编码]
         */
        getPreprocessPayment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/getPreprocessPayment',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**

         * [checkNextPaymentIsExist 判断是否有理赔单]
         * @html admin/entry.html && admin/review.html
         * @html 暂时没用
         * @param  {object} data [{"status":单据状态}]
         */
        checkPayment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'checkNextPaymentIsExist',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [updatePrescription 更新处方单信息]
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{
                id: 当前单据的dataId,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
                ...: 需要录入的字段
            }]
         */
        upPrescription: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updatePrescription',
                type: 'POST',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [updateInvoice 更新收据单信息]
         * @method POST
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{
                id: 当前单据的dataId,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
                ...: 需要录入的字段
            }]
         */
        upReceipt: function(data) {
            var that = this,
                d = A.defer(),
                dataUrl = 'updateInvoice';
            if (data.tenantId == 10007 || data.tenantId == 10008) {
                dataUrl = 'caseEntryAudit/updateInvoice'
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                type: 'POST',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [updateHospitalInvoice 更新住院收据单信息]
         * @method POST
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{
                id: 当前单据的dataId,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
                ...: 需要录入的字段
            }]
         */
        upHospital: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updateHospitalInvoice',
                type: 'POST',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [updateHospitalCosts 更新住院清单信息]
         * @method POST
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{
                id: 当前单据的dataId,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
                ...: 需要录入的字段
            }]
         */
        upHospitalCosts: function(data) {
            var that = this,
                d = A.defer();
            dataUrl = 'updateHospitalCosts';
            if (data.tenantId == 10007 || data.tenantId == 10008) {
                dataUrl = 'caseEntryAudit/updateHospitalCosts';
            }
            A.ajax({
                url: that.ServerPath + dataUrl,
                type: 'POST',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [updateDischargeSummary 更新出院小结信息]
         * @method POST
         * @html admin/entry.html && admin/review.html
         * @param  {object} data [{
                id: 当前单据的dataId,
                department: 科室,
                diagnoise: diagnoise
            }]
         */
        updateDischargeSummary: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updateDischargeSummary',
                type: 'POST',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [updateClaimAppliciation 更新申请书信息]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                id : 单据id,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
            }]
         */
        updateClaim: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updateClaimAppliciation',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "POST",
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [addInvoice 新增单据信息]
         * @method POST
         * @html 目前没有在用
         * @param {object} data [{
                id: 当前单据的dataId,
                personId: 当前的理赔人的id,
                paymentNo: 当前批次id,
                ...: 需要录入的字段
            }]
         * @param {number} type [单据的类型]
         */
        addInvoice: function(data, type) {
            var that = this,
                d = A.defer();
            if (type == 100) {
                data = { invoice: A.toJSON(data) }
            } else if (type == 200) {
                data = { prescription: A.toJSON(data) }
            } else if (type == 300) {
                data = { hospitalInvoice: A.toJSON(data) }
            } else if (type == 400) {
                data = { hospitalCosts: A.toJSON(data) }
            }
            A.ajax({
                url: that.ServerPath + 'addInvoice',
                data: { params: A.toJSON(data) },
                dataType: 'json',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr)
                }
            })
            return d.promise;
        },
        /**
         * [notDealPayment 非平安单据审核不通过/拒单]
         * @method GET
         * @html admin/verify.html
         * @param {object} data [{
                id: 当前单据的id,
                picType: 单据类型,
                message: 拒单原因
            }]
         */
        notDealPayment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'notDealPayment',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/refuseCase 平安单据审核不通过/拒单]
         * @method GET
         * @html admin/verify.html
         * @param {object} data [{
                paymentNo: 赔案号,
                errCode: 拒案错误码,
                errMsg: 拒单原因
            }]
         */
        refuseCase: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/refuseCase',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [invoiceNoExist 收据No号验重]
         * @method GET
         * @html admin/verify.html
         * @param {object} data [{
                id: 当前单据的id,
                invoiceNo: 收据号
            }]
         */
        invoiceNoExist: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'invoiceNoExist',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [testCorrect 单据图片矫正]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                id: 当前单据的id,
                type: 类型,
                hospitalId: 医院id,
                imageName: 图片名字,
                paymentNo: 批次id,
                leftTopPoint: {x: 左上点横坐标,y:左上点纵坐标},
                rightTopPoint: {x: 右上点横坐标,y:右上点纵坐标},
                leftBottomPoint: {x: 左下点横坐标,y:左下点纵坐标},
                rightBottomPoint: {x: 右下点横坐标,y:右下点纵坐标}
            }]
         */
        testCorrect: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'testCorrect',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [autoCorrect 单据自动矫正]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                picPath: 类型,
                hospitalId: 医院id,
                imageName: 图片名字,
            }]
         */
        autoCorrect: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/hospitaltemplates/autoCorrect',
                data: { params: A.toJSON(data) },
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/savePayment 单据基本信息保存]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                id: 当前单据的id,
                type: 类型,
                hospitalId: 医院id,
                imageName: 图片名字,
                invoiceId：发票号
            }]
         */
        savePayment: function(data) {
            var that = this,
                d = A.defer(),
                dataUrl = 'savePayment';
            if (data.tenantId == 10007 || data.tenantId == 10008) {
                dataUrl = '/casePreprocess/savePayment';
            }
            A.ajax({
                // url: that.ServerPath + 'savePayment',
                url: that.ServerPath + dataUrl,
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [correctPaymentInfo 录入审核时改变单据状态]
         * @method POST
         * @html admin/review.html && admin/entry.html
         * @param {object} data [{
                id: 当前单据的id,
                type: 类型,
                hospitalId: 医院id
            }]
         */
        correctPaymentInfo: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/correct/paymentinfo',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [ocrPayment 单据进入OCR处理]
         * @method GET
         * @html admin/verify.html
         * @param {object} data [{
                id: 当前单据id,
                doOCR: 布尔值,true:ocr处理|false:ocr不处理
            }]
         */
        ocrPayment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'ocrPayment',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [deleteInvoiceDetail、deletePrescriptionDetail、deleteCostsDetail 删除单据详细的药品项]
         * @method GET
         * @html admin/entry.html && admin/review.html
         * @param {object} data [{id:当前药品项的id}]
         */
        deleteDetail: function(data) {
            var that = this,
                d = A.defer(),
                delUrl = that.ServerPath + 'deleteInvoiceDetail';
            if (data.type == 100) {
                delUrl = that.ServerPath + 'deletePrescriptionDetail';
            }
            if (data.type == 400 || data.type == 410) {
                delUrl = that.ServerPath + 'deleteCostsDetail';
            }
            A.ajax({
                url: delUrl,
                emulate: true,
                data: { id: data.id },
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [raisePaymentRank 更新单据优先级]
         * @method GET
         * @html admin/order.html
         * @param {object} data [{autoId:当前单据的id}]
         */
        raisePaymentRank: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'raisePaymentRank',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [raisePaymentsRank 批量更新单据优先级]
         * @method GET
         * @html admin/order.html
         * @param {num} paymentNo [当前单据的paymentNo]
         * @param {num} sn [当前单据的sn]
         */
        raisePaymentsRank: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'raisePaymentsRank',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [paymentCheckComplate 单据审核完成]
         * @method GET
         * @html admin/entry.html && admin/review.html
         * @param {object} data [{id:单据id}]
         */
        paymentCheckComplate: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'paymentCheckComplate',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getPaymentImgList 获取单据同批次的图片]
         * @method GET
         * @html admin/entry.html && admin/review.html
         * @param {object} data [{ 
                paymentNo: 批次id,
                dataId : 单据id
            }]
         */
        // getPaymentImgList: function(data) {
        //     var that = this,
        //         d = A.defer();
        //     A.ajax({
        //         url: that.ServerPath + 'getPaymentImgList',
        //         emulate: true,
        //         data: data,
        //         type: "GET",
        //         success: function(res) {
        //             that.callbackProcess(d, res)
        //         },
        //         error: function(xhr, txt, status) {
        //             that.networkError(d, xhr);
        //         }
        //     });
        //     return d.promise;
        // },
        /**
         * [/casePreprocess/getPreprocessImageList 获取案件影像树]
         * @method GET
         * @html admin/verify.html 
         * @param {object} data [{ 
                paymentNo: 批次id,
                tenantId : 医院名称编号
            }]
         */
        getPreprocessImageList: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/getPreprocessImageList',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [get4InputValue 获取mapping数据字段]
         * @method POST
         * @html admin/entry.html && admin/review.html
         * @param {object} data [{
                type: 单据类型,
                hosplitalId: 医院id
            }]
         */
        getTemplate: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'get4InputValue',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [otherOrder 选择其他单据类型]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                autoId : 单据id,
                type: 单据类型
            }]
         */
        otherOrder: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updatePaymentAndTypeByTypeAndId',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [resetPaymentImage 重置矫正后图片]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                id : 单据id
            }]
         */
        resetPaymentImage: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'resetPaymentImage ',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/resetPreprocessImage 重置切割后的图片]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                sourceId : 图片资源id
            }]
         */
        resetPreprocessImage: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/resetPreprocessImage ',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [resetStatusToDestStatus  改变单据状态]
         * @method POST
         * @html admin/verify.html
         * @param {object} data [{
                id : 单据id,
                destStatus:要修改到的状态
            }]
         */
        changeStatusState: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                // url: that.ServerPath + 'changePaymentState',
                url: that.ServerPath + 'resetStatusToDestStatus',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [smallImagePath  查看ocr小图]
         * @method POST
         * @param {object} data [{
                imgPath : 处理过的图片的全路径 
            }]
         */
        smallImagePath: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'smallImagePath',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        //查询退回原因
        returnPaymentRetroversion: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'returnPaymentRetroversion',
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [add/relate  续打发票]
         * @method POST
         * @param {object} data [{
                currentId : 当前发票数据主键ID,
                parentId : 副发票数据主键ID,
            }]
         */
        addRelate: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'add/relate',
                emulate: true,
                data: data,
                type: "POST",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [searchBankList 模糊搜索银行名称]
         * @method GET
         * @html 接口在用，js方法没有用
         * @param {object} obj [{
                val: 名称,
                pageIndex: 分页
            }]
         */
        searchBankList: function(obj) {
            var d = A.defer(),
                that = this;
            A.ajax({
                url: that.ServerPath + "/RestServiceCall/TenantService/searchTenantList",
                type: 'GET',
                data: {
                    params: A.toJSON({
                        "bankName": obj.val,
                        "pageNum": obj.pageIndex,
                        "pageSize": 10
                    })
                },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, type, error) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [searchDrugName 模糊搜索药品名称]
         * @method GET
         * @html 接口在用，js方法没有用
         * @param {object} obj [{
                val: 名称,
                pageIndex: 分页
            }]
         */
        searchDrugList: function(obj) {
            var d = A.defer(),
                that = this;
            A.ajax({
                url: that.ServerPath + "searchDrugName",
                type: 'GET',
                data: {
                    params: A.toJSON({
                        "drugName": obj.val,
                        "pageNum": obj.pageIndex,
                        "pageSize": 10
                    })
                },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, type, error) {
                    that.networkError(d, xhr);
                }
            })
            return d.promise;
        },
        /**
         * [diagnosiscpic/list/getByName  模糊查询疾病code]
         * @method GET
         * @html 接口在用，js方法没有用
         * @param {object} data [{
                'pageSize':10,
                'pageNum':1,
                'name': 疾病名称
            }]
         */
        DiagnoseCode: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'diagnosiscpic/list/getByName',
                emulate: true,
                data: { params: A.toJSON(data) },
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [diagnosiscpic/getByCode 根据code查询疾病名]
         * @method POST
         * @html 接口在用，js方法没有用
         * @param {object} data [{
                code:疾病代码
            }]
         */
        Diagnose: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'diagnosiscpic/getByCode',
                emulate: true,
                data: { code: data.val },
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [upload/downloadImagesFile 下载批次影像文件]
         * @method GET
         * @param {object} data [{
                paymentNo 批次号
                sn 保险公司赔案号
            }]
         */
        downloadImagesFile: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'upload/downloadImagesFile',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/payment/status/update/ 修改单据状态]
         * @method GET
         * @param {object} data:当前单据的主id
         */
        updateStatus: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/payment/status/update/' + data,
                emulate: true,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/user/com/bind/ 修改tenantId]
         * @method GET
         * @param {object} data 当前单据的tenantId
         */
        bindTenant: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/user/com/bind/' + data,
                type: 'GET',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/getInvoiceMapping 判断费用类别]
         * @method GET
         * @param {object} data 费用类别的名字
         */
        getInvoiceMapping: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getInvoiceMapping?costName=' + data,
                type: 'GET',
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/checkIsLastComplatePayment 完成但会数据字符串]
         * @method GET
         * @param {object} paymentNo 批次id
         */
        getXml: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'checkIsLastComplatePayment',
                type: 'GET',
                data: { 'paymentNo': data },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/deductibles 药品分类]
         * @method GET
         * @param {types} 类型
         * @param {region} 地区
         * @param {words} 搜索词
         */
        deductibles: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'deductibles',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/xinAnYiReturnPreviewUpdate  最后审核修改医院code和银行code]
         * @method POST
         * @param {object} data 
         */
        upCode: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'xinAnYiReturnPreviewUpdate ',
                type: 'POST',
                data: { params: A.toJSON(data) },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/isMedication  判断药品的类型]
         * @method GET
         * @param {string} data  药品名称
         */
        isMedication: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'isMedication',
                type: 'GET',
                data: { 'tenantId': 10003, 'itemName': data },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/getPaymentWanjiaHostpital  获取万家医院]
         * @method GET
         * @param {object} data  当前单据的主键
         */
        getPaymentWanjiaHostpital: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getPaymentWanjiaHostpital',
                type: 'GET',
                data: { 'autoId': data },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/getWanjiaHostpital  搜索万家医院code]
         * @method GET
         * @param {object} data  医院名字
         */
        getWanjiaHostpital: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getWanjiaHostpital',
                type: 'GET',
                data: { 'hospitalName': data },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/updateWanjiaHostpital  更新万家医院code]
         * @method GET
         * @param {autoId} 当前单据的主键  
         * @param {hospitalName} 医院名字
         * @param {hospitalCode} 医院code
         */
        updateWanjiaHostpital: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'updateWanjiaHostpital',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/cutImage  切割影像]
         * @method GET
         * @param {imagePath} 图片路径  
         * @param {list} 切割框尺寸坐标
         */
        getCutImage: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/cutImage',
                type: 'POST',
                data: { params: A.toJSON(data) },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/saveCutImage  保存切割后的影像]
         * @method GET
         * @param {imagePath} 图片路径      
         * @param {paymentNo} 切割前图片的编码
         * @param {id} 切割前图片id
         */
        saveCutImage: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/saveCutImage',
                type: 'GET',
                data: { params: A.toJSON(data) },
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * 拒单
         */
        savePaymentRetroversion: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/savePaymentRetroversion',
                type: 'POST',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/dict/disease/getDiseaseByName  疾病诊断查询]
         * @method GET
         * @param {tenantId} 保险公司      
         * @param {name} 项目名
         */
        getDiseaseByName: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/dict/disease/getDiseaseByName',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/dict/department/getByTenantId  科室查询]
         * @method GET
         * @param {tenantId} 保险公司      
         */
        getDepartment: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/dict/department/getByTenantId',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/dict/feetype/getByName  费用类别查询]
         * @method GET
         * @param {tenantId} 保险公司      
         * @param {name} 项目名
         */
        getFeetype: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/dict/feetype/getByName',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/dict/itemfee/getByName  费用类别关系维护]
         * @method GET
         * @param {tenantId} 保险公司      
         * @param {name} 项目名
         */
        getItemfee: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/dict/itemfee/getByName',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/getTernary  医保目录查询]
         * @method GET
         * @param {tenantId} 保险公司      
         * @param {name} 药品名称
         * @param {region} 地区编码
         */
        getTernary: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/getTernary',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/dataservice/getHospital 币种查询]
         * @method GET
         */
        getHospital: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/dataservice/getHospital',
                type: 'GET',
                data: data,
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/checkWithdraw 案件撤回检查]
         * @method GET
         * @html admin/verify.html
         * @param  {object} data [{"paymentNo":理赔单号}]
         */
        checkWithdraw: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/checkWithdraw',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/caseEntryAudit/majorItemForHisCaseChoosed 案件撤回检查]
         * @method GET
         * @html admin/verify.html
         * @param  {object} data [{"invoiceId":单据id}]
         */
        chooseType: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/caseEntryAudit/majorItemForHisCaseChoosed',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/casePreprocess/getHospitalByInvoiceForPinganHis 平安历史查询医院接口]
         * @method GET
         * @html admin/verify.html
         * @param  {object} data [{
         *              paymentNo:理赔单号,
         *              invoiceNo:发票号
         *              }]
         */
        getHospitalByInvoice: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                // url: that.ServerPath + '/casePreprocess/getHospitalByInvoiceForPinganHis',
                // url: that.ServerPath + '/casePreprocess/searchPingAnHospital',
                url: that.ServerPath + '/casePreprocess/searchHospital',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/detailItem/isBigItem fesco明细大小项自动带出接口]
         * @method GET
         * @html admin/review.html
         * @param  {object} data [{
         *              name:名称,
         *              tenantId:保险公司
         *              }]
         */
        isBigItem: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/detailItem/isBigItem',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**       
         * [/casePreprocess/hangUpForPingAn 平安案件挂起/解挂]
         * @method GET
         * @html admin/verify.html
         * @param  {object} data [{
         *              paymentNo:理赔单号,
         *              hangup:挂起状态码
         *              }]
         */
        hangUpForPingAn: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/casePreprocess/hangUpForPingAn',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**       
         * [ /hangingSolution 平安解挂所有案件]
         * @method GET
         * @html order.html
         * @param  {object} data [{
         *              tenantId：公司编码，
         *              name：客户姓名，
         *              paymentNo:理赔批次号，
         *              status：单据状态，
         *              startTime：开始时间，
         *              endTime：结束时间，
         *              hangup:挂起状态码
         *              }]
         */
        hangDownAllCase: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/hangingSolution',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/detailItem/isBigItem fesco明细大小项自动带出接口]
         * @method GET
         * @html admin/review.html
         * @param  {object} data [{
         *              name:名称,
         *              tenantId:保险公司
         *              }]
         */
        isBigItem: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/detailItem/isBigItem',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/detailitem/getDetailItemInfo fesco明细大小项自动带出接口]
         * @method GET
         * @html admin/review.html
         * @param  {object} data [{
         *              name:名称,
         *              tenantId:保险公司
         *              }]
         */
        getItemInfo: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/detailitem/getDetailItemInfo',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        },
        /**
         * [/afreshReturnData 重新回传接口]
         * @method GET
         * @html admin/review.html
         * @param  {object} data [{
         *              name:名称,
         *              tenantId:保险公司
         *              }]
         */
        passBackCase: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + '/afreshReturnData',
                emulate: true,
                data: data,
                type: "GET",
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d, xhr);
                }
            });
            return d.promise;
        }

    });
    A.service.order = new CT();
})(my);
