;
(function(A) {
    var CT = function() {};
    A.extend(CT.prototype, A.service, {
        // 太保带出的数据
        params: A.getParams(),
        // 上传失败次数
        failNum: 0,
        // 类型的索引
        typeIndex: 0,
        // 上传图片队列的数组
        uploadArr: [],
        // 存放小图的base64数组
        thumbnail: [
            [],
            [],
            [],
            [],
            []
        ],
        // 拍摄图片的绝对路径数组
        imgPaths: [
            [],
            [],
            [],
            [],
            []
        ],
        // 上传成功
        uploadDone: true,
        // 单据类型的数组
        types: ["200", "500", "400", "1000", "1000"],
        types2: ["04", "01", "05", "06", "08"],
        //ios终端
        isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        // 是不是安卓
        isAndroid: navigator.userAgent.match(/Android/i),
        onReady: function() {
            var that = this;

            // 上传成功跳转的url
            that.url = decodeURI(that.params.url || '');
            // 返回按钮点击时跳转的url
            that.backurl = decodeURI(that.params.backurl || '');
            // 兼容SN大小写
            that.params.sn = that.params.SN;

            var data = that.params;

            // 组数据，提交单据用的数据
            that.commitData = {
                images: []
            };
            A.extend(that.commitData, data)
            that.initEvent();
            that.getOssKey()
            that.takephoto = cordova.require('com.hejin.takephoto.takephoto');

            // 调试用，点击标题刷新页面
            // $('.status-name').on('click', function(event) {
            //     location.reload(true)
            // });
            // 兼容太保webview没有100%的高度
            var height = $(window).height()
            $('body,.section-two,.section-one').height(height);
            // 如果是本人隐藏亲属身份证上传选项
            if (that.params.isself == 1) {
                $(".onlist li").last().hide()
                $(".heading").last().hide()
                $(".bg-white").last().hide()
            }
        },

        initEvent: function() {
            var that = this;

            if (!that.params) {
                A.alert('参数输入有误，请稍后重试');
            }

            that.sn = that.params.SN;
            that.tokenJs = hex_md5(that.params.enterpriseId + that.sn + that.params.time);
            //判断token值
            // if (that.tokenJs != that.params.token) {
            //     A.alert('token值不对，请退出重试');
            //     return;
            // };
            $('.sec_must').show()
                // 监护人身份证必传判断
            if (that.params.isself == 1) $('.must_4').hide();
            // 费用清单必传判断
            if (that.params.acctype == 1) $('.must_3').hide();

            //照片预览
            $('#preview_photo').click(function() {
                if (that.loading) {
                    A.alert('正在处理，请稍后。。。');
                    return;
                }
                $('.section-two').show();
                $('.section-one').hide();
            });
            //预览返回
            $('.toSes1').click(function() {
                $('.section-one').show();
                $('.section-two').hide();
                $('.large-image').hide();
            });
            //upload页面跳转
            $('.JSgo_back').click(function() {
                $('.popup-container').addClass('active')
            });
            $('.popup-buttons').on('click', 'button', function(event) {
                if ($(this).hasClass('button-default')) {
                    $('.popup-container').removeClass('active')
                } else {
                    window.location.href = that.backurl;
                }
            });
            //点击提交
            $('#submit_sub').click(function() {
                that.submitImages();
            });
            //点击显示后面的图片
            $('.thumbList').delegate(".pointClick", "click", function() {
                that.typeIndex = parseInt($(this).parents('.thumbList').attr('_index'), 10);
                that.typeImgIndex = 3;
                that.showPhotoPeviews();
            });
            //点击放大图片
            $('.thumbList').delegate("img", "click", function() {
                that.typeIndex = parseInt($(this).parents('.thumbList').attr('_index'), 10);
                that.typeImgIndex = parseInt($(this).parents('.item').index(), 10);
                that.showPhotoPeviews();
            });
            //调用拍照
            $('.icon_camera').click(function(ev) {
                that.typeIndex = parseInt(ev.target.getAttribute('data-index'));
                $('.upload_menu,.upload_menu_box').addClass('active');
            });
            $('.upload_menu').delegate('.upload_menu_item', 'click', function(event) {
                var index = $(this).index();
                try {
                    switch (index) {
                        case 0:
                            that.again = false;
                            that.takePhotaNative();
                            break;
                        case 1:
                            that.takePhotaNative(true)
                            break;
                        case 2:
                            that.closeMenu()
                            break;
                    }
                } catch (e) {
                    alert(e)
                }
                that.closeMenu()

            });
            $('.upload_menu_box').on('click', function(e) {
                that.closeMenu()
            });
        },
        closeMenu: function() {
            $('.upload_menu,.upload_menu_box').removeClass('active');
        },
        base64Code: function(str) {
            var b = new Base64();
            var strdecode = b.decode(str);
            return A.parseJSON(strdecode);
        },
        eventBackButton: function() {
            var that = this;
            if (that.submitDone) return;
            if ($('.section-two').css('display') == "block") {
                $('.section-one').show();
                $('.section-two').hide();
            } else {
                $('.popup-container').addClass('active')
            }
        },
        deleteImg: function(paths) {
            var that = this,
                arr = that.delArr(that.imgPaths[that.typeIndex], paths),
                imgs = that.commitData.images,
                upImg = that.uploadArr;

            A.each(arr, function(i, e) {
                A.each(imgs, function(j, a) {
                    if (e == a.sysPath) imgs.splice(j, 1);
                })
                A.each(upImg, function(k, b) {
                    if (e == upImg[b]) upImg.splice(k, 1);
                })
            })

        },
        /**
         *保存图片的绝对路径
         */
        addPaths: function(paths, bool) {
            var that = this,
                index = that.typeIndex;

            // 向数组里保存路径
            if (bool) {
                that.deleteImg(paths);
                that.imgPaths[index] = paths;
            } else {
                that.imgPaths[index] = that.imgPaths[index].concat(paths);
            }
            //更新页面显示的数量
            var len = that.imgPaths[index].length;
            var tip = document.getElementById('message_tip' + index);
            document.getElementById('num_photo_' + index).innerHTML = len;
            tip.innerHTML = len;
            len == 0 ? tip.style.display = 'none' : tip.style.display = 'block';
        },
        /**
         * [addThumbnail 拍照以后预览小图]
         * @param {string} base64s [图片base64数组]
         */
        addThumbnail: function(base64s) {
            var that = this;
            var imgArr = [];
            if (base64s == null) base64s = [];
            for (var i = 0; i < base64s.length; i++) {
                imgArr.push("data:image/jpg;base64," + base64s[i]);
            }
            that.thumbnail[that.typeIndex] = imgArr;
            that.upThumbnail(that.typeIndex)
            that.closeMenu()
        },
        /**
         * upThumbnail 更新typeIndex栏目的缩略图
         */
        upThumbnail: function(typeIndex) {
            var that = this,
                html = [],
                len = that.imgPaths[typeIndex].length;

            A.each(that.thumbnail[typeIndex], function(i, src) {
                if (i == 3 && len > 4) {
                    html.push('<div class="item pointClick">\
                            <div class="content"><i class="iconfont">&hellip;</i></div>\
                        </div>');
                } else {
                    html.push('<div class="item">\
                            <div class="content"><img src="' + src + '"></div>\
                        </div>');
                }
            });

            document.getElementById('thumbList_' + typeIndex).innerHTML = html.join('');
        },
        /**
         * submitImages 最后点击完成
         */
        submitImages: function() {
            var that = this;
            var imgPaths = that.imgPaths;

            //如果是首次上传，判断每一种单据都不能为空
            if (that.params.is_supplement != 1) {
                if (imgPaths[0].length == 0) {
                    A.alert('请上传被保险人身份证件');
                    return;
                }
                if (imgPaths[1].length == 0) {
                    A.alert('请上传门急诊／住院病例');
                    return;
                }
                if (imgPaths[2].length == 0) {
                    A.alert('请上传费用发票');
                    return;
                }
                // 监护人身份证必传判断
                if (that.params.isself == 0) {
                    if (imgPaths[4].length == 0) {
                        A.alert('请上传法定监护人身份证件及关系证明');
                        return;
                    }
                }
                // 费用清单必传判断
                if (that.params.acctype == 0) {
                    if (imgPaths[3].length == 0) {
                        A.alert('请上传费用清单');
                        return;
                    }
                }
            };
            // 最终上传完成提交到后台
            that.showProgress();
            that.submitDone = true;
            if (that.uploadDone) {
                // 通知太保删除图片
                that.params.istoapp != 1 ? that.deleteImageByOCR() : that.uploadImageDone();
            }else{
                that.uploadImage()
            }

        },
        showProgress: function(done) {
            var that = this;
            var totalImgs = 0;
            var tip = document.querySelectorAll('.message_tip');
            for (var i = tip.length - 1; i >= 0; i--) {
                totalImgs += parseInt(tip[i].innerHTML)
            }
            var upIndex = totalImgs - that.uploadArr.length - 1,
                step = done ? 100 : parseInt(upIndex * 100 / totalImgs, 10),
                baseN = Math.ceil(100 / totalImgs);

            if (that.timeInter) {
                clearInterval(that.timeInter);
            }
            var i = 1;
            that.timeInter = setInterval(function() {
                if (i > 10) {
                    clearInterval(that.timeInter);
                } else {
                    var percentage = parseInt(baseN / 10 * i) + step;
                    if (percentage < 0) percentage = 0;
                    if (percentage > 100) percentage = 100;
                    var html = '\
                        <div class="progress">\
                            <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentage + '%;color:#bbb;">' + percentage + '%</div>\
                        </div>';
                    A.widget.loading.show({
                        message: html,
                        iconCls: 'myloading',
                        container: 'myloading-container iloading-container'
                    });
                }
                i++;
            }, 30);
        },
        /**
         * uploadImage 上传图片预处理函数
         */
        uploadImage: function() {
            var that = this;
            // uploadArr上传完成 return掉
            if (that.uploadArr.length == 0 && !that.upImg) return;
            that.uploadDone = false;
            // 递归uploadArr中元素
            if (!that.upImg) that.upImg = that.uploadArr.shift()
            that.takephoto.getBase64({
                imagePaths: [that.upImg.path],
                picture_width: 1000
            }, function(base64) {
                that.onBigPhotoBase64Back(base64);
            });
        },
        /**
         * _uploadImage 上传图片函数
         */
        _uploadImage: function(img) {
            var that = this,
                img = that.upImg,
                dataUri = that.params.istoapp == 1 ? "uploadOSS" : "uploadTaibao",
                imgPath = img.path,
                imgName = that.sn + that.formatNum(img.index, 3) + that.types2[img.type] + that.formatNum(img.imgIndex + 1, 2) + '.jpg';

            that.testData.fileName = imgName;
            that.testData.base64File = img.base64;
            if (that.params.istoapp == 1) that.testData.sn = that.sn;
            if (that.submitDone) that.showProgress();
            that.upfileList[dataUri](that.testData).success(function(res) {
                that.failNum = 0;
                that.upImg = false;
                that.commitData.images.push({
                    type: that.types[img.type],
                    path: that.params.istoapp == 1 ? that.testData.dirName + imgName : res,
                    name: imgName,
                    sysPath: img.path
                });
                if (that.uploadArr.length == 0) {
                    that.uploadDone = true;
                    if(that.submitDone) that.params.istoapp != 1 ? that.deleteImageByOCR() : that.uploadImageDone();
                } else {
                    that.uploadDone = false;
                    that.uploadImage();
                }
            }).fail(function(res) {
                that.failNum += 1;
                if (that.failNum < 3) that._uploadImage();
                else {
                    that.failNum = 0;
                    // that.uploadDone = true;
                    that.uploadError('上传图片失败，请重新尝试')
                }
            });
        },
        deleteImageByOCR: function() {
            var that = this,
                list = [],
                imgs = that.commitData.images;
            for (var i = imgs.length - 1; i >= 0; i--) {
                list.push({
                    'imgName': imgs[i].path
                })
            }
            that.upfileList.deleteImageByOCR({
                SN: that.params.sn,
                imgList: A.toJSON(list)
            }).success(function(res) {
                if (res.code == 0) {
                    that.uploadError('removeImageByOCR: '+ res.msg)
                }else{
                    window.location.href = that.url || 'success.html';
                }
            }).fail(function(res) {
                that.uploadError()
            })
        },
        /**
         * uploadImageDone 全部上传图片成功函数
         */
        uploadImageDone: function() {
            var that = this;
            that.submitDone = false;
            // 进度条
            that.showProgress(true);

            that.upfileList.uploadComplete(that.commitData).success(function(res) {
                // 成功之后删除文件夹下所有图片  
                that.takephoto.deleteAll({}, function(suc) {});
                // 跳转到成功页面 
                window.location.href = that.url || 'success.html';
            }).fail(function(res) {
                that.uploadError()
            })
        },
        // 获取oss的上传key
        getOssKey: function() {
            var that = this;
            that.upfileList.getOssKey({
                "SN": that.sn
            }).success(function(res) {
                that.testData = res;
            }).fail(function(res) {
                that.testData = res;
            })
        },
        uploadError: function(msg) {
            var that = this;

            clearInterval(that.timeInter);
            A.widget.loading.hide();
            if(msg) {
                A.alert(msg)
                return;
            }

            if (that.commitData.images.length > 0) {
                msg = '您已经上传' + that.commitData.images.length + '张单据，';
            }
            A.alert(msg + '由于网络传输发生错误，请重新上传');
        },
        takePhotaNative: function(isAlbum) {
            var that = this;
            that.takephoto.takeCamera({
                album: isAlbum,
                limit_count: 100,
                autoBlur: false,
                savetoalbum: true,
                eachCallback: true
            }, function(paths) {
                that.onTakePhotoBack(paths, isAlbum);
            });
        },
        //native预览图片
        showPhotoPeviews: function() {
            var that = this,
                paths = that.imgPaths[that.typeIndex],
                index = that.typeImgIndex;

            that.takephoto.showPhotoPeview({
                hideRetakeBtn: false,
                hideDelBtn: false,
                savetoalbum: true,
                imagePaths: paths,
                index: index
            }, function(paths) {
                that.onPeviewPhotoBack(paths, true);
            });
        },
        /**
         * [onTakePhotoBack 拍照后的callback]
         * @param  {array} callback [图片的路径数组]
         */
        onTakePhotoBack: function(callback, isAlbum) {
            var that = this;
            try {
                var index = that.uploadArr.length;
                var len = (that.imgPaths[that.typeIndex] || []).length;

                // 把paths中的图片路径加入imgPaths
                that.addPaths(isAlbum ? callback : callback.length == 0 ? [] : [callback[1]]);

                if (isAlbum) {
                    if (callback.length == 0) return;
                    for (var i = 0; i < callback.length; i++) {
                        that.uploadArr.push({
                            imgIndex: len == 0 ? i : len + i,
                            index: i,
                            type: that.typeIndex,
                            path: callback[i]
                        })
                    }
                } else {
                    if (callback[1]) {
                        that.uploadArr.push({
                            imgIndex: len,
                            index: index == 0 ? index : index - 1,
                            type: that.typeIndex,
                            path: callback[1]
                        })
                    }
                }
                if (that.uploadDone) that.uploadImage()
                // if (that.uploadDone || (!that.uploadDone&&that.submitDone)) that.uploadImage()

                // 如果当前类型图片大于四张，不做下一步操作
                if (callback.length == 0 || callback[0]) {
                    var _paths = that.imgPaths[that.typeIndex]
                        // 获取缩略图
                    that.takephoto.getBase64({
                        imagePaths: _paths.length > 4 ? _paths.slice(0, 5) : _paths,
                        picture_width: 100
                    }, function(base64s) {
                        that.addThumbnail(base64s);
                    });
                }

            } catch (e) {
                my.alert('catch error:' + e.message);
            }
        },
        /**
         * [onPeviewPhotoBack  预览后的返回操作]
         * @param  {array} files [图片的路径数组]
         */
        onPeviewPhotoBack: function(files) {
            var that = this;
            var imgPaths = that.imgPaths[that.typeIndex];
            var retakeBool = false;
            // 把paths中的图片路径加入imgPaths
            that.addPaths(files, true);

            // 循环重拍处理
            for (var i = files.length - 1; i >= 0; i--) {
                if (that.retakeImg(imgPaths, files[i])) {
                    retakeBool = true;
                    var index = that.uploadArr.length;
                    var len = (imgPaths || []).length;
                    that.uploadArr.push({
                        imgIndex: len,
                        index: index == 0 ? index : index - 1,
                        type: that.typeIndex,
                        path: files[i]
                    })
                }
            }
            if (retakeBool) that.uploadImage()


            // 如果当前类型图片大于四张，不做下一步操作
            var _paths = that.imgPaths[that.typeIndex];
            var len = (_paths || []).length;

            // 如果当前类型图片大于四张，不做下一步操作
            if (len > 4) return

            that.takephoto.getBase64({
                imagePaths: _paths,
                picture_width: 100
            }, function(base64) {
                that.addThumbnail(base64);
            });
        },
        /**
         * [onBigPhotoBase64Back  获取大图base64后的callback]
         * @param  {string} base64Files [图片base64值]
         */
        onBigPhotoBase64Back: function(base64Files) {
            var that = this;
            that.upImg.base64 = 'data:image/jpg;base64,' + base64Files[0];
            setTimeout(function() {
                that._uploadImage();
            }, 100);

        },
        formatNum: function(num, length) {
            var numString = num + '';
            var numLength = length - numString.length;
            if (numLength > 0) {
                for (var i = numLength - 1; i >= 0; i--) {
                    numString = '0' + numString;
                }
            }
            return numString
        },
        delArr: function(a, b) {
            var arr = [];
            var arr1 = []
            var len = b.length
            a.map(function(e, i) {
                arr1[i] = 0
                b.map(function(e2, j) {
                    if (e != e2) {
                        arr1[i] += 1;
                        if (arr1[i] == len) arr.push(e)
                    }
                })
            });
            return arr
        },
        retakeImg: function(arr, path) {
            var that = this;
            var img = path;
            A.each(arr, function(i, e) {
                if (e == img) img = false
            })
            return img
        }
    });

    document.addEventListener("deviceready", function() {
        var page = new CT();
        page.onReady();
        document.addEventListener("backbutton", page.eventBackButton, false); //返回键  
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#4190D5");
    }, false);

    // $(function() {
    //     var page = new CT();
    //     page.onReady();
    // });

})(my);
