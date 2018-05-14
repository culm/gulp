 ;
 (function(A) {
     var U = A.admin,
         S = A.service,
         CT = function() {};
     A.extend(CT.prototype, A.base, U, S, {
         params: A.getParams(),
         status: document.querySelector('#status').value,
         hospitalId: '',
         tenantId: '',
         doOCR: true,
         receiptTypeArr: [3000, 200, 300, 400, 100, 500, 600, 910, 900, 9000, 700, 800, 1000, 4000, 410],
         onReady: function() {
             var that = this;

             that.initHeader(function() {
                 that.isAutoTask()
                 if (that.isAutoTask) {
                     that.loadData()
                 }
             });

             //刷新或关闭网页提示
             var BeforUnload = function(e) {
                     e = e || window.event;
                     if (e) {
                         e.returnValue = '离开之后数据无法保存';
                     }
                     return '离开之后数据无法保存';
                 }
                 //默认开启关闭提示
             window.onbeforeunload = BeforUnload;
         },
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
                 status = that.status,
                 url = "getPreprocessPayment",
                 data = status ? { "status": status } : {};

             A.widget.loading.show({
                 message: '数据查询中...'
             });

             that.isTenant(localStorage.getItem('tenantId')||"")

             if (!that.isPingan) { url = "getUnKnownPayment" };
             that.order[url](data).success(function(res) {
                 that.showInfo(res);
                 A.widget.loading.hide();
             }).fail(function(res) {
                 if (res.rtnMsg == "请先选择公司" || res.rtnMsg == "请选择保险公司") {
                     that.reload(10000);
                     that.refreshTenant();
                     A.widget.loading.hide()
                 } else if (res.rtnMsg == "没有待处理的理赔单信息" || res.rtnMsg == "当前没有处理的案件") {
                     A.widget.loading.hide()
                     A.alert('暂时没有数据,请稍后申请')
                     that.reload(10000)
                 } else {
                     A.alert(res.rtnMsg)
                     A.widget.loading.hide()
                 }
             }).notLogin(function(res) {
                 A.widget.loading.hide();
             })
         },
         /**
          * 初始化事件
          **/
         initEvent: function() {
             var that = this;
             $('#No').on('blur', function(event) {
                 var val = event.target.value,
                     id = that.autoId;
                 if (val == '') return;
                 if (!that.isPingan && !that.isFesco && !/^[0-9]*$/.test(val)) {
                     A.alert('收据号有误，请输入全数字收据号')
                     return;
                 }
                 if (!that.isXinanyi) that.checkInvoiceNo(id, val)
             });
             $('#receiptType').on('input', function(event) {
                 var val = $(this).val();
                 /* if (val == 1) {
                      $('.subPicType').removeClass('hide');
                  } else {
                      $('.subPicType').addClass('hide');
                  }*/
                 if (val == 1) {
                    if (that.city && that.city.match('北京')) $('.subPicType').removeClass('hide');
                 } else {
                    $('.subPicType').addClass('hide');
                 }
                 if (that.isPingan) {
                     if (val == 1 || val == 2 || val == 3 || val == 14) {
                         $('.No').removeClass('hide')
                         $('.hospitalname').removeClass('hide');
                         //平安历史,第一次分类时带出发票号
                         if (that.tenantId == 10008 && !that.hospitalName) {
                             if (val == 3 || val == 14) {
                                 that.pullDown(that.invoiceNoList);
                                 $('.hospitalPingan').removeClass('hide');
                             } else if (val == 1 || val == 2) {
                                 that.pullDown(that.unhandledInvoiceNoList);
                                 $('.hospitalPingan').removeClass('hide');
                             }
                         };
                     } else if (val == 7 || val == 8) {
                         $('.No').addClass('hide');
                         $('.hospitalname').removeClass('hide');
                         $('.hospitalPingan').addClass('hide');
                         // $('.subPicType').addClass('hide');
                     } else {
                         $('.No').addClass('hide');
                         $('.hospitalname').addClass('hide');
                         $('.hospitalPingan').addClass('hide');
                         // $('.subPicType').addClass('hide');
                     }
                 } else {
                     if (val == 1 || val == 2 || val == 10 || val == 11) {
                         $('.No').removeClass('hide')
                         $('.hospitalname').removeClass('hide')
                     } else if (that.isWanjia && (val == 7 || val == 8)) {
                         $('.No').removeClass('hide')
                         $('.hospitalname').removeClass('hide')

                     } else if ((that.isFesco && val == 4) || val == 3 || val == 7 || val == 8) {
                         $('.No').addClass('hide')
                         $('.hospitalname').removeClass('hide')
                     } else {
                         $('.No').addClass('hide')
                         $('.hospitalname').addClass('hide')
                     }
                 }
                 if((val == 3 || val == 14) && that.isTaibaomobel){
                    $('.No').removeClass('hide')
                    $('.hospitalname').removeClass('hide')
                 }
                 if(val == 3  && that.isXinanyi){
                    $('.hospitalname').addClass('hide')
                 }
             });
             //切换理赔单和详情，重新调整高度
             $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                 that.resizeHeight();
             });
             A.on(that, 'click', document.querySelector('#main'));
             that.fuzzySearch({
                 id: 'hospitalName',
                 searchUrl: '/RestServiceCall/TenantService/searchTenantList',
                 paramsName: 'tenantName',
                 returnList: 'tenantList',
                 returnName: 'name',
                 returnId: 'id',
                 callback: that.showSubType
             });
             //平安库医院也支持模糊查询
             that.fuzzySearch({
                 id: 'hospitalPingan',
                 searchUrl: '/dataService/getHospitalByName',
                 tenantId: that.tenantId,
                 paramsName: 'name',
                 returnList: 'data',
                 returnName: 'name',
                 callback: that.getPinganHospitalCode
             });
             //平安历史,根据发票号查询医院接口
             if (that.tenantId == 10008) {
                 $('#past').change(function(event) {
                     var invoiceNo = $('#past option:selected').val(),
                         data = { 'paymentNo': that.paymentNo, 'invoiceNo': invoiceNo };
                     if (invoiceNo == "") {
                         return;
                     }
                     that.order.getHospitalByInvoice(data).success(function(res) {
                         $('#hospitalName').val(res.data.hospitalName);
                         that.hospitalId = res.data.hospitalId;
                         $('#hospitalPingan').val(res.data.pingAnHospitalName);
                         that.pingAnHospitalCode = res.data.pingAnHospitalCode;
                     }).fail(function(res) {
                         A.alert(res.rtnMsg)
                     })
                 })
             };

         },
         /**
          * 默认监听事件
          **/
         handleEvent: function(e) {
             var that = this,
                 target = e.target,
                 className = target.className,
                 parent = target.parentNode;

             // 旋转图片
             if (className.match('glyphicon-repeat')) {
                 that.rotationImg(target);
             };
             // 点击保存按钮
             if (className.match('btn-save')) {
                 that.submitInfo(target)
             };
             // 切换左侧缩略图
             if (className.match('glyphicon')) {
                 that.toggleMenu(target, className)
             }
             // 选择拒单原因
             if (className == 'reason') {
                 that.reasonFun(className, target)
             }
             // 手动矫正
             if (className.match('redress')) {
                 that.testCorrect(className, target)
             }
             // 自动矫正
             if (className.match('autoCorrect')) {
                 that.testCorrect(className, target, true)
             }
             // 重置矫正
             if (className.match('reset')) {
                 that.resetPaymentImage(className, target)
             }
             // 重置切割
             if (className.match('reCut')) {
                 that.resetPreprocessImage(className, target)
             }
             // 平安案件挂起
             if (className.match('hang')) {
                 that.hangUp(className, target)
             }
             // 点击图片
             if (parent.className.match('pic')) {
                 var src = target.getAttribute('data-img');
                 $('.imgRepeatBox img').attr({ 'src': src });
                 $('.left-menu img').removeClass('cur');
                 $(target).addClass('cur');
                 if (src.match(that.picName)) {
                     $('.redress,.reset,.btn-save,.add-frame,.affirm-cut,.reCut,.autoCorrect').removeAttr('disabled')
                 } else {
                     //add-frame添加切框,affirm-cut确认切割,reCut重置切割
                     $('.redress,.reset,.btn-save,.add-frame,.affirm-cut,.reCut,.autoCorrect').attr('disabled', true)
                 }
             };
         },
         /**
          * 显示处方、收据等信息
          **/
         showInfo: function(res) {
             var that = this;

             res.imgPath = that.ServerPath + 'upload/download?fileName=';
             if (res.casePaymentDto) { /*平安公司*/
                 var el = res.casePaymentDto;
                 that.autoId = el.id;
                 that.picName = el.picName;
                 that.paymentNo = el.paymentNo;
                 that.sourceId = el.sourceId;
                 that.tenantId = el.tenantId;
                 that.hospitalId = el.hospitalId;
                 that.hospitalName = el.hospitalName;
                 that.currtenPerson = el.currtenPerson;
                 that.picType = el.picType;
                 that.invoiceNo = el.invoiceNo;
                 //平安历史带出发票号
                 that.invoiceNoList = res.invoiceNoList;
                 that.unhandledInvoiceNoList = res.unhandledInvoiceNoList;
                 //单据子类型
                 that.subPicType = el.subPicType;
             } else if (res.paymentBasic) { /*非平安公司*/
                 var el = res.paymentBasic;
                 that.autoId = el.id;
                 that.picName = el.picName;
                 that.paymentNo = el.paymentNo;
                 that.sourceId = el.sourceId;
                 that.tenantId = res.tenantId;
                 that.hospitalId = res.hospitalId;
                 that.hospitalName = res.hospitalName;
                 that.currtenPerson = res.currtenPerson;
                 that.picType = res.picType;
                 that.invoiceNo = res.invoiceNo;
                 that.subPicType = res.subPicType;
             };

             if (that.currtenPerson && that.currtenPerson.match('NAME发生异常')) res.currtenPerson == '';
             res.tenantId = that.getTenantName(that.tenantId);
             //模板冲突
             if (!that.isPingan) {
                 res.casePaymentDto = {};
                 res.casePaymentDto.id = res.paymentBasic.id;
             }
             that.tabDetail({
                 container: '.main-verify',
                 data: res,
                 templateId: 'tabDetail_template_verify'
             });
             var type = '';
             A.each(that.receiptTypeArr, function(index, ele) {
                 if (that.picType == ele) type = index;
             });
             $('#receiptType').focus().val(type).select();
             if (that.picType == 200 || that.picType == 300 || that.picType == 700 || that.picType == 800) {
                 $('.No').removeClass('hide');
                 $('.hospitalname').removeClass('hide');
                 /* if (that.picType == 200) {
                      $('.subPicType').removeClass('hide');
                  }*/
                 if (that.subPicType) {
                     $('.subPicType').removeClass('hide');
                 }
             }
             if ((that.isFesco && that.picType == 100) || that.picType == 400 || that.picType == 900 || that.picType == 910) {
                 $('.No').addClass('hide')
                 $('.hospitalname').removeClass('hide')
             }
             // if (that.tenantId == 10008 && !that.invoiceNo) {
             if (that.tenantId == 10008 && !that.hospitalName) {
                 if (that.picType == 400 || that.picType == 410) {
                     that.pullDown(that.invoiceNoList);
                     $('.hospitalPingan').removeClass('hide');
                 } else if (that.picType == 200 || that.picType == 300) {
                     that.pullDown(that.unhandledInvoiceNoList);
                     $('.hospitalPingan').removeClass('hide');
                 }

             }
             if (that.invoiceNo) $('#No').val(that.invoiceNo);
             if (that.hospitalName) $('#hospitalName').val(that.hospitalName);
             if (that.subPicType) $('#subPicType').val(that.subPicType);


             if (that.picName.match('_correct')) {
                 $('.redress').after('&nbsp;<button type="button" class="btn btn-primary reset">重置矫正</button>')
             }
             // 处理事件
             that.initEvent();
             that.checkHeight();
             that.loadImg();
             that.dragImg();
             that.hotKey();
             //不同公司不同需求
             if (that.isPingan) { /*平安公司*/
                 that.addFrame();
                 that.receiptsCut();
                 if (that.tenantId == 10007) that.isWithdraw();
                 that.addReason(['选择拒单原因', '清单明细无法识别', '发票无法识别', '含两个及两个以上客户资料', '翻译', '影像缺失']);
                 if (that.picName.match('_split')) {
                     $('.affirm-cut').after('&nbsp;<button type="button" class="btn btn-primary reCut">重置切割</button>')
                 };
                 var means = "结算方式:";
                 if (el.sattledType == 01) {
                     means += "直结";
                 } else if (el.sattledType == 02) {
                     means += "事后";
                 } else if (el.sattledType === null) {
                     means = "历史案件";
                 } else {
                     means = "";
                 };
                 var content = $(".detail-title div").eq(0).text();
                 $(".detail-title div").eq(0).html(content + '&nbsp;&nbsp;' + means);
                 //根据单据类型显示隐藏文本框
                 if (that.picType == 400 || that.picType == 410) {
                     $('.No').removeClass('hide')
                     $('.hospitalname').removeClass('hide')
                 }
                 //增加案件挂起功能
                 $('.affirm-cut').after('&nbsp;<button type="button" class="btn btn-primary hang">挂起</button>')
             } else { /*非平安公司*/
                 $(".add-frame").remove();
                 $(".affirm-cut").remove();
                 if (that.isWanjia && (that.picType == 900 || that.picType == 910)) {
                     $('.No').removeClass('hide')
                     $('.hospitalname').removeClass('hide')
                 }
             };
             if (that.isFesco) {
                 that.addReason(['选择拒单原因', '非理赔单据', '整张图像不清晰', '图像破损、缺角', '图像非单张上传'])
             };
             //查询退回原因
             that.order.returnPaymentRetroversion({
                paymentId: that.autoId,
                tenantId: that.tenantId
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
          * 提交信息处理函数
          **/
         submitInfo: function(ev) {
             var that = this,
                 receiptType = that.receiptTypeArr[document.querySelector('#receiptType').value],
                 hospitalName = document.querySelector('#hospitalName').value,
                 reason = document.querySelector('#reason').value,
                 index = document.querySelector('#index').value,
                 // imgObj = document.querySelector('.'+that.defaultId).querySelector('img').src.split('?')[1].split('&'),
                 No = document.querySelector('#No').value,
                 subPicType = document.querySelector('#subPicType').value,
                 data = {};
             if(!$('.hospitalPingan').hasClass('hide')) {
                   var hospitalPingan = document.querySelector('#hospitalPingan').value
             }
             //平安历史,第一次分类时带出发票号
             if (that.tenantId == 10008 && !that.hospitalName) {
                 if ($("#past option:selected").val()) No = $("#past option:selected").val();
             }
             if (receiptType == 9000 && !that.isPingan) {
                 that.otherOrder(receiptType)
                 return
             }

             A.widget.loading.show({
                 message: '数据提交中...'
             });
             if (reason != '') {
                 var url = "notDealPayment";
                 if (reason == '其他原因') {
                     A.widget.loading.hide();
                     A.alert('请输入具体的拒单原因');
                     return
                 }
                 if (that.isPingan) {
                     data = { errCode: index, 'errMsg': reason, 'paymentNo': that.paymentNo }
                     url = "refuseCase";
                 } else {
                     data = { id: that.autoId, 'message': reason, 'picType': receiptType }
                 }

                 if (receiptType == 200 || receiptType == 300) {
                     if (No == '') {
                         A.widget.loading.hide();
                         A.alert('请输入发票号');
                         return false;
                     };
                     // data = { id: that.autoId, 'message': reason, 'picType': receiptType, 'invoiceNo': No };
                     // data = { errCode: index, 'errMsg': reason, 'paymentNo': that.paymentNo, 'invoiceNo': No };
                     data.invoiceNo = No;
                 }
                 // 拒单
                 that.order[url](data).success(function(res) {
                     A.widget.loading.hide();
                     A.alert('原因提交成功');
                     that.reload()
                 }).fail(function(res) {
                     A.alert(res.rtnMsg)
                     that.submitBool = false;
                 }).notLogin(function() {
                     A.login.show(function(user) {
                         that.loadData()
                     });
                 })
             } else if (receiptType == undefined) {
                 A.alert('请选择正确的类型');
                 A.widget.loading.hide();
                 return;
             } else if ((hospitalName == '') && (receiptType == 200 || receiptType == 300 || (receiptType == 400 && !that.isXinanyi) || receiptType == 900 || receiptType == 910 || receiptType == 800)) {
                 A.alert('请选择医院');
                 A.widget.loading.hide();
                 return;
             }else if ((hospitalPingan == '') && (receiptType == 200 || receiptType == 300 || receiptType == 400 || receiptType == 900 || receiptType == 910 || receiptType == 800)) {
                 A.alert('请选择平安库医院');
                 A.widget.loading.hide();
                 return;
              }else if (!that.isPingan && !that.isFesco && !/^[0-9]*$/.test(No) && (receiptType == 200 || receiptType == 300 || receiptType == 400 || receiptType == 900 || receiptType == 910 || receiptType == 800)) {
                 A.alert('请输入正确的发票号');
                 A.widget.loading.hide();
             } else {
                 if (No != '') { data.invoiceNo = No };
                 if (that.pingAnHospitalCode != undefined){data.pingAnHospitalCode = that.pingAnHospitalCode};
                 // data.year = year == '' ? 2016 : year.substr(0, 4).match('201') ? year.substr(0, 4) : 2016;
                 data.type = receiptType;
                 data.subPicType = subPicType;
                 data.hospitalId = that.hospitalId;
                 data.imageName = that.picName;
                 data.id = that.autoId;
                 data.tenantId = that.tenantId;
                 if (this.submitBool) return;
                 that.submitBool = true;
                 that.order.savePayment(data).success(function(res) {
                     if (that.isJinfanwan) {
                         if (receiptType == 200 || receiptType == 300) {
                             that.order.ocrPayment({ id: that.autoId, 'doOCR': false })
                         } else {
                             that.changeStatus(80100)
                         }
                     } else if (that.isXinanyi) {
                         if (receiptType == 300 || receiptType == 400 || receiptType == 3000) {
                             that.order.ocrPayment({ id: that.autoId, 'doOCR': false })
                         } else {
                             that.otherOrder(receiptType)
                         }
                     } else {
                         that.order.ocrPayment({ id: that.autoId, 'doOCR': that.doOCR })
                     }
                     //为了保证成功调用ocr（比较慢）
                     setTimeout(that.reload, 100)
                 }).fail(function(res) {
                     A.widget.loading.hide();
                     A.alert(res.rtnMsg)
                     that.submitBool = false;
                 }).notLogin(function() {
                     A.login.show(function(user) {
                         that.loadData()
                     });
                     that.submitBool = false;
                 })
             }

         },
         /**
          * 处理页面高度
          **/
         checkHeight: function() {
             var winHeight = window.innerHeight,
                 newHeight = (winHeight - 20),
                 leftMenu = document.querySelector('.left-menu'),
                 pic = leftMenu.querySelector('.pic'),
                 box = document.querySelector('.detail-box'),
                 body = box.querySelector('.detail-body'),
                 imgBox = box.querySelector('.imgRepeatBox');
             box.style.height = winHeight + 'px';
             body.style.height = winHeight + 'px';
             imgBox.style.height = newHeight - 150 + 'px';
             leftMenu.style.height = winHeight + 'px';
             pic.style.height = winHeight + 'px';
         },
         /**
          * 旋转图片
          **/
         rotationImg: function(target) {
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
                 w > h ? box.style.padding = offset + 'px 0' : box.style.width = (300 + offset) * 2 + 'px';
                 target.className = 'img-responsive imgRepeat rotate270'
             } else if (className.match('rotate270')) {
                 target.className = 'img-responsive imgRepeat'
             } else {
                 w > h ? box.style.padding = offset + 'px 0' : box.style.width = (300 + offset) * 2 + 'px';
                 target.className = 'img-responsive imgRepeat rotate90'
             }
         },
         /**
          * 标注图片四角距离
          **/
         dragImg: function() {
             var clientX = 0,
                 clientY = 0,
                 left = 0,
                 top = 0,
                 oLeft = 0,
                 oTop = 0,
                 that = this,
                 point = document.querySelectorAll('.point'),
                 imgBox = document.querySelector('.imgRepeatBox'),
                 img = imgBox.querySelector('img'),
                 imageWidth = document.querySelector('#imageWidth').value,
                 imgHeight = document.querySelector('#imageHeight').value,
                 width = imgBox.clientWidth,
                 height = imgBox.clientHeight;

             if (imgHeight > height) {
                 var scale = imageWidth / imgHeight;
                 if (height * scale > width) img.style.width = '100%';
                 else img.style.width = height * scale + 'px';
             } else {
                 img.style.width = '100%';
             }
             A.each(point, function(index, el) {
                 if (el.className.match('right-top')) {
                     el.style.left = width - 60 + 'px'
                 }
                 if (el.className.match('left-bot')) {
                     el.style.top = height - 60 + 'px'
                 }
                 if (el.className.match('right-bot')) {
                     el.style.left = width - 60 + 'px';
                     el.style.top = height - 60 + 'px';
                 }
                 el.ondragstart = function(event) {
                     clientX = event.clientX;
                     clientY = event.clientY;
                     left = parseInt(el.style.left) || 0;
                     top = parseInt(el.style.top) || 0;
                 }
                 el.ondrag = function(event) {
                     if (event.clientX == 0 && event.clientY == 0) return;
                     oLeft = event.clientX - clientX + left;
                     oTop = event.clientY - clientY + top;
                     el.style.left = oLeft + 'px';
                     el.style.top = oTop + 'px';
                 }
                 el.ondragend = function(event) {
                     if (oLeft > width - 50) oLeft = width - 50;
                     if (oLeft < 0) oLeft = 0;
                     if (oTop > height - 50) oTop = height - 50;
                     if (oTop < 0) oTop = 0;
                     el.style.left = oLeft + 'px';
                     el.style.top = oTop + 'px';
                 }
             });

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
                 that.scalingImg(oLeft, oTop);
             }
             img.ondragend = function(event) {
                     event.preventDefault();
                     left = (event.clientX || event.screenX) - clientX + left;
                     top = (event.clientY || event.screenY) - clientY + top;
                     that.scalingImg(left, top);
                 }
                 /**
                  * 鼠标滚轮单据图片放大
                  **/
             var scrollFunc = function(event) {
                     event.preventDefault();
                     if (event.wheelDelta) {
                         that.scrollImg(event.wheelDelta)
                     } else if (event.detail) {
                         that.scrollImg(event.detail)
                     }
                 }
                 /*注册事件*/
             if (document.addEventListener) {
                 imgBox.addEventListener('DOMMouseScroll', scrollFunc, false);
             }
             imgBox.onmousewheel = scrollFunc;

         },
         scalingImg: function(leftPx, topPx, bool) {
             var img = document.querySelector('.imgRepeat'),
                 left = (parseInt(img.style.left.split('px')[0]) || 0) + leftPx + 'px',
                 top = (parseInt(img.style.top.split('px')[0]) || 0) + topPx + 'px';
             img.style.position = 'absolute';
             if (bool) {
                 img.style.left = left;
                 img.style.top = top;
             } else {
                 img.style.left = leftPx + 'px';
                 img.style.top = topPx + 'px';
             }
         },
         scrollImg: function(detail) {
             var img = document.querySelector('.imgRepeat'),
                 width = img.clientWidth;
             if (detail > 0 && width < 1660) {
                 width += 10;
                 img.style.width = width + 'px'
             } else {
                 if (width < 400) return;
                 width -= 10;
                 img.style.width = width + 'px'
             }
         },
         hotKey: function() {
             var that = this;
             $(window).off('keyup').on('keyup', function(event) {
                 event.preventDefault();
                 var code = event.keyCode;
                 if (code == 33) {
                     $('.pic .cur').prev().click();
                 }
                 if (code == 34) {
                     $('.pic .cur').next().click();
                 }
                 if (code == 37) {
                     that.scalingImg(-30, 0, true);
                 }
                 if (code == 38) {
                     that.scalingImg(0, -30, true);
                 }
                 if (code == 39) {
                     that.scalingImg(30, 0, true);
                 }
                 if (code == 40) {
                     that.scalingImg(0, 30, true);
                 }
                 if (code == 187) {
                     that.scrollImg(1);
                 }
                 if (code == 189) {
                     that.scrollImg(-1);
                 }
                 if (code == 115) {
                     that.rotationImg($('.glyphicon-repeat').get(0));
                 }
                 if (code == 113) {
                     $('.btn-submit').click();
                 }
                 if (code == 13) {
                     $('.btn-save').click();
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
                 // $(".frame").removeClass('active');
                 target.className = 'glyphicon glyphicon-triangle-right';
                 parent.style.left = '-200px';
                 target.style.color = '#ff9729';
                 target.style.background = '#fff';
             } else if (className.match('glyphicon-triangle-right')) {
                 body.className = 'right-body';
                 // $(".frame").addClass('active');
                 target.className = 'glyphicon glyphicon-triangle-left';
                 parent.style.left = 0;
                 target.style.color = '#fff';
                 target.style.background = '#ff9729';
             };
         },
         /**
          * 重置矫正图片
          **/
         resetPaymentImage: function() {
             var that = this,
                 imgbox = document.querySelector('.imgRepeatBox'),
                 data = { id: that.autoId }
             that.order.resetPaymentImage(data).success(function(res) {
                 A.widget.loading.hide();
                 $('.reset').remove();
                 imgbox.querySelector('img').src = '/ukang-admin-web/upload/download?fileName=' + res.imageName + '&paymentNo=' + that.paymentNo;
                 that.picName = res.imageName;
             }).fail(function(res) {
                 A.widget.loading.hide();
                 A.alert(res.rtnMsg)
             })
         },
         /**
          * 重置切割图片
          **/
         resetPreprocessImage: function() {
             var that = this,
                 data = { sourceId: that.sourceId }
             that.order.resetPreprocessImage(data).success(function(res) {
                 A.widget.loading.hide();
                 A.alert("是否重置切割?", function() {
                     $(".frame").remove();
                     $('.reCut').remove();
                     that.reload();
                 })
             }).fail(function(res) {
                 A.widget.loading.hide();
                 A.alert(res.rtnMsg)
             })
         },
         /**
          * 平安案件挂起
          **/
         hangUp: function() {
             var that = this,
                 data = { 'paymentNo': that.paymentNo, 'hangup': 1 };
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
                         that.order.hangUpForPingAn(data).success(function(res) {
                             that.reload();
                         }).fail(function(res) {
                             A.alert(res.rtnMsg)
                         })
                     }
                 }
             });

         },
         /**
          * 点击矫正
          **/
         testCorrect: function(className, target, autoBool) {
             var that = this,
                 imgbox = document.querySelector('.imgRepeatBox'),
                 img = document.querySelector('.imgRepeat'),
                 point = document.querySelectorAll('.point'),
                 width = document.querySelector('#imageWidth').value || 1660,
                 scale = width / img.clientWidth,
                 receiptType = document.querySelector('#receiptType').value,
                 hospitalName = document.querySelector('#hospitalName').value,
                 pointBool = false,
                 correct = 'testCorrect';
             if (receiptType === '') {
                 A.alert('请选择类型')
                 return;
             } else if (that.receiptTypeArr[receiptType] == undefined) {
                 A.alert('请输入正确类型')
                 return;
             }
             if (!that.hospitalId) {
                 A.alert('请输入医院')
                 return;
             }
             A.widget.loading.show({
                 message: '模板矫正中...'
             });
             var data = {
                 hospitalId: that.hospitalId,
                 type: that.receiptTypeArr[receiptType],
                 id: that.autoId,
                 imageName: that.picName,
                 paymentNo: that.paymentNo,
             }

             A.each(point, function(index, el) {
                 var left = parseInt(el.style.left.split('px')[0]),
                     top = parseInt(el.style.top.split('px')[0]),
                     index = 'leftTopPoint';

                 if (el.className.match('right-top')) {
                     index = 'rightTopPoint';
                 }
                 if (el.className.match('left-bot')) {
                     index = 'leftBottomPoint'
                 }
                 if (el.className.match('right-bot')) {
                     index = 'rightBottomPoint';
                 }
                 data[index] = {
                     'x': parseInt((left + 25) * scale),
                     'y': parseInt((top + 25) * scale)
                 }
                 if (!left || !top) pointBool = true;
             });
             if (autoBool) {
                 correct = 'autoCorrect'
             }
             if (pointBool && !autoBool) {
                 A.widget.loading.hide();
                 A.alert('请正确标记位置');
             } else {
                 $('.redress,.reset,.btn-save,.autoCorrect').attr('disabled', true)
                 that.order[correct](data).success(function(res) {
                     A.widget.loading.hide()
                     A.alert('矫正成功')
                     $('.redress,.reset,.btn-save,.autoCorrect').removeAttr('disabled')
                     $('.reset').remove()
                     $('.redress').after('&nbsp;&nbsp;<button type="button" class="btn btn-primary reset">重置矫正</button>')
                     imgbox.querySelector('img').src = '/ukang-admin-web/upload/downloadNamePhoto?fileName=' + res.correctImagePath + '&paymentNo=' + data.paymentNo
                 }).fail(function(res) {
                     A.widget.loading.hide()
                     $('.redress,.reset,.btn-save,.autoCorrect').removeAttr('disabled')
                     that.doOCR = false
                     A.alert(res.rtnMsg)
                 })
             }
         },
         /**
          * 选择拒单原因
          **/
         reasonFun: function(className, target) {
             var text = target.innerHTML,
                 reason = document.querySelector('#reason'),
                 index = document.querySelector('#index'),
                 reasonBox = document.querySelector('.reasonBox'),
                 otherReason = document.querySelector('.otherReason'),
                 body = document.querySelector('.right-body');
             reasonBox.innerHTML = text + ' <span class="caret"></span>';
             if (text == '选择拒单原因') {
                 reason.value = ''
                 $('.otherReason').addClass('hide');
                 return
             }
             if (text == '其他原因') {
                 reason.value = '其他原因';
                 $('.otherReason').removeClass('hide');
                 otherReason.onkeyup = function(ev) {
                     reason.value = ev.target.value;
                 }
             } else {
                 $('.otherReason').addClass('hide');
                 reason.value = text;
                 index.value = "0" + ($(target).index('.reason') + 1);
             }
         },
         /**
          * 验证发票号重复
          **/
         checkInvoiceNo: function(id, value) {
             var that = this,
                 data = { 'id': id, 'invoiceNo': value, 'tenantId': that.tenantId };


             that.order.invoiceNoExist(data).success(function(res) {
                 if (res.exist) {
                     A.alert(res.rtnMsg)
                 }
             }).fail(function(res) {
                 A.alert(res.rtnMsg)
             }).notLogin(function() {
                 A.login.show(function(user) {
                     that.loadData()
                 });
             })
         },
         /**
          * 关闭页面时单据状态重置
          **/
         changeStatus: function(status) {
             var that = this;
             var data = {
                 id: that.autoId,
                 destStatus: status
             }
             that.order.changeStatusState(data)
         },
         /**
          * 选择为其他单据调用接口
          **/
         otherOrder: function(type) {
             var that = this,
                 data = { autoId: that.autoId, type: type }
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
          * 加载批次所有图片
          */
         loadImg: function() {
             var that = this;
             // var data = { paymentNo: that.paymentNo }
             var data = { paymentNo: that.paymentNo, tenantId: that.tenantId }
             if (that.paymentNo) {
                 that.order.getPreprocessImageList(data).success(function(res) {
                     $('.left-menu .pic').html("");
                     //显示图片
                     // var imgList = res.imgs;
                     var imgList = res.casePaymentList;
                     for (var i = 0; i < imgList.length; i++) {
                         var img = imgList[i].imgName,
                             type = imgList[i].picType,
                             bigImg = imgList[i].bigImgName,
                             cur = bigImg.match(that.picName.split('.')[0]) ? 'cur' : '',
                             image = '<img class="' + cur + '" data-img="' + that.getImgPath(bigImg, data.paymentNo) + '" src="' + that.getImgPath(img, data.paymentNo) + '">';
                         if (cur == 'cur') { //当前图片
                             $('.left-menu .pic').prepend(image);
                         } else {
                             $('.left-menu .pic').append(image);
                         }
                     }
                 }).fail(function(res) {
                     A.alert(res.rtnMsg);
                 }).notLogin(function(res) {
                     A.widget.loading.hide();
                 })
             }
         },
         tabDetail: function(options) {
             var that = this;
             $(options.container).html(template(options.templateId, options.data));
         },
         /**
          * 添加切割框
          */
         addFrame: function() {
             var $div = '<div class="frame verify-item">\
                            <div class="item">\
                                <div class="item-left"></div>\
                                <div class="item-top"></div>\
                                <div class="item-content"></div>\
                                <div class="item-right"></div>\
                                <div class="item-bottom"></div>\
                                <div class="item-point"></div>\
                                <div class="item-delete">取消</div>\
                            </div>\
                        </div>'

             //点击添加图框
             $(".add-frame").click(function() {
                 $(".imgRepeatBox").append($div);
                 var oBoxs = $(".frame");
                 for (var i = 0; i < oBoxs.length; i++) {
                     drag(oBoxs[i]);
                 };
                 //点击取消
                 $(".frame .item-delete").click(function() {
                     $(this).parent().parent().remove();
                 })
             });
             //实现拖拽方法
             function drag(oBox) {
                 oBox.onmousedown = function(ev) {
                     var X = '';
                     var Y = '';
                     var Z = '';
                     var iEvent = ev || event;
                     iEvent.preventDefault();
                     var W = oBox.offsetWidth;
                     var H = oBox.offsetHeight;
                     var disX = iEvent.clientX;
                     var disY = iEvent.clientY;
                     var disxW = oBox.offsetLeft + W;
                     var disyH = oBox.offsetTop + H;
                     //点击点相对于盒子的坐标
                     var boxX = disX - oBox.offsetLeft;
                     var boxY = disY - oBox.offsetTop;
                     //边框操作
                     if ((disX > $(oBox).offset().left + W - 8 && disX < $(oBox).offset().left + W + 8) && (disY > $(oBox).offset().top + H - 8 && disY < $(oBox).offset().top + H + 8)) {
                         Z = 'right-bottom';
                     } else if (disX > $(oBox).offset().left + W - 5 && disX < $(oBox).offset().left + W + 5) {
                         X = 'right';
                     } else if (disX < $(oBox).offset().left + 5 && disX > $(oBox).offset().left - 5) {
                         X = 'left';
                     } else if (disY > $(oBox).offset().top + H - 5 && disY < $(oBox).offset().top + H + 5) {
                         Y = 'bottom';
                     } else if (disY < $(oBox).offset().top + 5 && disY > $(oBox).offset().top - 5) {
                         Y = 'top';
                     };
                     document.onmousemove = function(ev) {
                         var iEvent = ev || event;
                         iEvent.preventDefault();
                         if (X == 'right') {
                             oBox.style.width = W + (iEvent.clientX - disX) + 'px';
                         } else if (X == 'left') {
                             oBox.style.width = W - (iEvent.clientX - disX) + 'px';
                             oBox.style.left = disxW - oBox.offsetWidth + 'px';
                         } else if (Y == 'bottom') {
                             oBox.style.height = H + (iEvent.clientY - disY) + 'px';
                         } else if (Y == 'top') {
                             oBox.style.height = H - (iEvent.clientY - disY) + 'px';
                             oBox.style.top = disyH - oBox.offsetHeight + 'px';
                         } else if (Z == 'right-bottom') {
                             oBox.style.width = W + (iEvent.clientX - disX) + 'px';
                             oBox.style.height = H + (iEvent.clientY - disY) + 'px';
                         } else {
                             //拖动盒子
                             oBox.style.left = iEvent.clientX - boxX + "px";
                             oBox.style.top = iEvent.clientY - boxY + "px";
                         }
                     };
                     document.onmouseup = function() {
                         document.onmousedown = null;
                         document.onmousemove = null;
                         X = "";
                         Y = "";
                         Z = "";
                     }
                 };
                 oBox.onmouseover = function() {
                     document.onkeyup = function(ev) {
                         var iEvent = ev || event;
                         iEvent.preventDefault();
                         iEvent.stopPropagation();
                         var width = oBox.offsetWidth;
                         var height = oBox.offsetHeight;
                         var left = oBox.offsetLeft;
                         var top = oBox.offsetTop;
                         if (ev.ctrlKey == true && ev.keyCode == 37) {
                             oBox.style.width = parseInt(width) + 1 + 'px';
                             oBox.style.left = parseInt(left) - 1 + 'px';
                         }
                         if (ev.ctrlKey == true && ev.keyCode == 38) {
                             oBox.style.height = parseInt(height) + 1 + 'px';
                             oBox.style.top = parseInt(top) - 1 + 'px';
                         }
                         if (ev.ctrlKey == true && ev.keyCode == 39) {
                             oBox.style.width = parseInt(width) + 1 + 'px';
                         }
                         if (ev.ctrlKey == true && ev.keyCode == 40) {
                             oBox.style.height = parseInt(height) + 1 + 'px';
                         }
                     };
                     oBox.onmouseleave = function() {
                         document.onkeyup = null;
                     }
                 }
             }
         },
         /**
          * 确认单据切割
          */
         receiptsCut: function() {
             var that = this;
             var cutImageNameList = null;
             //确定切割(接口)
             $('.affirm-cut').click(function() {
                 var boxSize = [];
                 var imageWidth0 = document.querySelector('#imageWidth').value;
                 var imgHeight0 = document.querySelector('#imageHeight').value;
                 var imageWidth1 = parseInt($(".imgRepeatBox>img").css("width").split('px')[0]) || 0;
                 var imageHeight1 = parseInt($(".imgRepeatBox>img").css("height").split('px')[0]) || 0;
                 var rateX = imageWidth0 / imageWidth1;
                 var rateY = imgHeight0 / imageHeight1;
                 var imgX = document.querySelector('.imgRepeat').offsetLeft;
                 var imgY = document.querySelector('.imgRepeat').offsetTop;

                 for (var i = 0; i < $(".frame").length; i++) {
                     var obj = {};
                     var h0 = $(".frame")[i].offsetHeight;
                     var w0 = $(".frame")[i].offsetWidth;
                     var x0 = $(".frame")[i].offsetLeft;
                     var y0 = $(".frame")[i].offsetTop;
                     obj.h = Math.ceil(h0 * rateY);
                     obj.w = Math.ceil(w0 * rateX);
                     // obj.x = Math.floor(x0 * rateX) > 0 ? Math.floor(x0 * rateX) : 0;
                     // obj.y = Math.floor(y0 * rateY) > 0 ? Math.floor(y0 * rateY) : 0;
                     obj.x = Math.floor((x0 - imgX) * rateX) > 0 ? Math.floor((x0 - imgX) * rateX) : 0;
                     obj.y = Math.floor((y0 - imgY) * rateY) > 0 ? Math.floor((y0 - imgY) * rateY) : 0;
                     boxSize[i] = obj;
                 }
                 //向后台发ajax请求
                 var data = {
                     "imageName": that.picName,
                     "paymentNo": that.paymentNo,
                     "pointList": boxSize
                 }
                 that.order.getCutImage(data).success(function(res) {
                     $(".small-imgs").html("");
                     $(".show-left").html("");
                     cutImageNameList = res.cutImageNameList;
                     var src0 = that.getImgPath(res.cutImageNameList[0], that.paymentNo) + "&time=" + new Date().getTime();
                     $(".show-left").append('<img style="max-height:90%;max-width:90%;" src="' + src0 + '">');
                     for (var i = 0; i < res.cutImageNameList.length; i++) {
                         var src = that.getImgPath(res.cutImageNameList[i], that.paymentNo) + "&time=" + new Date().getTime();
                         if (i == 0) {
                             $(".small-imgs").append('<img src="' + src + '" class="active">');
                         } else {
                             $(".small-imgs").append('<img src="' + src + '">');
                         }
                     };
                     //点击切换图片
                     $(".small-imgs img").click(function() {
                         $(this).addClass('active');
                         $(this).siblings().removeClass('active');
                         var src = $(this).attr('src');
                         $(".show-left>img").attr('src', src);
                         zoom2();
                     });
                     $("#mask").show();
                     $(".show-imgs").show();
                     zoom2();
                     //按比例缩放方法
                     function zoom2() {
                         var boxHeight = $(".show-left").height();
                         var boxWidth = $(".show-left").width();
                         var imgHeight = $(".show-left>img").height();
                         var imgWidth = $(".show-left>img").width();
                         if (imgHeight > boxHeight) {
                             $(".show-left>img").css("height", "90%");
                         } else if (imgWidth > boxWidth) {
                             $(".show-left>img").css("width", "90%");
                         }
                     }
                 }).fail(function(res) {
                     A.alert(res.rtnMsg)
                 });
             });

             //确定提交(接口)      
             $('.submit').unbind("click").click(function() {
                 $("#mask").hide();
                 $(".show-imgs").hide();
                 $(".frame").remove();
                 var data = {
                     "cutImageNameList": cutImageNameList,
                     "sourceId": that.sourceId,
                     "id": that.autoId
                 }
                 that.order.saveCutImage(data).success(function(res) {
                     A.alert(res.rtnMsg)
                     $('.reCut').remove()
                     $('.affirm-cut').after('<button type="button" class="btn btn-primary reCut">重置切割</button>');
                     that.loadData();
                 }).fail(function(res) {
                     A.alert(res.rtnMsg)
                 })
             });
             //重新切割
             $('.restart').click(function() {
                 $("#mask").hide();
                 $(".show-imgs").hide();
                 $(".frame").remove();
             });
         },
         /**
          * 案件撤回检查 
          */
         isWithdraw: function() {
             var that = this;
             var searchData = { "paymentNo": that.paymentNo };
             /*var timer = null;
             timer = setInterval(function() {
                 that.order.checkWithdraw(searchData).success(function(res) {
                     if (res.data.isBack == 1) {
                         clearInterval(timer);
                         A.alert("案件已撤回", function() {
                             that.reload();
                         });
                     }
                 }).fail(function(res) {
                     A.alert(res.rtnMsg)
                 })
             }, 3000);*/
             var request = A.ajax({
                 url: that.ServerPath + '/casePreprocess/checkWithdraw',
                 emulate: true,
                 data: searchData,
                 type: "GET",
                 dataType: 'json',
                 timeout: 60000,
                 success: function(res) {
                     if (res.data.isBack == 1) {
                         A.alert("案件已撤回", function() {
                             that.reload();
                         });
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
          * 不同公司的拒单原因 
          */
         addReason: function(reasonArr) {
             var html = [];
             A.each(reasonArr, function(index, el) {
                 html.push('<li><a href="javascript:;" class="reason">' + el + '</a></li>')
             });
             $('.reasonBox').next().html(html.join(''));
         },
         /**
          * 平安历史发票号下拉列表 
          */
         pullDown: function(list) {
             $("#past").html("");
             var invoiceNumber = "<option value='' selected >请选择发票号</option>";
             for (var i = 0; i < list.length; i++) {
                 invoiceNumber += '<option value="' + list[i] + '">' + list[i] + '</option>';
             };
             $("#No").addClass('hide');
             $("#past").removeClass('hide').append(invoiceNumber);
         },
         /**
          * 显示单据子类型 
          */
         showSubType: function(fuc, op, item) {
             var that = this;
             that.city = item['city'];
             if (item['city'].match('北京') && $('#receiptType').val() == 1) {
                 $('.subPicType').removeClass('hide');
             } else {
                 $('.subPicType').addClass('hide');
             }
         },
         /**
          * 模糊查询时缓存医院编码 
          */
         getPinganHospitalCode: function(fuc, op, item) {
            var that = this;
            that.pingAnHospitalCode = item['customerHospitalCode'];
         }


     });

     $(function() {
         var page = new CT()
         page.onReady()

     });

 })(my);
