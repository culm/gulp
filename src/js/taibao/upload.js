;
(function(A) {
    var CT = function() {};
    A.extend(CT.prototype, {
        onReady: function() {
            // param:json的base64编码，json的格式：
            // {
            //  username:用户名，
            //  enterpriseId：企业号，10001税优用，10002金饭碗用，
            //  SN：报案号，
            //  IDCardNum：证件号码，
            //  CredentialsType：证件类型，
            //  name：用户姓名，
            //  address：地址，
            //  phone：手机号码，
            //  ReimbursementType：报销类型，
            //  invoiceNum：发票数量，
            //  invoiceNumSum：发票总额，
            //  AccountBank：开户银行，
            //  AccountBankNum：银行卡号，
            //  InsurancePolicyId：保单号，
            //   time:时间戳,
            //   is_supplement (补充资料标志)   0,表示不是补充  1,表示补充
            // }
            // token:username+IDCardNum+time->md5
            var that = this;
            that.upfileList = A.service.upfileList;
            that.srcIndex = 0;
            that.srcImgIndex = 0;
            that.reUpload();
            that.isAndroid = navigator.userAgent.match(/Android/i);
            setTimeout(function() {
                if (!that.isAndroid && !window.showPhotoPeview ||
                    that.isAndroid && !window.goldbowl.preview) { //老版本提示升级
                    //location.href = '/shuiyou20160510/upload.html' + location.search;
                    A.alert('请升级最新版本！');
                }
            }, 500);
            //存放小图的base64
            that.pho = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            //记录拍摄图片的绝对路径,与pho一一对应
            that.abspaths = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            //监控图片是否改变
            that.phoFlags = {};
            // that.pho = [
            //   ['a1.jpg'],['a1.jpg'],['a1.jpg'],['a1.jpg'],['a1.jpg'],[],[]
            // ];

            that.totalImgs = 0; //记录图片的总张数
            that.again = false;
            that.paymentId = '';
            that.failNum = 0;
            // 从地址获取金饭碗
            var params = A.getParams();
            that.params = params.param;
            that.token = params.token;
            //that.url = params.url;
            that.url = decodeURI(params.url || '');
            that.backurl = decodeURI(params.backurl || '');
            //that.backurl = decodeURI(that.backurl);
            that.initEvent();
        },
        reUpload: function() {
            var that = this;
            that.paymentId = '';
            that.startUploadIndex = 0; //已经提交了的图片数量
            that.firstIndex = 0; //单据大类的序号，
            that.secondIndex = 0;
        },
        initEvent: function() {
            var that = this;
            //照片预览
            $('#preview_photo').click(function() {
                $('.section-two').show();
                $('.section-one').hide();
                // 如果有改变，调用updateSum
                if(that.phoFlags[that.srcIndex]) that.updateSum();
            });
            $('.toSes1').click(function() { //预览返回
                $('.section-one').show();
                $('.section-two').hide();
                $('.large-image').hide();
            });
            //提取单据数量     token:username+IDCardNum+time->md5
            //that.params='eyJ1c2VybmFtZSI6Imludm9pY2VOdW1kZGRkZCIsImVudGVycHJpc2VJZCI6IjEwMDAyIiwiU04iOiIwMDAwMDEiLCJJRENhcmROdW0iOiIzMTAxMDcxOTgzMDIwOTIxMjMiLCJDcmVkZW50aWFsc1R5cGUiOiJDIiwibmFtZSI6IiIsImFkZHJlc3MiOiIlRTQlQjglOEElRTYlQjUlQjclRTUlQjglODIlRTUlODglOUIlRTYlOTYlQjAlRTglQTUlQkYlRTglQjclQUYzMDAlRTUlQkMlODQzMSVFNSU4RiVCNzMwMSVFNSVBRSVBNCIsInBob25lIjoiMTU2NDQ1NjU2NTYiLCJSZWltYnVyc2VtZW50VHlwZSI6IiVFNSU4NSVBQyVFNyU5NCVBOCIsImludm9pY2VOdW0iOiIzIiwiaW52b2ljZU51bVN1bSI6IjEwMDAiLCJBY2NvdW50QmFuayI6IiVFNCVCQSVBNCVFOSU4MCU5QSVFOSU5MyVCNiVFOCVBMSU4QyIsIkFjY291bnRCYW5rTnVtIjoiNjIyNTg5NjcwOTgwOTAzNCIsIkluc3VyYW5jZVBvbGljeUlkIjoiR1lBMDYxRUw1MDAwNzY5IiwidGltZSI6IjE0NTczMzkwODQzNjYifQ==';
            var Tparams = that.base64Code(that.params);
            if (!Tparams) {
                A.alert('参数输入有误，请稍后重试');
            }
            that.is_supplement = Tparams.is_supplement; //判断重传
            that.ReimbursementType = Tparams.ReimbursementType.decode(); //单据类型 门诊、住院、门诊+住院
            that.enterpriseId = Tparams.enterpriseId;
            that.sn = Tparams.SN;
            //补充资料，单据数量不为0，隐藏发票栏目.
            if (that.is_supplement == 1) //重传
            {
                $('#Camera_invoice').hide(); //隐藏发票
            } else {
                if (that.ReimbursementType == '门诊') //门诊病历和发票必传
                {
                    $('.icon_bingli').addClass('cur');
                    $('.icon_fapiao').addClass('cur');
                }
                if (that.ReimbursementType == '门诊+住院' || that.ReimbursementType == '住院') //门诊病历、出院小结、发票必传
                {
                    $('.icon_bingli').addClass('cur');
                    $('.icon_xiaojie').addClass('cur');
                    $('.icon_fapiao').addClass('cur');
                }
            }
            that.invoiceNum = Tparams.invoiceNum; //发票数量
            that.usernameJs = Tparams.username; //用户名
            that.IDCardNumJs = Tparams.IDCardNum; //IDCardNum
            that.timeJs = Tparams.time; //time
            that.tokenJs = hex_md5(that.usernameJs + that.IDCardNumJs + that.timeJs);
            $('#submit_sub').click(function() {
                that.submitImages();
            });
            //upload页面跳转
            $('.JSgo_back').click(function() {
                if (that.backurl) {
                    window.location.href = that.backurl;
                } else {
                    A.alert('您要跳转的页面不存在');
                }
            });
            //调用拍照
            $('.icon_camera').click(function() {
                if (that.totalImgs >= 20) {
                    A.alert('一次最多只能上传20张图片！');
                    return;
                }
                that.again = false;
                that.srcIndex = parseInt($(this).attr('data-index'));
                that.takePhotaNative();
            });
            //点击显示后面的图片
            $('.thumbList').delegate(".pointClick", "click", function() {
                that.srcIndex = parseInt($(this).parents('.thumbList').attr('_index'), 10);
                that.srcImgIndex = 3;
                that.showPhotoPeviews();
            });
            //点击放大图片
            $('.thumbList').delegate("img", "click", function() {
                that.srcIndex = parseInt($(this).parents('.thumbList').attr('_index'), 10);
                that.srcImgIndex = parseInt($(this).parents('.item').index(), 10);
                that.showPhotoPeviews();
            });

        },
        base64Code: function(str) {
            var b = new Base64();
            var strdecode = b.decode(str);
            return A.parseJSON(strdecode);
        },
        /**
         *保存图片的绝对路径
         */
        addPaths: function(paths) {
            var that = this,
                srcIndex = that.srcIndex,
                absPaths = that.abspaths[srcIndex];
            if (that.again) {
                that.totalImgs += paths.length - absPaths.length;
                that.abspaths[srcIndex] = paths;
            } else {
                that.totalImgs += paths.length;
                A.each(paths, function(index, path) {
                    absPaths.push(path);
                });
            }
            //更新页面显示的数量
            var len = that.abspaths[srcIndex].length;
            var tip = document.getElementById('message_tip' + srcIndex);
            var num = document.getElementById('num_photo_' + srcIndex);
            num.innerHTML = len;
            tip.innerHTML = len;
            tip.style.display = 'block';
            if (len == 0) tip.style.display = 'none';
        },
        /**
         * [addImg 拍照以后预览小图]
         * @param {array} _index    [类型数组]
         * @param {boole} again     [是否重拍]
         * @param {string} imageData [图片base64字符串]
         */
        addImg: function(imageData) {
            var that = this,
                srcIndex = that.srcIndex,
                photos = that.pho[srcIndex];
            if (that.again) {
                photos = that.pho[srcIndex] = [];
            }
            A.each(imageData, function(index, base64) {
                if(index < 4) {
                    photos.push("data:image/jpg;base64," + base64);
                }
            });
            that.phoFlags[srcIndex] = true;
        },
        updateSum: function() {
            var that = this,
                flags = that.phoFlags;
            for (var srcIndex in flags) {
                var val = flags[srcIndex];
                if (val) { //图片有改变
                    that._updateSum(srcIndex);
                    flags[srcIndex] = false;
                }
            }
        },
        /**
         *pageIndex: 更新第几个栏目的img
         */
        _updateSum: function(srcIndex) {
            var that = this,
                //srcIndex = that.srcIndex,
                html = [],
                len = that.abspaths[srcIndex].length;
            A.each(that.pho[srcIndex], function(j, osrc) {
                if (j == 3 && len > 4) {
                    html.push('<div class="item pointClick">\
                            <div class="content"><i class="iconfont">&hellip;</i></div>\
                        </div>');
                } else {
                    html.push('<div class="item">\
                            <div class="content"><img src="' + osrc + '"></div>\
                        </div>');
                }
            });
            document.getElementById('thumbList_' + srcIndex).innerHTML = html.join(''); 
        },
        takePhotaNative: function() {
            //最多上传20张图片，每次拍照更新 limit_count:20
            var that = this,
                max = 20 - that.totalImgs;
            if (that.isAndroid) {
                //window.goldbowl.takeCamera('onTakePhotoBack', JSON.stringify({save_blur: 0, picture_width: 1000}));
                window.goldbowl.takeCamera('onTakePhotoBack', JSON.stringify({
                    limit_count: max,
                    picture_width: 1000
                }));
            } else {
                //ios拍照如果传宽度，会造成内存额外增加，目前暂时不传宽度
                //goTakePhoto('onTakePhotoBack', JSON.stringify({save_blur: 0}));
                goTakePhoto('onTakePhotoBack', JSON.stringify({
                    limit_count: max
                }));
            }
        },
        //native预览图片
        showPhotoPeviews: function() {
            var that = this,
                paths = that.abspaths[that.srcIndex],
                index = that.srcImgIndex;
            that.again = true;
            if (that.isAndroid) {
                window.goldbowl.preview('onTakePhotoBack', JSON.stringify({
                    imagePaths: paths,
                    index: index
                }));
            } else {
                window.showPhotoPeview('onTakePhotoBack', JSON.stringify({
                    imagePaths: paths,
                    index: index
                }));
            }
        },
        checkSubmit: function() {
            var that = this;
            that.upfileList.hasUpload({
                caseNo: that.sn,
                tenantId: that.enterpriseId
            }).success(function(res) {
                if (res) { //sn已经提交,直接跳到成功页面
                    window.location.href = that.url || 'success.html';
                } else {
                    that.uploadImage();
                }
            });
        },
        submitImages: function() {
            var that = this;
            if (that.totalImgs > 20) {
                A.alert('一次最多只能上传20张图片！');
                return;
            }
            if (that.totalImgs != 0) {
                //判断token值  
                if (that.tokenJs != that.token) {
                    A.alert('token值不对，请退出重试');
                    return;
                };
                var abspaths = that.abspaths;

                //如果是首次上传，判断每一种单据都不能为空
                if (that.is_supplement != 1) {
                    var showTo = ['请上传门诊病历', '请上传出院小结', '请上传处方', '请上传发票', '请上传明细清单', '请上传身份证', '请上传银行卡'];
                    if (that.ReimbursementType == '门诊') //门诊病历和发票必传
                    {
                        if (abspaths[0].length == 0) {
                            A.alert(showTo[0]);
                            return;
                        }
                        if (abspaths[3].length == 0) {
                            A.alert(showTo[3]);
                            return;
                        }
                    }
                    if (that.ReimbursementType == '住院' || that.ReimbursementType == '门诊+住院') //门诊病历、出院小结、发票必传
                    {
                        if (abspaths[0].length == 0) {
                            A.alert(showTo[0]);
                            return;
                        }
                        if (abspaths[1].length == 0) {
                            A.alert(showTo[1]);
                            return;
                        }
                        if (abspaths[3].length == 0) {
                            A.alert(showTo[3]);
                            return;
                        }
                    }
                };
                //that.startUploadIndex = 0;//已经提交了的图片数量
                // that.firstIndex = 0;//单据大类的序号，
                // that.secondIndex = 0;//每个单据大类中，单据的序号
                //判断单据数量 
                dataLen = that.abspaths[3];
                if (that.invoiceNum != dataLen.length) {
                    A.widget.dialog.show({
                        title: '提示',
                        modalType: '',
                        modalDialog: 'modal-sm',
                        message: '您所拍单据数量不正确,是否继续提交？',
                        buttons: [{
                            text: '取消',
                            class: 'btn btn-default',
                            value: 1,
                            dismiss: 'modal'
                        }, {
                            text: '确定',
                            class: 'btn btn-danger',
                            value: 0,
                            dismiss: 'modal'
                        }],
                        onClick: function(value, e) {
                            if (value == 0) {
                                that._submitImages();
                            }
                        }
                    });
                } else {
                    that._submitImages();
                }

            } else {
                A.alert('图片列表为空，请上传图片!');
            }
        },
        _submitImages: function() {
            var that = this;
            try {
                var state = that.getNetWorkState();
                if (!state) {
                    A.alert('您当前网络未连接，请联网后再上传！');
                    return;
                }
                if (state == '2G') {
                    A.widget.dialog.show({
                        title: '提示',
                        modalType: '',
                        modalDialog: 'modal-sm',
                        message: '2G网络上传较慢，需耐心等待，是否继续上传？',
                        buttons: [{
                            text: '取消',
                            class: 'btn btn-default',
                            value: 1,
                            dismiss: 'modal'
                        }, {
                            text: '确定',
                            class: 'btn btn-danger',
                            value: 0,
                            dismiss: 'modal'
                        }],
                        onClick: function(value, e) {
                            if (value == 0) {
                                that.showProgress();
                                that.checkSubmit();
                            }
                        }
                    });
                } else {
                    that.showProgress();
                    that.checkSubmit();
                }
            } catch (e) {
                A.alert(e)
            }
        },
        showProgress: function() {
            var that = this,
                startUploadIndex = that.startUploadIndex,
                totalImgs = that.totalImgs,
                percentage = parseInt(startUploadIndex * 100 / totalImgs, 10);
            var percentage1 = parseInt((startUploadIndex - 1) * 100 / totalImgs, 10);
            var baseN = Math.ceil(100 / totalImgs);
            if (that.timeInter) {
                clearInterval(that.timeInter);
            }
            if (startUploadIndex == 0) {
                var i = 1;
                that.timeInter = setInterval(function() {
                    if (i > 10) {
                        clearInterval(that.timeInter);
                    } else {
                        var percentage2 = parseInt(parseInt(baseN / 30 * i) + parseInt(percentage));
                        var html = '\
                            <div class="progress">\
                                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentage2 + '%;color:#bbb;">' + percentage2 + '%</div>\
                            </div>';
                        A.widget.loading.show({
                            message: html,
                            iconCls: 'myloading',
                            'container': 'myloading-container iloading-container'
                        });
                    }
                    i++;
                }, 10);
            } else {
                if (totalImgs < 10) {
                    var i = 1;
                    that.timeInter = setInterval(function() {
                        if (i > 10) {
                            clearInterval(that.timeInter);
                        } else {
                            var percentage2 = parseInt(parseInt(baseN / 10 * i) + parseInt(percentage1));
                            var html = '\
                      <div class="progress">\
                          <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentage2 + '%;color:#bbb;">' + percentage2 + '%</div>\
                      </div>';
                            A.widget.loading.show({
                                message: html,
                                iconCls: 'myloading',
                                'container': 'myloading-container iloading-container'
                            });
                        }
                        i++;
                    }, 10);
                } else {
                    //alert(percentage + ':' + startUploadIndex + ':' + totalImgs);
                    var html = '\
                  <div class="progress">\
                    <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentage + '%;color:#bbb;">' + percentage + '%</div>\
                  </div>';
                    A.widget.loading.show({
                        message: html,
                        iconCls: 'myloading',
                        'container': 'myloading-container iloading-container'
                    });
                }
            }
        },
        uploadImage: function() {
            var that = this,
                firstIndex = that.firstIndex,
                secondIndex = that.secondIndex,
                data = that.abspaths,
                images = data[firstIndex];
            if (firstIndex > 7) { //收据大类只有7个，多余7个，程序其他地方可能出错
                return;
            }
            if (!images || !images[secondIndex]) {
                that.firstIndex = firstIndex + 1;
                that.secondIndex = 0;
                that.uploadImage();
                return;
            }
            //iOS Android统一方法修改
            if (that.isAndroid) {
                window.goldbowl.getPhotoBase64('onBigPhotoBase64Back', A.toJSON([images[secondIndex]]), A.toJSON({}));
            } else {
                getPhotoBase64('onBigPhotoBase64Back', A.toJSON({
                    imagePaths: [images[secondIndex]]
                }));

            }
        },
        _uploadImage: function(base64File) {
            var that = this,
                types = [500, 600, 100, 200, 400, 1000, 2000],
                commitData = {
                    param: that.params,
                    token: that.token,
                    imageMap: {
                        imageName: base64File,
                        type: types[that.firstIndex]
                    },
                    paymentId: that.paymentId,
                    currentNum: that.startUploadIndex + 1, //当前第几张
                    imageTotal: that.totalImgs //总张数
                };
                
            that.upfileList.upload(commitData).success(function(res) {
                that.failNum = 0;
                if (res.paymentId) {
                    that.paymentId = res.paymentId;
                }
                that.secondIndex++;
                //变更上传数量
                that.startUploadIndex++;
                that.showProgress();
                if (that.startUploadIndex < that.totalImgs) { //继续上传
                    setTimeout(function() {
                        that.uploadImage();
                    }, 1);
                } else { //全部上传完成,放在settimeout中，为了显示100%的完成进度
                    //成功之后删除文件夹下所有图片
                    if (that.isAndroid) {
                        window.goldbowl.deleteAll('');
                    } else {
                        deleteAll();
                    }
                    setTimeout(function() {
                        window.location.href = that.url || 'success.html';
                    }, 500);
                }
            }).fail(function(res) {
                if (res.rtnCode == '2007') {
                    if (that.failNum <= 3) {
                        //重新上传本张图片
                        that._uploadImage(base64File);
                        that.failNum++;
                    } else {
                        that.uploadError();
                        that.failNum = 0;
                    }
                } else {
                    that.uploadError();
                }
            });
        },
        uploadError: function() {
            var that = this,
                state = that.getNetWorkState(),
                msg = '';
            A.widget.loading.hide();
            if (that.startUploadIndex > 0) {
                msg = '您已经上传' + that.startUploadIndex + '张单据，';
            }
            if (!state) { //没有连接到网络
                A.alert(msg + '请连接到网络后，再次上传！');
                return;
            }
            if (state == '2G') {
                A.alert(msg + '由于2G网络较慢，请连接到无线网络或再次上传！');
                return;
            }
            A.alert(msg + '由于网络传输发生错误，请重新上传');
        },
        getNetWorkState: function() {
            if (this.isAndroid) {
                return window.goldbowl.getConnType();
            } else {
                return getNetWorkState();
            }
        }
    });

    $(function() {
        var page = new CT();
        page.onReady();
        window.page = page;
    });

})(my);

/**
 * [onTakePhotoBack ios获取图片base64后的callback]
 * @param  {string} data [图片base64值]
 */
function onTakePhotoBack(paths) {
    try {
        var _paths = [];
        if (!page.again && paths.length == 0) {
            my.alert('相机启动失败，请在系统权限管理中为本软件打开相机权限');
            return;
        }
        if (paths.length > 4) {
            _paths = paths.slice(0, 4);
        } else {
            _paths = paths;
        }
        if (page.isAndroid) {
            window.goldbowl.getPhotoBase64('onPhotoBase64Back', my.toJSON(_paths), my.toJSON({
                picture_width: 100
            }));
        } else {
            getPhotoBase64('onPhotoBase64Back', my.toJSON({
                imagePaths: _paths,
                picture_width: 40
            }));
        }

        page.reUpload();
        page.addPaths(paths);
    } catch (e) {
        my.alert('catch error:' + e.message);
    }
}
/**
 * [onAndroidPhotoBase64Back android获取图片base64后的callback]
 * @param  {string} files [图片base64值]
 */
function onPhotoBase64Back(files) {
    try {
        page.addImg(files);
        if (page.again) {
            setTimeout(function() {
                page.updateSum();
            }, 100);

        }
    } catch (e) {
        my.alert('catch1 error:' + e.message);
    }
}

function onBigPhotoBase64Back(base64Files) {
    setTimeout(function() {
        page._uploadImage('data:image/jpg;base64,' + base64Files[0]);
    }, 100);

}
