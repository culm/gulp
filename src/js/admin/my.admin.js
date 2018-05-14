;
(function(A) {
    A.admin = {
        ServerPath: '@@ServerPath@@',
        initHeader: function(notLoginFunc) {
            var that = this;
            that.tenantName = that.getTenantName(localStorage.getItem('tenantId'));
            that.userName = localStorage.getItem('userName');
            if (A.ua.ieAX < 9 && A.ua.ieVer < 9 || A.ua.ieMode < 9) {
                location.href = "supported_browsers.html"
            };

            $(window).resize(function() {
                that.resizeHeight();
            });
            that.resizeHeight();

            $('#header-loginitem').off('click').on('click', function() {
                A.login.show(function(user) {
                    that.onLogin(user);
                });
            });
            $('#header-logout').off('click').on('click', function() {
                var item = $('#header-loginitem');
                A.login.logout();
                item.html('登录/注册');
                item.removeClass('logined');
                item.removeAttr('data-toggle');
                item.parent().removeClass('open');
            });
            $('#header-resetpassword').off('click').on('click', function() {
                A.login.resetPassword();
            });

            A.login.ServerPath = that.ServerPath;
            A.login.getLoginStatus(function(user) {
                localStorage.setItem('userName', user.name)
                that.onLogin(user);
                $('#header-loginitem img').before(that.tenantName + '&nbsp;&nbsp;&nbsp;&nbsp;');
                // 修改titl，方便运营人员查看
                $('title').html(that.tenantName + '-' + that.userName + '-' + that.getStatusTxt(that.status));
            }, notLoginFunc);

            that.login.getPurview().success(function(res) {
                A.each(res.menuList, function(index, el) {
                    var len = $('.left-menu li').length;
                    for (var i = 0; i < len; i++) {
                        var txt = $('.left-menu li').eq(i).attr('txtName');
                        if (txt == el.name) {
                            $('.left-menu li').eq(i).addClass('show');
                        }
                    }
                });
                A.each($('.left-menu li'), function(index, el) {
                    // 异常处理页面开发给所有用户及没登入的情况
                    // if (!$(el).hasClass('show')) {
                    if (!$(el).hasClass('show') && $(el).attr('txtName')!= '异常处理') {
                        $(el).remove()
                    }
                });
                if (res.menuList.length == 1) {
                    var url = $('.left-menu a').eq(0).attr('href');
                    if (location.href.match(url)) return;
                    location.href = url;
                }
            });
        },
        /**
         * 调整左侧导航栏的高度
         */
        resizeHeight: function() {
            var height = window.innerHeight,
                menu = $('.left-menu'),
                rightMenu = $('.right-body'),
                mHeight = menu.height(),
                rightHeight = rightMenu.height() + rightMenu.offset().top + 20;
            // if(height > rightHeight) $('.right-body').height(height-50);
            if (height <= rightHeight) height = rightHeight;
            $('.left-menu').height(height - 50);
        },
        /**
         * 改变保险公司
         */
        refreshTenant: function() {
            var that = this;
            $('#refreshTenant').modal('show');
            $('#refreshTenant').on('click', '.list-group-item', function(event) {
                $(this).addClass('active').siblings('li').removeClass('active');
                $('#refreshTenantId').val($(this).attr('id'));
            });
            $('#refreshTenantBtn').on('click', function(event) {
                var tenantId = $('#refreshTenantId').val();
                if (tenantId == '') {
                    A.alert('请选择保险公司');
                    return;
                }
                that.order.bindTenant(tenantId).success(function(res) {
                    localStorage.setItem('tenantId', tenantId);
                    localStorage.setItem('isAutoTask', 'true');
                    that.reload();
                }).fail(function(res) {
                    A.alert(res.rtnMsg);
                })
            });
            $('#refreshTenant').on('hidden.bs.modal', function() {
                that.reload();
            });
        },
        /**
         * 模糊匹配处理
         **/
        fuzzySearch: function(op) {
            var that = this;
            $('input[name="' + op.id + '"]').attr('id', op.id)
            new A.widget.AutoComplete('#' + op.id, {
                getTitleHtml: function(type) {
                    return '<span class="title">输入医院名字或↑↓选择</span>';
                },
                // SearchSource:0,//0:从网站搜索,1:从百度地图去数据
                GetUrl: function() {
                    if (typeof op.searchUrl == 'function') {
                        return that.ServerPath + op.searchUrl();
                    } else return that.ServerPath + op.searchUrl;
                },
                customerJsonData: function(res) {
                    return { Data: res[op.returnList] || [], total: Math.ceil(res.total / 10) };
                },
                OnRender: function(item, type) {
                    var name = item[op.returnName];
                    if (op.returnList == 'drugNameList') {
                        return '<a class="text-overflow" title="' + item + '" targetid="' + item + '">' + item + '</a>';
                    } else {
                        return '<a class="text-overflow" title="' + name + '" targetid="' + item[op.returnId] + '">' + name + '</a>';
                    }

                },
                getRequestData: function() {
                    this.paramsData = {
                        "pageNum": parseInt(this.Options.pageIndex, 10) + 1,
                        "pageSize": 10,
                        "tenantId": op.tenantId || 10007
                    };
                    this.paramsData[op.paramsName] = this.target.val();
                    if (op.id == 'hospitalPingan') {
                        return this.paramsData;
                    }else {
                        return { params: A.toJSON(this.paramsData) };
                    }
                },
                OnSelect: function(item) {
                    if (item != null) {
                        if (op.returnName == 'customerProductName') {
                            this.paramsData.region = that.regionCode;
                            op.callback.call(that, this, op, item);
                            return
                        }
                        if (op.returnName) {
                            this.GetTarget().val(item[op.returnName]);
                            if (op.siblings) $('input[name="' + op.siblings + '"]').val(item[op.returnId]);
                        } else {
                            this.GetTarget().val(item);
                        }
                        if (op.id == 'hospitalName') {
                            that.hospitalId = item[op.returnId];
                            op.callback.call(that, this, op, item);
                        }
                        //平安多组疾病名称及编码拼接到回传疾病输入框中
                        if (op.id == 'inHospitalDiagnoseCh' && that.isPingan) {
                            op.callback.call(that, this, op, item)
                        }
                        //平安库医院模糊查询缓存医院代码
                        if (op.id == 'hospitalPingan' && that.isPingan) {
                            op.callback.call(that, this, op, item)
                        }
                    }
                },
                OnBeforeHide: function(selected, defaultItem) {
                    if (!selected && op.returnName != 'bankName' && (op.id != 'inHospitalDiagnoseCh' && that.isPingan) && op.returnName != 'customerProductName'&& op.id != 'hospitalPingan') {
                        this.Options.OnSelect.call(this, defaultItem);
                    }
                    /*if (!selected && op.id == 'leaveHospitalDiagnose' && that.isPingan) {
                        op.callback.call(that);
                    }*/
                }
            });
        },
        getHospitalCode: function(name) {
            var that = this;
            that.order.getHospital({ "tenantId": 10007, "name": name }).success(function(res) {
                if (res.data[0] == null) {
                    A.alert('没有该医院数据,请重新输入');
                    return
                }
                that.hospitalCode = res.data[0].customerHospitalCode;
                that.hospitalName = res.data[0].customerHospitalName;
                that.regionCode = res.data[0].regionCode;
            }).fail(function(res) {

            })
        },
        /**
         * 刷新页面
         */
        reload: function(time) {
            var that = this,
                time = time ? time : 0;
            setTimeout(function() {
                window.onbeforeunload = null;
                location.reload(true)
            }, time);
        },
        /**
         * 获取理赔单类型名称
         */
        getTypeName: function(type) {
            var messages = {
                '100': '门诊处方',
                '200': '门诊收据',
                '300': '住院收据',
                '400': '住院清单',
                '410': '门诊清单',
                '500': '门诊病历',
                '600': '出院小结',
                '700': '增值税发票',
                '800': '北京门特',
                '900': '门诊结算单',
                '910': '住院结算单',
                '1000': '身份证',
                '3000': '理赔申请书',
                '9000': '其他',
                '4000': '银行转账信息'
            };
            var message = messages[type];
            if (message) return message;
            return '未知单据:' + type;
        },
        /**
         * 获取理赔单状态名称
         */
        getStatusTxt: function(status) {
            //待完善
            //可以参照公共配置-》文档——》开发文档-》理赔单状态文档
            var messages = {
                '-10000': '无效案件',
                '10100': '上传中',
                '10200': '待确认',
                '10300': '确认中',
                '15100': '待校正',
                '15200': '矫正中',
                '20100': '待处理 ',
                '20200': '处理中',
                '20800': '处理完成',
                '25100': '待OCR',
                '25200': 'OCR中',
                '30100': '待录入',
                '30200': '录入中',
                '35100': '待审核',
                '35200': '审核中',
                '80100': '待发送',
                '80200': '发送中',
                '88000': '发送完成',
                '89000': '发送失败',
                '90100': '未知',
                '90200': '综合险处理',
                '90300': '理赔处理中',
                '90400': '已结案',
                '90500': '拒赔',
                '90600': '作废'
            };
            var message = messages[status];
            if (message) return message;
            return '';
        },
        /**
         * 获取保险公司名称
         */
        getTenantName: function(status) {
            var messages = {
                '10001': '太保',
                '10002': '金饭碗',
                '10003': '新安怡',
                '10004': '太保移动',
                '10005': 'fesco',
                '10009': 'fesco外包',
                '10006': '万家',
                '10007': '平安生产',
                '10008': '平安历史',
                '99999': '理赔宝'
            };
            var message = messages[status];
            if (message) return message;
            return '和金在线';
        },
        /**
         * 拼接图片显示链接
         */
        getImgPath: function(img, paymentNo) {
            var that = this;
            return that.ServerPath + 'upload/download?fileName=' + img + '&paymentNo=' + paymentNo
        },
        /**
         * 判断是否是平安公司
         */
        isTenant: function(tenantId) {
            var that = this;
            that.isTaibao = tenantId == 10001 ? tenantId : false;
            that.isJinfanwan = tenantId == 10002 ? tenantId : false;
            that.isXinanyi = tenantId == 10003 ? tenantId : false;
            that.isTaibaoMobel = tenantId == 10004 ? tenantId : false;
            that.isFesco = (tenantId == 10005 || tenantId == 10009) ? tenantId : false;            
            that.isWanjia = tenantId == 10006 ? tenantId : false;
            that.isPingan = (tenantId == 10007 || tenantId == 10008) ? tenantId : false;
        }

    };
})(my);
