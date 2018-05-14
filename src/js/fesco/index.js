;(function (w,d){
    var H = d.getElementsByTagName('head')[0] || d.head || d.documentElement;
    var B = d.getElementsByTagName('body')[0] || d.body || d.documentElement;
    var urls;
    var msg = {
        show:function(str, url){
            var popup_msg_style = d.createElement('style');
                popup_msg_style.type = "text/css";
                popup_msg_style.id = 'popup_msg_style';
                var popup_msg_style_text = '.popup_msg_box{width:70%;padding:0 5%;font-family:"微软雅黑"; border:1px solid #e7e7e7;border-radius:5px;background:#fff;color:#333;position:fixed;top:20%;left:10%;z-index:12; }' 
                    + '.popup_msg_tit{height:40px;line-height:40px;color: blue;font-size: 18px;}' 
                    + '.popup_msg_str{width:100%;word-break:break-all;word-wrap:break-word;font-family:"微软雅黑";font-size:16px;line-height:1.6;padding:10px 0;max-height:200px;overflow:auto;}' 
                    + '.popup_mag_true{width:100%;position:absolute;bottom:0px;left:0;padding:2px 0;border-top: 1px solid #ddd;text-align:center;}' 
                    + '.popup_mag_true a{color: blue;width:90px;height:40px;line-height:40px;display:inline-block;border:none;font-size:14px;font-weight:bold; cursor:pointer;width: 98%;}'
                    // + '.popup_mag_true a:first-child{color:#333;border-right:1px solid #ddd}'
                    + '#popup_msg_tan{position:fixed;top:0;height:100%;width:100%;background:#000;opacity:0.5;filter:alpha(opacity=50);z-index:11;}'
                if (popup_msg_style.styleSheet) { //IE
                    popup_msg_style.styleSheet.cssText = popup_msg_style_text;
                } else {
                    popup_msg_style.innerHTML = popup_msg_style_text;
                }
                H.appendChild(popup_msg_style);
            var popup_msg_box = d.createElement('div');
                popup_msg_box.innerHTML = '<div class="popup_msg_tit">提示</div><div class="popup_msg_str">' + str + '<div id="time"></div></div><div style="width:100%;height:40px;"></div><div class="popup_mag_true"><a href="javascript:;" onclick="msgx(this.parentNode,1)">是</a></div>';
                popup_msg_box.className = 'popup_msg_box';
                B.appendChild(popup_msg_box);
                var popup_msg_tan = d.createElement('div');
                popup_msg_tan.id = 'popup_msg_tan';
                B.appendChild(popup_msg_tan);

                if (url && typeof url === 'function') {
                    urls = url;
                } else if (url && typeof url === 'string') {
                    if (url.match('http://') || url.match('https://')) {
                        urls = url
                        var i = 5,
                            t, s = d.getElementById('time');
                        s.innerHTML = i + '秒后自动跳转';
                        t = setInterval(function() {
                            i -= 1;
                            s.innerHTML = i + '秒后自动跳转';
                            if (i == 0) window.location.href = u;
                        }, 1000);
                    }
                }
        },
        close:function(obj,bool){
            if (urls) {
                typeof urls === 'function' ? urls(bool) : window.location.href = urls;
            }
            var a = d.getElementById('popup_msg_style');
            H.removeChild(a);
            B.removeChild(d.getElementById('popup_msg_tan'));
            B.removeChild(obj.parentNode);
        }
    } 
    var loading = {
        show:function(){
            my.showMask()
            var loading_box = d.createElement('div');
            loading_box.innerHTML = '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
            loading_box.id = 'loading';
            loading_box.className = 'spinner';
            B.appendChild(loading_box);
        },
        hide:function(){
            my.hideMask()
            B.removeChild(d.getElementById('loading'));
        }
    }
    //信息提示，msg(arguments)
    w.msgx = msg.close;   
    w.msg = msg.show;
    w.loading = loading;

})(window,document)

;(function(A) {
    var U = A.admin,
        S = A.service,
        CT = function() {};
    A.extend(CT.prototype, A.base, U, S, { 
        flag : [], 
        // true是续传，false是不续传
        resume : false,
        baseUri: "@@fescoUri@@",
        ua:navigator.userAgent.toLowerCase().match('iphone'),
        param : A.getParams(),
        params : A.parseJSON(decodeURIComponent(new Base64().decode(A.getParams().params)).replace(/\+/g,' ')),
        onReady: function () {
            var that = this;          
            // 判断页面加载的数据类型
            that.params.isResume = that.param.isResume
            that.params.isType = that.params.type-1;
            that.params.url = that.param.orderwarpid ? that.param.url+'&orderwarpid='+that.param.orderwarpid : that.param.url;
            // 缓存每个单据类型图片数
            that.imgLenArr = {}
            for(var i in that.params.lastinteruptsample){
                that.imgLenArr[i] = that.params.lastinteruptsample[i].length-1
            }
            // that.params.medicalInfo.date = that.params.medicalInfo.date.split(' ')[0];
            // 续传数据时处理
            if (that.params.lastinteruptsample.length>0) {  
                that.resume = true;
                that.changeType(that.params.id,that.params.type)
                return
            }
            that.isTemplate(true);
        }, 
        isTemplate:function(bool){
            var that = this;
            if(bool){
                // 取localStorage缓存数据
                try{that.localStorage(that.params)}catch(e){console.log(e);}
            }
            // 渲染模板
            $('.imgList').html(template("imgList", that.params));
            // 配置微信API
            A.weixin.config(that.param.appid, that.param.ticket, ['chooseImage','previewImage','uploadImage','downloadImage'])
            // 绑定默认事件
            that.initEvent()
        },
        // 改变报销类型删除原有图片
        changeType: function(id,type){
            var that = this;
            that.fesco.getAttr({
                "id":id,
                "hospitalId":that.params.hospitalId,
                appfrom: that.param.appfrom
            }).success(function(res){
                var obj = res.returnObj ? JSON.parse(res.returnObj) : false;
                if(obj && obj.FeeType != type){
                    A.each(that.params.lastinteruptsample,function(index, el) {
                        A.each(el.imgInfoList,function(index, el) {
                            that.flag.push({'src':el.imgName})
                        });
                    });
                    that.params.lastinteruptsample = [];
                    // 渲染模板
                    that.isTemplate();
                }else{
                    that.isTemplate(true);
                }
                
            }).fail(function(res){
                if(res.rtnCode=410) msg(res.hintMsg);
            })
        },
        // 删除数组中指定元素
        removeArray : function (arr,val){
            for (var i = 0;i < arr.length ; i++) {
                if(arr[i]==val){
                    arr.splice(i,1)
                }
            };
            return arr;
        },      
        // 取LocalStorage数据，赋值到页面
        localStorage:function(params){
            var that = this;
            // localStorage.clear()
            if(params.lastinteruptsample.length==0){
                var no = A.widget.local.getItem('noId'),type = A.widget.local.getItem('isType');
                // 判断localStorage缓存的id和报销类型是否和本次一致
                if (no == params.id&&type == params.isType) {
                    for (var i = 0; i < params.list[type].length; i++) {
                        // 获取当前报销类型的图片
                        var typeList = A.widget.local.getItem(params.list[type][i].type),
                            data = {imgType:params.list[type][i].type,imgInfoList:[]};
                        A.each(typeList,function(index, el) {
                            // 获取图片的所有信息，src和no号
                            var lsImg = A.widget.local.getItem(el),
                                lsImgData = {"src":lsImg.src,"valid":"false","serverId":lsImg.serverId};
                                // if(lsImg.imgNo) lsImgData.imgNo = lsImg.imgNo;
                            if(lsImg.time) {
                                var s = new Date().getTime()-(lsImg.time+216000000);
                                if(s>0) return;
                            }
                            data.imgInfoList.push(lsImgData)
                        });
                        // localStorage数据赋值给that.params.lastinteruptsample[i]
                        that.params.lastinteruptsample[i] = data;
                    };
                } else {
                    // id号和报销类型不一致或者没有，清楚localStorage并记录新值
                    A.widget.local.clear()
                    A.widget.local.setItem('noId',params.id)
                    A.widget.local.setItem('isType',params.isType)
                }
            }else{
                // 回传时清除全部localStorage数据
                A.widget.local.clear()
            }
        },
        // 初始化事件
        initEvent:function(){
            var that = this;
            $('.foot_txt').eq(0).html(that.params.name||'')
            $('.menu').off('click').on('click', 'li', function(event) {
                if(event.target.toString() != "[object HTMLLIElement]") return;
                var _this = $(event.target),
                    index = parseInt(_this.attr('data-index')),
                    text = _this.text(),
                    id = event.target.id.split('li')[1]
                that.toggleTab(_this,index,text)
            });
            $('.btnBlock1').off('click').on('click', function(event) {
                location.href = that.params.url
            });
            $('.btnDone').off('click').on('click', function(event) {
                that.showBasicInfo()
            });
            if(that.param.appfrom == '1'){
                $('.btnNext').hide();
            }
            $('.btnNext').off('click').on('click', function(event) {
                that.showBasicInfo(true)
            });
            $('.btnUp').off('click').on('click', function(event) {
                that.upImg(event.target)
            });
            $('.btnShowImg').off('click').on('click', function(event) {
                var img = event.target.id;
                that.showImg(img)
            });
            $('.delet').off('click').on('click', function(event) {
                try{that.deleteImg(event.target)}catch(e){alert(e)}
            });
        },
        // 上传图片到微信
        upImg: function (obj) {
            var that = this;
            $("#ServerId").val("");
            $(obj).attr("imgs", "");
            A.weixin.chooseImage().success(function(res) {
                // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                var localIds = res.localIds; 
                A.widget.local.setItem(obj.id,localIds);
                $(obj).attr("imgs", localIds);
                that.uploadImg(obj, localIds);
            });
        },
        // 上传图片到服务器
        uploadImg: function (obj, localIds) {
            var that = this,
                imgs = $(obj).prev("input"),
                val = "";

            if (imgs.attr("name") == "imgsortId") val = imgs.val();

            //显示loading
            var localId = localIds.pop();
            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function(res) {
                    //alert('upload success:' + JSON.stringify(res));
                    // 返回图片的服务器端ID
                    var serverId = res.serverId; 
                    that.imgLenArr[obj.id] += 1

                    // 拼接显示图片的html
                    var html = '<div class="overflow_h wi100">\
                                    <a href="javascript:;" class="delet fl_right" id="'+obj.id+'_'+that.imgLenArr[obj.id]+'"></a>\
                                </div>\
                                <div class="sel">\
                                    <img src="' + localId + '" id="' + serverId + '" style="width:100%;"/><br/>\
                                </div>';
                    // 处理LocalStorage数据
                    A.widget.local.setItem(localId,{"src":localId,"type":obj.id,"serverId":serverId,"time":new Date().getTime()});
                    // 发票图片类型增加发票输入框
                    // if(obj.id == '12') html = html.replace(/<br\/>/,'<br/><input type="text" id="'+localId+'" placeholder="请添加发票号" value="" class="tianxie wi100 cardNo"><br/>')
                    // append到页面上
                    $(obj).parent().children("div").append(html);
                    // 重新加载事件
                    that.initEvent()
                    // 上传选项卡变灰
                    $('.imgSort').eq($(obj).data('index')).addClass('hui')
                    
                    if (localIds.length > 0) {
                        that.uploadImg(obj, localIds);
                    }

                },
                error: function(){
                    //alet('upload error');
                    //alert(JSON.stringify(arguments));
                }
            });
        },
        // 删除图片
        deleteImg: function (obj) {
            var that = this,
                parent = $(obj).closest('uppanl'),
                img = $(obj.parentNode).next().find('img').get(0),
                key = that.ua ? "wxLocalResource://"+img.src.split('://')[1]:img.src;
            // 删除localStorage图片缓存
            var lsImg = A.widget.local.getItem(key);
            if(lsImg){
                var typeList = A.widget.local.getItem(lsImg.type);
                A.widget.local.setItem(lsImg.type,that.removeArray(typeList,key))
                A.widget.local.remove(key)
                A.widget.local.getItem(lsImg.type)
            }
            // 判断前缀为http的图片，赋值到flag里传给fesco
            if(img.src.match('http')) that.flag.push({'src':img.getAttribute('imgName')})
            // 删除dom
            $(obj).parent().next("div").remove().end().remove();
            // 判断图片是否全部删除，选项卡去掉灰色
            if(parent.find('img').length==0){
                $('.imgSort').eq(parent.index()-1).removeClass('hui')
            }
        },
        // 查看示例图片
        showImg: function (id) {
            var that = this;
            var imgArr = [location.href.split('?params')[0]+'style/images/example/'+id+'.jpg'];
            wx.previewImage({
                current: imgArr[0], //第一张打开的图片
                urls: imgArr// 需要预览的图片数组
            });
        },
        // 切换单据
        toggleTab: function (_this, index, msg) {
            var that = this;
            $("[name='imgSortName']").val(msg)
            $('.imgSort').removeClass('active').eq(index).addClass('active')
            $(".uppanl").hide().eq(index).show()
        },
        // 显示详细数据
        showBasicInfo: function (next) {
            var that = this,
                bool = true;
            var data = {"Id":that.params.id,"PicList":[]};
            // 验证必传项
            $('.uppanl').each(function(index, el) {
                var imgs = $(el).find('img'),// 获取图片jquery对象
                    type = $(el).find('.imgSortId').val(),// 获取单据类型
                    list = that.params.list[that.params.isType],// 获取当前单据类型的判断对象
                    uppanl = {};
                for (var i = list.length - 1; i >= 0; i--) {
                    if(list[i].type == type) uppanl = list[i]
                };
                // 判断是否必选
                if(uppanl.required&&imgs.length==0) {
                    bool = false;
                    msg(uppanl.name+'是必选,请上传单据')
                    return false;
                }
            })
            if(bool) that.submitInfo(next); 
        },
        // 提交数据
        submitInfo: function(bool){
            var that = this;
            var data = {
                //单据类型
                FeeType: that.params.type,
                //fesco单据id
                Id: that.params.id,
                //医院
                Hospital: that.params.hospitalId,
                //手机号
                Phone: "",
                orderwarpid: that.params.orderwarpid,
                isResume: bool ? 'False' : 'True',
                Resume: that.resume,
                Token: that.param.token,
                Flag: that.flag,
                // 上传到微信的图片
                PicList: []
            }
            loading.show()
            // 循环获取图片信息
            $('.uppanl').each(function(index, el) {
                var imgs = $(el).find('img'),// 获取图片jquery对象
                    type = $(el).find('.imgSortId').val();// 获取单据类型;
                // 获取到的图片id push进data.picList
                var addList = function (src,severId,type){   
                    if(src==undefined) return;
                    var picData 
                    if(severId){
                        picData = {
                            BillType:  type, // 类型
                            MediaId: severId, // 微信id或者图片src
                            Resume: false // 是否续传
                        }
                    }else{
                        // 续传图片处理 
                        picData = {
                            BillType:  type,
                            MediaId: src,
                            Resume: true
                        } 
                    }
                    
                    data.PicList.push(picData)
                }
                if(imgs.length>1){
                    for (var i = 0; i < imgs.length; i++) {
                        addList(imgs[i].src,imgs[i].id,type)
                    };
                }else{
                    addList(imgs.attr('src'),imgs.attr('id'),type) 
                }
            });
            // 没有图片阻止提交
            if(data.PicList.length==0) {
                msg('没有图片需要上传')
                loading.hide()
                return
            };
            data.appfrom = that.param.appfrom;
            that.fesco.saveImg(data).success(function(res) {
                // msg(JSON.stringify(res));
                loading.hide();
                msg('数据提交成功');
                A.widget.local.clear();
                if(bool){
                    location.href = that.param.medurl;                   
                }else{
                    location.href = that.param.backurl;                    
                }
                
            }).fail(function(err){
                msg("接口出错，请撤销此单，重新提交");
                loading.hide();
            })
        }
        
    })
    $(function() {
        var fesco = new CT()
        // fseco大类下的子单据类型
        fesco.params.list = [
            //住院已结算
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: true,
                child: true
            }, {
                name: "外伤（中毒）情况说明",
                type: 33,
                required: false,
                mate: true,
                child: false
            }, {
                name: "汇总明细",
                type: 41,
                required: true,
                mate: true,
                child: true
            }, {
                name: "结算单",
                type: 42,
                required: true,
                mate: true,
                child: true
            }, {
                name: "出院诊断证明",
                type: 43,
                required: true,
                mate: true,
                child: true
            }, {
                name: "出入院记录",
                type: 58,
                required: false,
                mate: true,
                child: true
            }], 
            //门诊已结算
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: true,
                child: true
            }, {
                name: "明细",
                type: 28,
                required: false,
                mate: true,
                child: true
            }, {
                name: "处方",
                type: 29,
                required: false,
                mate: false,
                child: true
            }, {
                name: "检查化验报告",
                type: 30,
                required: false,
                mate: true,
                child: true
            }, {
                name: "病例",
                type: 31,
                required: false,
                mate: true,
                child: true
            }, {
                name: "慢性病诊断证明",
                type: 35,
                required: false,
                mate: true,
                child: false
            }, {
                name: "外伤（中毒）情况说明",
                type: 33,
                required: false,
                mate: true,
                child: false
            }, {
                name: "结算联",
                type: 59,
                required: false,
                mate: true,
                child: false
            }],
            //生育未结算
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: false,
                child: false
            }, {
                name: "异地安置证明",
                type: 37,
                required: false,
                mate: false,
                child: false
            }, {
                name: "汇总明细",
                type: 41,
                required: true,
                mate: false,
                child: false
            }, {
                name: "全额结算证明",
                type: 44,
                required: true,
                mate: false,
                child: false
            }, {
                name: "结婚证",
                type: 47,
                required: true,
                mate: false,
                child: false
            }, {
                name: "生育服务证",
                type: 48,
                required: true,
                mate: false,
                child: false
            }, {
                name: "联系单",
                type: 49,
                required: false,
                mate: false,
                child: false
            }, {
                name: "婴儿出生证明",
                type: 50,
                required: true,
                mate: false,
                child: false
            }, {
                name: "诊断证明",
                type: 51,
                required: true,
                mate: false,
                child: false
            }, {
                name: "异地生育证明",
                type: 52,
                required: false,
                mate: false,
                child: false
            }, {
                name: "异地医院医保证明",
                type: 53,
                required: false,
                mate: false,
                child: false
            }],
            //围产
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: false,
                child: false
            }, {
                name: "明细",
                type: 28,
                required: false,
                mate: false,
                child: false
            }, {
                name: "处方",
                type: 29,
                required: false,
                mate: false,
                child: false
            }, {
                name: "异地安置证明",
                type: 37,
                required: false,
                mate: false,
                child: false
            }, {
                name: "结婚证",
                type: 47,
                required: true,
                mate: false,
                child: false
            }, {
                name: "生育服务证",
                type: 48,
                required: true,
                mate: false,
                child: false
            }, {
                name: "联系单",
                type: 49,
                required: false,
                mate: false,
                child: false
            }, {
                name: "孕周诊断证明",
                type: 54,
                required: false,
                mate: false,
                child: false
            }],
            //计生
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: false,
                child: false
            }, {
                name: "明细",
                type: 28,
                required: false,
                mate: false,
                child: false
            }, {
                name: "处方",
                type: 29,
                required: false,
                mate: false,
                child: false
            }, {
                name: "异地安置证明",
                type: 37,
                required: false,
                mate: false,
                child: false
            }, {
                name: "计生诊断证明",
                type: 46,
                required: true,
                mate: false,
                child: false
            }, {
                name: "结婚证",
                type: 47,
                required: true,
                mate: false,
                child: false
            }],
            //住院未结算
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: false,
                child: true
            }, {
                name: "外伤（中毒）情况说明",
                type: 33,
                required: false,
                mate: false,
                child: false
            }, {
                name: "异地安置证明",
                type: 37,
                required: false,
                mate: false,
                child: false
            }, {
                name: "出差探亲证明",
                type: 40,
                required: false,
                mate: false,
                child: false
            }, {
                name: "汇总明细",
                type: 41,
                required: true,
                mate: false,
                child: true
            }, {
                name: "出院诊断证明",
                type: 43,
                required: true,
                mate: false,
                child: true
            }, {
                name: "全额结算证明",
                type: 44,
                required: false,
                mate: false,
                child: false
            }, {
                name: "出入院记录",
                type: 58,
                required: false,
                mate: false,
                child: false
            }],
            //门诊未结算
            [{
                name: "收据副本",
                type: 12,
                required: true,
                mate: false,
                child: true
            }, {
                name: "明细",
                type: 28,
                required: false,
                mate: false,
                child: true
            }, {
                name: "处方",
                type: 29,
                required: false,
                mate: false,
                child: true
            }, {
                name: "检查化验报告",
                type: 30,
                required: false,
                mate: false,
                child: true
            }, {
                name: "外伤（中毒）情况说明",
                type: 33,
                required: false,
                mate: false,
                child: false
            }, {
                name: "病例（急诊病例需快递原件）",
                type: 34,
                required: true,
                mate: false,
                child: true
            }, {
                name: "慢性病诊断证明书",
                type: 35,
                required: false,
                mate: false,
                child: false
            }, {
                name: "领卡证明（领卡回执单）",
                type: 36,
                required: false,
                mate: false,
                child: false
            }, {
                name: "异地安置证明",
                type: 37,
                required: false,
                mate: false,
                child: false
            }, {
                name: "还欠说明",
                type: 38,
                required: false,
                mate: false,
                child: false
            }, {
                name: "急诊诊断证明（急诊必传）",
                type: 39,
                required: false,
                mate: false,
                child: false
            }, {
                name: "出差探亲证明",
                type: 40,
                required: false,
                mate: false,
                child: false
            }]
        ]
        fesco.onReady()
    });
})(my);